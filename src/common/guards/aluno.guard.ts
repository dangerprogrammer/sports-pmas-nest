import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AlunoGuard extends AuthGuard('aluno') {
    constructor(private prisma: PrismaService) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        const { user: { cpf } } = context.switchToHttp().getRequest();
        const user = await this.prisma.user.findUnique({ where: { cpf } });

        if (!user) return !1;

        return !!user.roles.find(role => role == 'ALUNO');
    }
}