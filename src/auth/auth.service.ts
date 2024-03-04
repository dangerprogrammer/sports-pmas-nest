import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { Admin, Aluno, Professor, Roles, User } from '@prisma/client';
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

    // EXAMPLE JSON ALUNO MENOR:
    // {"nome_comp":"Patrick Vieira Léo","email":"papatrileo@gmail.com","tel":"15981004777","endereco":"Avenida Itália","bairro":"Monte Bianco","data_nasc":"2004-12-10T02:00:00.000Z","sexo":"MASCULINO","inscricoes":["NATACAO"],"periodos":["TARDE"],"menor":{"nomeResp1":"Wellington Alexandre Léo","cpfResp1":"12558186892","emailResp1":"wellnapa009@gmail.com","telResp1":"15981811333"}}
    async signupLocal({ password, cpf, roles, aluno, professor, admin }: AuthDto): Promise<Tokens> {
        const hash = await this.hashData(password), splitRoles = (roles as unknown as string)?.split(',');

        let newUser = await this.prisma.user.create({
            data: { cpf, roles: splitRoles as Roles[], hash }
        });

        newUser = await this.updateUserRoles(newUser);

        if ('aluno' in newUser) await this.refreshModalidade(newUser.aluno as Aluno);

        if ('admin' in newUser) {
            // Criar localidades
        };

        const tokens = await this.getTokens(newUser.id, newUser.cpf);

        await this.updateRtHash(newUser.id, tokens.refresh_token);

        return tokens;
    }

    async signinLocal({ password, cpf }: AuthDto): Promise<Tokens> {
        const user = await this.prisma.user.findUnique({
            where: { cpf }
        });

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

    async createLocal({ endereco, bairro }) {
        console.log(endereco, bairro);
    }

    async refreshModalidade(aluno: Aluno) {
        aluno.inscricoes.forEach(async (inscricao, ind) => {
            const hasModalidade = await this.prisma.modalidade.findFirst({ where: { name: inscricao } });
            const alunosInscritos = (await this.prisma.aluno.findMany({ where: { inscricoes: { has: inscricao } } }))
                .map(({ id }) => { return { id } });
            const alunos = { connect: alunosInscritos };

            if (!hasModalidade) await this.prisma.modalidade.create({ data: { name: inscricao, periodo: aluno.periodos[ind] || aluno.periodos[0] } });

            await this.prisma.modalidade.update({
                where: { id: (hasModalidade || await this.prisma.modalidade.findFirst({ where: { name: inscricao } })).id },
                data: { alunos }
            });
        });
    }

    async updateUserRoles(user: User) {
        const { data, include } = { include: {}, data: {} };
        user.roles.forEach(role => {
            const lower = role.toLowerCase();
            let create = eval(lower);

            create = this.types[lower](create);

            include[lower] = !0;
            if (create) {
                if ('menor' in create) create['menor'] = { create: create['menor'] };
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
