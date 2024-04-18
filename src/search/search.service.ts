import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import { $Enums, Inscricao } from '@prisma/client';

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
        })).sort(({ id: idA }, { id: idB }) => idA - idB);

        return horariosFromMod;
    }

    async searchHorariosSubscribe(name: $Enums.Aula, inscricoes: Inscricao[]) {
        const horarios = await this.searchHorarios(name);

        return horarios.filter(({ time }) => inscricoes.find(({ time: iTime }) => {
            const iTimeNew = new Date(iTime).toLocaleTimeString();
            const timeNew = new Date(time).toLocaleTimeString();

            return iTimeNew == timeNew;
        }));
    }

    async searchSolic(userId: number) {
        const solic = await this.prisma.solic.findUnique({ where: { userId } });

        return solic;
    }

    async findUserByToken(auth: string) {
        const token = auth.split(' ')[1];
        const decodedToken = jwt.verify(token, 'at-secret') as any;

        const user = await this.prisma.user.findUnique({ where: { id: decodedToken.sub } });

        return user;
    }
}
