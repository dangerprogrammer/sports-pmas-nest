import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {
    constructor() {
        super({
            datasources: {
                db: {
                    url: 'postgresql://danger:123@localhost:5432/db-1?schema=public'
                }
            }
        })
    }

    async onModuleInit() {
        await this.$connect();

        const hasRoot = await this.user.findUnique({ where: { cpf: "ROOT", roles: { has: "ADMIN" } } });

        if (!hasRoot) await this.user.create({data: {
            cpf: "ROOT",
            roles: ["ADMIN"],
            nome_comp: "Root Admin",
            email: 'root@root.com',
            tel: '00 00000-0000',
            admin: { create: {} },
            hash: await bcrypt.hash("@pmas1234@", 10),
            accepted: !0
        }});
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}