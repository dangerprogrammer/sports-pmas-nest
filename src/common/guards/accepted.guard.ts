import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AcceptedGuard extends AuthGuard('accepted') {
    constructor(private prisma: PrismaService) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        const { user, body } = context.switchToHttp().getRequest();
        const { cpf } = user || body;

        const prismaUser = await this.prisma.user.findUnique({ where: { cpf } });

        if (!prismaUser) return !1;

        return prismaUser.accepted;
    }
}