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

    async findAdmin(id: number, { min, max }: { min: number, max: number }) {
        const size = await this.prisma.solic.count({
            where: { toAdmins: { some: { id } }, done: !1 }
        });
        const solics = (await this.prisma.solic.findMany({
            where: { toAdmins: { some: { id } }, done: !1 },
            take: Math.min(max, size) - min, skip: size - Math.min(max, size)
        }));

        return { solics, size };
    }

    async searchModalidades() {
        const availableModalidades = await this.prisma.modalidade.findMany();

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
