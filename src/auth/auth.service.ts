import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { Admin, Aluno, Professor, User } from '@prisma/client';
import { LocalDto } from './dto/local.dto';
import { ModalidadeDto } from './dto/modalidade.dto';
import { AcceptDto } from './dto/accept.dto';
import { UpdateLocalDto, UpdateModalidadeDto } from './dto/updates.dto';

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

    async signupLocal({ password, cpf, roles, nome_comp, aluno, professor, admin, solic }: AuthDto): Promise<Tokens> {
        const hash = await this.hashData(password);

        let newUser = await this.prisma.user.create({ data: { cpf, roles, nome_comp, hash } });

        newUser = await this.updateUserRoles(newUser, aluno, professor, admin, solic);

        const isAluno = await this.prisma.aluno.findUnique({ where: { id: newUser.id } });

        if (isAluno) await this.refreshModalidade(isAluno);

        const tokens = await this.getTokens(newUser.id, newUser.cpf);

        await this.updateRtHash(newUser.id, tokens.refresh_token);

        return tokens;
    }

    async signinLocal({ password, cpf }: AuthDto): Promise<Tokens> {
        const user = await this.prisma.user.findUnique({ where: { cpf } });

        if (!user) throw new ForbiddenException("Access Denied");

        const passwordMatches = await bcrypt.compare(password, user.hash);

        if (!passwordMatches) throw new ForbiddenException("Access Denied");

        const tokens = await this.getTokens(user.id, user.cpf);

        await this.updateRtHash(user.id, tokens.refresh_token);

        return tokens;
    }

    async createLocal({ endereco, bairro }: LocalDto) {
        const localidade = await this.findOrCreate({
            prismaType: 'localidade',
            where: { endereco, bairro },
            data: { endereco, bairro }
        });

        return localidade;
    }

    async updateLocal({ local: { endereco: oldEndereco, bairro: oldBairro }, update }: UpdateLocalDto) {
        const local = await this.prisma.localidade.findUnique({ where: { endereco: oldEndereco, bairro: oldBairro } });

        if (local) await this.prisma.localidade.update({ where: { endereco: oldEndereco, bairro: oldBairro }, data: update });
        else throw new ForbiddenException("Local not found");

        return await this.prisma.localidade.findMany();
    }

    async deleteLocal(local: LocalDto) {
        const localidade = await this.prisma.localidade.findUnique({ where: local });

        if (localidade) {
            const hasModalidades = await this.prisma.modalidade.findMany({ where: { local } });

            if (hasModalidades) await this.prisma.modalidade.deleteMany({ where: { local } });

            await this.prisma.localidade.delete({ where: local });
        };

        return 'Local deleted successfully';
    }

    async createModalidade({ name, local, horarios }: ModalidadeDto) {
        const hasLocal = await this.createLocal(local);

        const modalidade = await this.findOrCreate({
            prismaType: 'modalidade', where: { name },
            data: { name, local: { connect: { id: hasLocal.id } } }
        });

        horarios.forEach(async horario => {
            await this.findOrCreate({ prismaType: 'horario', where: { time: horario.time }, data: horario });

            await this.prisma.horario.update({ where: { time: horario.time }, data: { modalidades: { connect: { id: modalidade.id } } } })
        });

        return modalidade;
    }

    async updateModalidade({ name, update }: UpdateModalidadeDto) {
        const modalidade = await this.prisma.modalidade.findUnique({ where: { name } });
        const horarios = { connect: update.horarios };
        const local = { connect: update.local };

        if (modalidade) await this.prisma.modalidade.update({ where: { name }, data: { ...update, local, horarios } });
        else throw new ForbiddenException("Modalidade not found");

        return await this.prisma.modalidade.findMany();
    }

    async deleteModalidade({ name }: ModalidadeDto) {
        const modalidade = await this.prisma.modalidade.findUnique({ where: { name } });

        if (modalidade) await this.prisma.modalidade.delete({ where: { name } });

        return 'Modalidade deleted successfully';
    }

    async acceptUser({ cpf, accepted }: AcceptDto) {
        const user = await this.prisma.user.findUnique({ where: { cpf } });

        if (!user) throw new ForbiddenException("Don't has user!");

        return await this.prisma.user.update({ where: { cpf }, data: { accepted } });
    }

    async logout(userId: number) {
        await this.prisma.user.updateMany({
            where: {
                id: userId,
                hashedRt: {
                    not: null
                }
            },
            data: {
                hashedRt: null
            }
        })
    }

    async refreshTokens(userId: number, rt: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user || !user.hashedRt) throw new ForbiddenException("Access Denied");

        const rtMatches = await bcrypt.compare(rt, user.hashedRt);

        if (!rtMatches) throw new ForbiddenException("Access Denied");

        const tokens = await this.getTokens(user.id, user.cpf);

        await this.updateRtHash(user.id, tokens.refresh_token);

        return tokens;
    }

    async createInscricoes(inscricoes: any, user: User) {
        await (async () => {
            for (const inscricao of inscricoes) {
                const horario = await this.prisma.horario.findUnique({ where: { time: inscricao.horario } });

                if (!horario) throw new ForbiddenException("Don't exists this horario!");

                const hasInscricao = await this.prisma.inscricao.findUnique({ where: { time: inscricao.horario } });

                if (!hasInscricao) await this.prisma.inscricao.create({
                    data: {
                        aula: inscricao.aula,
                        aluno: { connect: { id: user.id } },
                        horario: { connect: { id: horario.id } }
                    }
                });
            }
        })();
    }

    async refreshModalidade(aluno: any) {
        const inscricoesDoAluno = await this.prisma.inscricao.findMany({ where: { alunoId: aluno.id } });

        await (async () => {
            for (const inscricao of inscricoesDoAluno) {
                const modalidade = await this.prisma.modalidade.findUnique({ where: { name: inscricao.aula } });
                const alunosID = (await this.prisma.aluno.findMany({
                    where: {
                        inscricoes: { some: { aula: inscricao.aula } }
                    }
                })).map(({ id }) => { return { id } });

                if (!modalidade) throw new ForbiddenException(`Don't exists modalidade "${inscricao}"`);
                if (alunosID.length > modalidade.vagas) throw new ForbiddenException(`Ah não! Esta modalidade já está lotada! (Max: ${modalidade.vagas})`);

                await this.prisma.modalidade.update({ where: { name: inscricao.aula }, data: { alunos: { connect: alunosID } } });
            };
        })();
    }

    async findOrCreate({ prismaType, where, data }: { prismaType: string, where: {}, data: {} }) {
        return (await this.prisma[prismaType].findUnique({ where })) || (await this.prisma[prismaType].create({ data }));
    }

    async updateUserRoles(user: User, aluno: any, professor: any, admin: any, solic: any) {
        const { data, include }: { data: any, include: any } = { data: {}, include: {} };

        await (async () => {
            for (const role of user.roles) {
                const lower = role.toLowerCase();
                let create = eval(lower);

                include[lower] = !0;
                if (create) {
                    if ('menor' in create) create['menor'] = { create: create['menor'] };

                    if (role == 'ADMIN') data.accepted = !0;

                    data[lower] = 'inscricoes' in create ? { create: { ...create, inscricoes: {} } } : { create };

                    await this.prisma.user.update({ where: { id: user.id }, data, include });

                    if ('inscricoes' in create) await this.createInscricoes(create['inscricoes'], user);
                };
            }
        })();

        if (solic) {
            const adminsID = (await this.prisma.admin.findMany()).map(({ id }) => { return { id } });

            await this.prisma.solic.create({
                data: { ...solic, toAdmins: { connect: adminsID }, from: { connect: { id: user.id } } }
            });
        };

        return await this.prisma.user.findUnique({ where: { id: user.id } });
    }

    async updateRtHash(userId: number, rt: string) {
        const hash = await this.hashData(rt);

        await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                hashedRt: hash
            }
        })
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
                expiresIn: 60 * 15,
            }),
            this.jwtService.signAsync({
                sub: userId, cpf
            }, {
                secret: 'rt-secret',
                expiresIn: 60 * 60 * 24 * 90,
            })
        ]);

        return {
            access_token: at,
            refresh_token: rt
        }
    }
}
