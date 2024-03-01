import { IsNotEmpty, IsString } from "class-validator";
import { Admin, Aluno, Professor, Roles } from "../types";

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