import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import { $Enums, Inscricao, Role } from '@prisma/client';

@Injectable()
export class SearchService {
    constructor(
        private prisma: PrismaService
    ) { }

    async findUser(cpf: string) {
        const user = await this.prisma.user.findUnique({ where: { cpf } });

        return user;
    }

    async findUserById(id: number) {
        const user = await this.prisma.user.findUnique({ where: { id: +id } });

        return user;
    }

    async findAlunoById(id: number) {
        const user = await this.prisma.aluno.findUnique({ where: { id: +id } });

        return user;
    }

    async findSolic(id: number, { limits: { min, max }, done }: { limits: { min: number, max: number }, done: boolean }) {
        const size = await this.prisma.solic.count({
            where: { toAdmins: { some: { id } }, done }
        });
        const solics = await this.prisma.solic.findMany({
            where: { toAdmins: { some: { id } }, done },
            take: Math.min(max, size) - min, skip: size - Math.min(max, size)
        });

        return { solics, size };
    }

    async findUsersRole({ role, limits: { min, max } }: { role: Role, limits: { min: number, max: number } }) {
        const size = await this.prisma.user.count({ where: { roles: { hasSome: [role] }, accepted: !0 } });

        const users = await this.prisma.user.findMany({
            where: { roles: { hasSome: [role] }, accepted: !0 },
            take: Math.min(max, size) - min, skip: size - Math.min(max, size)
        });

        return { size, users };
    }

    async findInscricoes(id: number) {
        const inscricoes = await this.prisma.inscricao.findMany({ where: { OR: [{ alunoId: id }, { professorId: id }] } });

        const modalidades = await this.prisma.modalidade.findMany({
            where: {
                OR: inscricoes.map(({ aula: name }) => { return { name } })
            }
        });

        return { inscricoes, modalidades };
    }

    async searchModalidades() {
        const availableModalidades = (await this.prisma.modalidade.findMany())
            .sort(({ name: nameA }, { name: nameB }) =>
                nameA > nameB ? 1 : nameA < nameB ? -1 : 0
            );

        return availableModalidades;
    }

    async searchHorarios(name: $Enums.Aula) {
        const horariosFromMod = (await this.prisma.horario.findMany({
            where: {
                modalidades: { some: { name } }
            }
        })).sort(({ time: timeA }, { time: timeB }) => (new Date(timeA) as unknown as number) - (new Date(timeB) as unknown as number));

        return horariosFromMod;
    }

    async findUsersHorario(time: Date) {
        const horarios = await this.prisma.horario.findMany({ where: { time } });
        const inscricoes = await this.prisma.inscricao.findMany({ where: { OR: horarios.map(({ id }) => {
            return { horarioId: id }
        }) } });

        return inscricoes;
    }

    async searchHorariosSubscribe(name: $Enums.Aula, inscricoes: Inscricao[]) {
        const horarios = await this.searchHorarios(name);

        return horarios.filter(({ time }) => inscricoes.find(async ({ horarioId }) => {
            const { time: iTime } = await this.prisma.horario.findUnique({ where: { id: horarioId } });

            const iTimeNew = new Date(iTime).toLocaleTimeString();
            const timeNew = new Date(time).toLocaleTimeString();

            return iTimeNew == timeNew;
        }));
    }

    async searchHorario(horarioId: number) {
        const horario = await this.prisma.horario.findUnique({ where: { id: horarioId } });

        return horario;
    }

    async searchSolic(userId: number) {
        const solic = await this.prisma.solic.findUnique({ where: { userId } });

        return solic;
    }

    async findUserByToken(auth: string) {
        const token = auth.split(' ')[1];
        const { sub: id } = jwt.verify(token, 'at-secret') as any;

        return await this.prisma.user.findUnique({ where: { id } });
    }
}
