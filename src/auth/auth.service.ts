import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { Admin, Aluno, Professor, Inscricao, User } from '@prisma/client';
import { LocalDto } from './dto/local.dto';
import { ModalidadeDto } from './dto/modalidade.dto';

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

    async signupLocal({ password, cpf, roles, aluno, professor, admin }: AuthDto): Promise<Tokens> {
        const hash = await this.hashData(password);

        let newUser = await this.prisma.user.create({ data: { cpf, roles, hash } });

        newUser = await this.updateUserRoles(newUser, aluno, professor, admin);

        if ('aluno' in newUser) await this.refreshModalidade(newUser.aluno as Aluno);

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

    async createLocal({ endereco, bairro, cpf }: LocalDto) {
        const user = await this.prisma.user.findUnique({ where: { cpf } });

        if (!user || !user.roles.find(role => role == "ADMIN")) throw new ForbiddenException("Access Denied");

        const localidade = this.findOrCreate({
            prismaType: 'localidade',
            where: { endereco, bairro },
            data: { endereco, bairro }
        });

        return localidade;
    }

    async createInscricoes(inscricoes: Inscricao[], aluno: Aluno) {
        inscricoes.forEach(async inscricao => {
            const prismaInscricao = await this.prisma.inscricao.create({
                data: {
                    aula: "HIDRO",
                    aluno: {}
                }
            });

            console.log(inscricao);
        });

        console.log(await this.prisma.inscricao.findMany());
    }

    async refreshModalidade(aluno: Aluno) {
        console.log('refreshModalidade');
        // aluno.inscricoes.forEach(async inscricao => {
        //     const hasModalidade = await this.prisma.modalidade.findUnique({ where: { name: inscricao } });
        //     const alunosInscritos = (await this.prisma.aluno.findMany({ where: { inscricoes: { has: inscricao } } }))
        //         .map(({ id }) => { return { id } });
        //     const alunos = { connect: alunosInscritos };

        //     if (!hasModalidade) throw new ForbiddenException(`Don't exists modalidade "${inscricao}"`);

        //     await this.prisma.modalidade.update({ where: { name: inscricao }, data: { alunos } });
        // });
    }

    async createModalidade({ name, local, horarios, cpf }: ModalidadeDto) {
        const user = await this.prisma.user.findUnique({ where: { cpf } });

        if (!user || !user.roles.find(role => role == "ADMIN")) throw new ForbiddenException("Access Denied");

        const modalidade = await this.findOrCreate({ prismaType: 'modalidade', where: { name }, data: { name, local: { create: local } } });

        horarios.forEach(async horario => {
            await this.findOrCreate({ prismaType: 'horario', where: { time: horario.time }, data: { ...horario } });

            await this.prisma.horario.update({ where: { time: horario.time }, data: { modalidades: { connect: { id: modalidade.id } } } })
        });

        return modalidade;
    };

    async findOrCreate({ prismaType, where, data }: { prismaType: string, where: {}, data: {} }) {
        return (await this.prisma[prismaType].findUnique({ where })) || (await this.prisma[prismaType].create({ data }));
    }

    async updateUserRoles(user: User, aluno: any, professor: any, admin: any) {
        const { data, include } = { include: {}, data: {} };
        user.roles.forEach(role => {
            const lower = role.toLowerCase();
            let create = eval(lower);

            include[lower] = !0;
            if (create) {
                if ('menor' in create) create['menor'] = { create: create['menor'] };
                if ('inscricoes' in create) {
                    create['inscricoes'] = { create: create['inscricoes'] };

                    create['inscricoes'].create.forEach(async (inscricao: any, ind: number) => {
                        const horario = await this.prisma.horario.findUnique({ where: { time: inscricao.horario } });
                        console.log(inscricao, horario);

                        create['inscricoes'].create[ind] = {
                            horario: {
                                connect: horario
                            }
                        }
                    });
                };

                // if ('inscricoes' in create) {
                //     const inscricoes = create['inscricoes'];
                //     this.createInscricoes(inscricoes, create);

                //     delete create['inscricoes'];
                // };

                data[lower] = { create };
            };
        });

        return await this.prisma.user.update({ where: { id: user.id }, data, include });
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
