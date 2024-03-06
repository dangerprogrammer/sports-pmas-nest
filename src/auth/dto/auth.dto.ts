import { IsNotEmpty, IsString } from "class-validator";
import { Aluno, Professor, Admin, Roles } from "@prisma/client";
export class AuthDto {
    @IsNotEmpty()
    @IsString()
    cpf: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    aluno?: Aluno | string;
    professor?: Professor | string;
    admin?: Admin | string;

    roles?: Roles[];
}