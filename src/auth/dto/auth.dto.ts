import { IsNotEmpty, IsString } from "class-validator";

export class AuthDto {
    @IsNotEmpty()
    @IsString()
    cpf: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    aluno?: string;
    professor?: string;
    admin?: string;

    roles?: Array<'ALUNO' | 'PROFESSOR' | 'ADMIN'>;
}