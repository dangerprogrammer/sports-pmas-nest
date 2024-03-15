import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchService {
    constructor(
        private prisma: PrismaService
    ) { }

    async findUser(cpf: string) {
        const user = await this.prisma.user.findUnique({ where: { cpf } });

        return user;
    }
}
