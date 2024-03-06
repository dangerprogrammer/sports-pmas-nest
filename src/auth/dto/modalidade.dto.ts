import { IsNotEmpty, IsString } from "class-validator";
import { Horario, Localidade, Aula } from "@prisma/client";

export class ModalidadeDto {
    @IsString()
    @IsNotEmpty()
    name: Aula;

    @IsNotEmpty()
    horarios: Horario[];

    @IsString()
    @IsNotEmpty()
    cpf: string;

    @IsNotEmpty()
    local: Localidade;
}