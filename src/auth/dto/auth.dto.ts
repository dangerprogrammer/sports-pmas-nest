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

    aluno?: Aluno;
    professor?: Professor;
    admin?: Admin;

    inscricoes?: Inscricao[];

    roles?: Role[];

    solic?: Solic;
}

export class SigninDto {
    @IsNotEmpty()
    @IsString()
    cpf: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}