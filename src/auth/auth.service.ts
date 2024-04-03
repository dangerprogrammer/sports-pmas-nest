import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SigninDto, SignupDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { Admin, Aluno, Professor, Solic, User } from '@prisma/client';
import { LocalDto } from './dto/local.dto';
import { ModalidadeDto } from './dto/modalidade.dto';
import { AcceptDto } from './dto/accept.dto';
import { UpdateLocalDto, UpdateModalidadeDto, UpdateUserDto } from './dto/updates.dto';
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

    async signupLocal({ password, aluno, professor, admin, solic, inscricoes, ...data }: SignupDto): Promise<Tokens> {
        const hash = await this.hashData(password);

        let newUser = await this.prisma.user.create({ data: { ...data, hash } });

        newUser = await this.updateUserRoles(newUser, aluno, professor, admin, solic);

        const isAluno = await this.prisma.aluno.findUnique({ where: { id: newUser.id } });

        if (isAluno) await this.refreshModalidade(isAluno);

        const tokens = await this.getTokens(newUser.id, newUser.cpf);

        await this.updateRtHash(newUser.id, tokens.refresh_token);

        return tokens;
    }

    async signinLocal({ password, cpf }: SigninDto): Promise<Tokens> {
        const user = await this.prisma.user.findUnique({ where: { cpf } });

        if (!user) throw new ForbiddenException("Access Denied");

        const passwordMatches = await bcrypt.compare(password, user.hash);

        if (!passwordMatches) throw new ForbiddenException("Access Denied");

        const tokens = await this.getTokens(user.id, user.cpf);

        await this.updateRtHash(user.id, tokens.refresh_token);

        return tokens;
    }

    async subscribeUser(inscricoes: InscricaoDto[], req: any) {
        const { user } = req;
        const prismaUser = await this.prisma.aluno.findUnique({ where: { id: user.sub } });

        return this.createInscricoes(inscricoes, prismaUser);
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

    async createModalidade({ name, local, horarios }: ModalidadeDto) {
        const hasLocal = await this.createLocal(local);

        const modalidade = await this.prisma.modalidade.upsert({
            where: { name },
            update: { local: { connect: hasLocal } },
            create: { name, local: { connect: hasLocal } }
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

        if (modalidade) await this.prisma.modalidade.update({ where: { name }, data: { ...update, local: {}, horarios: {} } });
        else throw new ForbiddenException("Modalidade not found");

        if (update.horarios) await (async () => {
            for (let horario of update.horarios) await this.prisma.horario.upsert({
                where: horario,
                update: { modalidades: { set: modalidade } },
                create: { ...horario, modalidades: { connect: modalidade } }
            });
        })();

        if (update.local) {
            await this.createLocal(update.local);

            await this.prisma.modalidade.update({ where: { name }, data: { local: { connect: update.local } } });
        };

        return await this.prisma.modalidade.findUnique({ where: { id: modalidade.id } });
    }

    async deleteModalidade({ name }: ModalidadeDto) {
        const modalidade = await this.prisma.modalidade.findUnique({ where: { name } });

        if (modalidade) await this.prisma.modalidade.delete({ where: { name } });

        return 'Modalidade deleted successfully';
    }

    async acceptUser({ cpf, accepted }: AcceptDto) {
        const user = await this.prisma.user.findUnique({ where: { cpf } });

        if (!user) throw new ForbiddenException("Don't has user!");
        if (user.accepted) return !0;

        if (accepted) {
            const { roles } = await this.prisma.solic.findUnique({ where: { userId: user.id } });

            await this.prisma.solic.deleteMany({ where: { userId: user.id } });

            return await this.prisma.user.update({ where: { cpf }, data: { roles, accepted } });
        } else {
            await this.prisma.solic.deleteMany({ where: { userId: user.id } });

            return !1;
        };
    }

    async updateUser({ cpf, update }: UpdateUserDto) {
        const user = await this.prisma.user.findUnique({ where: { cpf } });

        if (user) await this.prisma.user.update({ where: { cpf }, data: update });
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

    async createInscricoes(inscricoes: InscricaoDto[], { id }: Aluno) {
        const createdInscricoes = [];

        await (async () => {
            for (const { aula, horario } of inscricoes) {
                const prismaHorario = await this.prisma.horario.findUnique({ where: { time: horario } });

                if (!prismaHorario) throw new ForbiddenException("Don't exists this horario!");

                createdInscricoes.push(await this.prisma.inscricao.upsert({
                    where: { time: horario },
                    update: { aluno: { connect: { id } }, horario: { connect: prismaHorario } },
                    create: { aula, aluno: { connect: { id } }, horario: { connect: prismaHorario } }
                }));
            }
        })();

        return createdInscricoes;
    }

    async refreshModalidade(aluno: any) {
        const inscricoesDoAluno = await this.prisma.inscricao.findMany({ where: { alunoId: aluno.id } });

        await (async () => {
            for (const inscricao of inscricoesDoAluno) {
                const modalidade = await this.prisma.modalidade.findUnique({ where: { name: inscricao.aula } });
                const alunosID = (await this.prisma.aluno.findMany({
                    where: { inscricoes: { some: inscricao } }
                })).map(({ id }) => { return { id } });

                if (!modalidade) throw new ForbiddenException(`Don't exists modalidade "${inscricao.aula}"`);
                if (alunosID.length > modalidade.vagas) throw new ForbiddenException(`Ah não! Esta modalidade já está lotada! (Max: ${modalidade.vagas})`);

                await this.prisma.modalidade.update({
                    where: { name: inscricao.aula },
                    data: { available: modalidade.vagas - alunosID.length, alunos: { set: alunosID } }
                });
            };
        })();
    }

    async updateUserRoles(user: User, aluno: Aluno, professor: Professor, admin: Admin, solic: Solic) {
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
            const roleAluno = solic.roles.find(role => role == 'ALUNO');

            if (roleAluno) {
                const create = eval(roleAluno.toLowerCase());

                if (create) {
                    const aluno = await this.prisma.aluno.findUnique({ where: { id: user.id } });

                    if ('inscricoes' in create) await this.createInscricoes(create['inscricoes'], aluno);
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
