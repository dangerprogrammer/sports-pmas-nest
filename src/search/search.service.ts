import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import { $Enums } from '@prisma/client';

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

    async findAdmin(id: number) {
        const solics = await this.prisma.solic.findMany({
            where: {
                toAdmins: { some: { id: +id } }
            }
        });

        return solics;
    }

    async searchModalidades() {
        const availableModalidades = await this.prisma.modalidade.findMany({
            where: {
                available: {
                    gt: 0
                }
            }
        });

        return availableModalidades;
    }

    async searchHorarios(modName: $Enums.Aula) {
        const horariosFromMod = (await this.prisma.horario.findMany({
            where: {
                modalidades: { some: { name: modName } }
            }
        })).sort(({ id: idA }, { id: idB }) => idA - idB);

        return horariosFromMod;
    }

    async findUserByToken(auth: string) {
        const token = auth.split(' ')[1];
        const decodedToken = jwt.verify(token, 'at-secret') as any;

        const user = await this.prisma.user.findUnique({ where: { id: decodedToken.sub } });

        return user;
    }
}
