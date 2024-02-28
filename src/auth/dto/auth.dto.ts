import { IsNotEmpty, IsString } from "class-validator";

export class AuthDto {
    @IsNotEmpty()
    @IsString()
    cpf: string;
    
    @IsNotEmpty()
    @IsString()
    password: string;
    
    @IsNotEmpty()
    roles: Array<'ALUNO' | 'PROFESSOR' | 'ADMIN'>;
}