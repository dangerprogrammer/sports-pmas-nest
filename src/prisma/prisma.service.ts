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
                    url: 'postgresql://sports-pmas_owner:K6sdWBvrgS0h@ep-silent-glitter-a5wqgklw-pooler.us-east-2.aws.neon.tech/sports-pmas?sslmode=require'
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
            admin: { create: {} },
            hash: await bcrypt.hash("@pmas1234@", 10),
            accepted: !0
        }});
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}