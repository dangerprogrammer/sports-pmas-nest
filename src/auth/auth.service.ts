import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SigninDto, SignupDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { Admin, Aluno, Professor, Solic, User } from '@prisma/client';
import { LocalDto } from './dto/local.dto';
import { ModalidadeDto } from './dto/modalidade.dto';
import { AcceptDto } from './dto/accept.dto';
import { UpdateLocalDto, UpdateModalidadeDto, UpdateSolicDto, UpdateUserDto } from './dto/updates.dto';
import { InscricaoDto } from './dto/inscricao.dto';
import { SolicDto } from './dto/solic.dto';

@Injectable()
export class AuthService {
    protected types = {
        'aluno'(elem: any) {
            return elem as Aluno;
        },
        'professor'(elem: any) {
            return elem as Professor;
        },
        'admin'(elem: any) {
            return elem as Admin;
        }
    };

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) { }

    async signupLocal({ password, aluno, professor, admin, solic, inscricoes, ...data }: SignupDto) {
        const hash = await this.hashData(password);

        let newUser = await this.prisma.user.create({ data: { ...data, hash } });

        newUser = await this.updateUserRoles(newUser, aluno, professor, admin, solic, inscricoes);

        const tokens = await this.getTokens(newUser.id, newUser.cpf);

        await this.updateRtHash(newUser.id, tokens.refresh_token);

        return tokens;
    }

    async signinLocal({ password, cpf }: SigninDto) {
        const user = await this.prisma.user.findUnique({ where: { cpf } });

        if (!user) throw new ForbiddenException("Access Denied");

        const passwordMatches = await bcrypt.compare(password, user.hash);

        if (!passwordMatches) throw new ForbiddenException("Access Denied");

        const tokens = await this.getTokens(user.id, user.cpf);

        await this.updateRtHash(user.id, tokens.refresh_token);

        return tokens;
    }

    async comparePassword({ password, cpf }: SigninDto) {
        const user = await this.prisma.user.findUnique({ where: { cpf } });

        if (!user) throw new ForbiddenException("Access Denied");

        return await bcrypt.compare(password, user.hash);
    }

    async subscribeUser(inscricoes: InscricaoDto[], req: any) {
        const { user } = req;
        const aluno = await this.prisma.aluno.findUnique({ where: { id: user.sub } });
        const professor = await this.prisma.professor.findUnique({ where: { id: user.sub } });

        return this.createInscricoes(inscricoes, aluno, professor);
    }

    async createLocal(local: LocalDto) {
        const localidade = await this.prisma.localidade.upsert({
            where: local,
            update: local,
            create: local
        });

        return localidade;
    }

    async updateLocal({ local: { endereco, bairro }, update }: UpdateLocalDto) {
        const local = await this.prisma.localidade.findUnique({ where: { endereco, bairro } });

        if (local) await this.prisma.localidade.update({ where: { endereco, bairro }, data: update });
        else throw new ForbiddenException("Local not found");

        return await this.prisma.localidade.findUnique({ where: { endereco, bairro } });
    }

    async deleteLocal(local: LocalDto) {
        const localidade = await this.prisma.localidade.findUnique({ where: local });

        if (localidade) {
            await this.prisma.modalidade.deleteMany({ where: { local } });

            await this.prisma.localidade.delete({ where: local });
        };

        return 'Local deleted successfully';
    }

    async createModalidade({ name, local, horarios, vagas }: ModalidadeDto) {
        const hasLocal = await this.createLocal(local);

        const modalidade = await this.prisma.modalidade.upsert({
            where: { name },
            update: { local: { connect: hasLocal }, vagas: +vagas },
            create: { name, local: { connect: hasLocal }, vagas: +vagas, available: +vagas }
        });

        await (async () => {
            for (let horario of horarios) await this.prisma.horario.upsert({
                where: horario,
                update: { modalidades: { connect: modalidade } },
                create: { ...horario, modalidades: { connect: modalidade } }
            });
        })();

        return modalidade;
    }

    async updateModalidade({ name, update }: UpdateModalidadeDto) {
        const modalidade = await this.prisma.modalidade.findUnique({ where: { name } });

        if (modalidade) await this.prisma.modalidade.update({
            where: { name }, data: {
                ...update,
                ...(update.vagas && { vagas: +update.vagas }),
                ...(update.available && { available: +update.available }),
                local: {}, horarios: {}
            }
        });
        else throw new ForbiddenException("Modalidade not found");

        if (update.horarios) await (async () => {
            const modalidadeHorarios = (await this.prisma.horario.findMany({
                where: { modalidades: { some: { id: modalidade.id } } }
            })).map(({ id }) => { return { id } });

            await this.prisma.modalidade.update({
                where: { id: modalidade.id },
                data: {
                    horarios: {
                        disconnect: modalidadeHorarios
                    }
                }
            })

            for (let horario of update.horarios) {
                await this.prisma.horario.upsert({
                    where: { id: horario.id },
                    update: { modalidades: { set: { id: modalidade.id } } },
                    create: { ...horario, modalidades: { connect: { id: modalidade.id } } }
                });
            };
        })();

        if (update.local) {
            const local = await this.createLocal(update.local);

            await this.prisma.modalidade.update({ where: { id: modalidade.id }, data: { local: { connect: { id: local.id } } } });
        };

        if (update.vagas && !update.available) await this.prisma.modalidade.update({
            where: { id: modalidade.id },
            data: { available: modalidade.available + (update.vagas - modalidade.vagas) }
        });

        return await this.prisma.modalidade.findUnique({ where: { id: modalidade.id } });
    }

    async deleteModalidade({ name }: ModalidadeDto) {
        const modalidade = await this.prisma.modalidade.findUnique({ where: { name } });

        if (modalidade) await this.prisma.modalidade.delete({ where: { name } });

        return 'Modalidade deleted successfully';
    }

    async acceptUser(auth: string, { cpf, accepted }: AcceptDto) {
        const token = auth.split(' ')[1];
        const { sub } = jwt.verify(token, 'at-secret') as any;
        const user = await this.prisma.user.findUnique({ where: { cpf } });

        if (!user) throw new ForbiddenException("User not found");
        if (user.accepted) return !0;

        await this.updateSolic({ cpf, update: { done: !0, accepted } });
        await this.prisma.solic.update({ where: { userId: user.id }, data: { doneAt: new Date(), doneBy: { connect: { id: sub } } } });

        if (accepted) {
            const { roles } = await this.prisma.solic.findUnique({ where: { userId: user.id } });

            await this.updateUser({ cpf, update: { roles, accepted } });

            const admins = await this.prisma.admin.findMany({ where: { accepted: !0 } });
            const adminsID = admins.map(({ id }) => { return { id } });

            const isAluno = await this.prisma.aluno.findUnique({ where: { id: user.id } });

            if (isAluno) await this.refreshModalidade(user.id);
            if (roles.find(role => role == 'ADMIN')) {
                const solics = await this.prisma.solic.findMany();

                for (const { id } of solics) await this.prisma.solic.update({
                    where: { id },
                    data: { toAdmins: { set: adminsID } }
                });
            };

            return await this.prisma.user.findUnique({ where: { cpf } });
        };

        return !1;
    }

    async updateUser({ cpf, update }: UpdateUserDto) {
        const user = await this.prisma.user.findUnique({ where: { cpf } });

        let hash: string;
        if (update.password) {
            hash = await this.hashData(update.password);

            delete update.password;
        };

        if (update.aluno) update.aluno = { update: update.aluno };

        if (update.inscricoes) {
            const aluno = await this.prisma.aluno.findUnique({ where: { id: user.id } });
            const professor = await this.prisma.professor.findUnique({ where: { id: user.id } });

            if (user) {
                const inscricoes = await this.prisma.inscricao.findMany({
                    where: { OR: [ { alunoId: user.id }, { professorId: user.id } ] }
                });

                await (async () => {
                    for (const { id } of inscricoes) await this.prisma.inscricao.update({
                        where: { id },
                        data: {
                            aluno: { disconnect: !0 },
                            professor: { disconnect: !0 }
                        }
                    });
                })();

                await this.createInscricoes(update.inscricoes, aluno, professor);
            };

            delete update.inscricoes;
        };

        if (user) await this.prisma.user.update({ where: { cpf }, data: { ...update, ...(hash && { hash }) } });
        else throw new ForbiddenException("User not found");

        return await this.prisma.user.findUnique({ where: { cpf } });
    }

    async createSolic({ cpf, roles }: SolicDto) {
        const user = await this.prisma.user.findUnique({ where: { cpf } });

        const admins = await this.prisma.admin.findMany({ where: { accepted: !0 } });
        const adminsID = admins.map(({ id }) => { return { id } });

        const hasSolic = await this.prisma.solic.findUnique({ where: { userId: user.id } });

        if (!(user.accepted || hasSolic)) await this.prisma.solic.create({
            data: { roles, toAdmins: { connect: adminsID }, from: { connect: { id: user.id } } }
        });

        const solicNotif = { backAPI: !0, submitAction: 'goLogin', text: 'Solicitação criada com sucesso!' };

        return user.accepted || hasSolic || solicNotif;
    }

    async updateSolic({ cpf, update }: UpdateSolicDto) {
        const user = await this.prisma.user.findUnique({ where: { cpf } });
        const hasSolic = await this.prisma.solic.findUnique({ where: { userId: user.id } });

        if (hasSolic) await this.prisma.solic.update({ where: { userId: user.id }, data: update });
        else throw new ForbiddenException("Solic not found");

        return await this.prisma.solic.findUnique({ where: { userId: user.id } });
    }

    async logout(userId: number) {
        await this.prisma.user.updateMany({
            where: {
                id: userId,
                hashedRt: { not: null }
            },
            data: { hashedRt: null }
        });
    }

    async refreshTokens(userId: number, rt: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });

        if (!user || !user.hashedRt) throw new ForbiddenException("Access Denied");

        rt = rt.split(' ')[rt.split(' ').length - 1];

        const rtMatches = await bcrypt.compare(rt, user.hashedRt);

        if (!rtMatches) throw new ForbiddenException("Access Denied");

        const tokens = await this.getTokens(user.id, user.cpf);

        await this.updateRtHash(user.id, tokens.refresh_token);

        return tokens;
    }

    async createInscricoes(inscricoes: InscricaoDto[], aluno?: Aluno, professor?: Professor) {
        const createdInscricoes = [];

        await (async () => {
            for (const { aula, horario, week_day } of inscricoes) {
                const prismaHorario = await this.prisma.horario.findFirst({ where: { time: horario, day: week_day } });

                if (!prismaHorario) throw new ForbiddenException("Don't exists this horario!");

                const { id } = await this.prisma.inscricao.create({
                    data: {
                        aula,
                        ...(aluno && { aluno: { connect: { id: aluno.id } } }),
                        ...(professor && { professor: { connect: { id: professor.id } } }),
                        horario: { connect: prismaHorario }
                    }
                });

                createdInscricoes.push(await this.prisma.inscricao.findUnique({ where: { id } }));
            }
        })();

        return createdInscricoes;
    }

    async refreshModalidade(id: number) {
        const inscricoes = await this.prisma.inscricao.findMany({ where: { OR: [{ alunoId: id }, { professorId: id }] } });

        await (async () => {
            for (const { aula } of inscricoes) {
                const modalidade = await this.prisma.modalidade.findUnique({ where: { name: aula } });
                const alunosID = (await this.prisma.aluno.findMany({
                    where: { inscricoes: { some: { aula } }, accepted: !0 }
                })).map(({ id }) => { return { id } });
                const professorsID = (await this.prisma.professor.findMany({
                    where: { inscricoes: { some: { aula } }, accepted: !0 }
                })).map(({ id }) => { return { id } });

                if (!modalidade) throw new ForbiddenException("Modalidade not found");
                if (alunosID.length > modalidade.vagas) throw new ForbiddenException(`Ah não! Esta modalidade já está lotada! (Max: ${modalidade.vagas})`);

                await this.prisma.modalidade.update({
                    where: { name: aula },
                    data: { available: modalidade.vagas - alunosID.length, alunos: { set: alunosID }, professores: { set: professorsID } }
                });
            };
        })();
    }

    async updateUserRoles(user: User, aluno: Aluno, professor: Professor, admin: Admin, solic: Solic, inscricoes: InscricaoDto[]) {
        const { data, include }: { data: any, include: any } = { data: {}, include: {} };

        if (solic) {
            const admins = await this.prisma.admin.findMany({ where: { accepted: !0 } });
            const adminsID = admins.map(({ id }) => { return { id } });

            await this.prisma.solic.create({
                data: { roles: solic.roles, toAdmins: { connect: adminsID }, from: { connect: { id: user.id } } }
            });
        };

        await (async () => {
            for (const role of solic.roles) {
                const lower = role.toLowerCase();
                let create = eval(lower);

                include[lower] = !0;
                if (create) {
                    if ('menor' in create) create['menor'] = { create: create['menor'] };

                    data[lower] = 'inscricoes' in create ? { create: { ...create, inscricoes: {} } } : { create };
                };
            };

            await this.prisma.user.update({ where: { id: user.id }, data, include });
        })();

        await (async () => {
            const role = solic.roles.find(role => role == 'ALUNO' || role == 'PROFESSOR');

            if (role) {
                const create = eval(role.toLowerCase());

                if (create) {
                    const aluno = await this.prisma.aluno.findUnique({ where: { id: user.id } });
                    const professor = await this.prisma.professor.findUnique({ where: { id: user.id } });

                    await this.createInscricoes(inscricoes, aluno, professor);
                };
            };
        })();

        return await this.prisma.user.findUnique({ where: { id: user.id } });
    }

    async updateRtHash(userId: number, rt: string) {
        const hash = await this.hashData(rt);

        await this.prisma.user.update({
            where: { id: userId },
            data: { hashedRt: hash }
        });
    }

    hashData(data: string) {
        return bcrypt.hash(data, 10);
    }

    async getTokens(userId: number, cpf: string) {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId, cpf
            }, {
                secret: 'at-secret',
                expiresIn: 60 * 30,
            }),
            this.jwtService.signAsync({
                sub: userId, cpf
            }, {
                secret: 'rt-secret',
                expiresIn: 60 * 60 * 24 * 90,
            })
        ]);

        return { access_token: at, refresh_token: rt };
    }
}
