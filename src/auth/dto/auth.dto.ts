import { IsNotEmpty, IsString } from "class-validator";
import { Aluno, Professor, Admin, Role, Solic, Inscricao } from "@prisma/client";

export class SignupDto {
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

    inscricoes?: Inscricao[];

    roles?: Role[];

    solic?: Solic | string;
}

export class SigninDto {
    @IsNotEmpty()
    @IsString()
    cpf: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}