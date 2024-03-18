import { IsNotEmpty, IsString } from "class-validator";
import { Aluno, Professor, Admin, Role, Solic } from "@prisma/client";

export class AuthDto {
    @IsNotEmpty()
    @IsString()
    cpf: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    nome_comp: string;

    @IsNotEmpty()
    @IsString()
    tel: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    aluno?: Aluno | string;
    professor?: Professor | string;
    admin?: Admin | string;

    roles?: Role[];

    solic?: Solic | string;
}