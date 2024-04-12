import { IsNotEmpty, IsString } from "class-validator";
import { Horario, Localidade, Aula } from "@prisma/client";

export class ModalidadeDto {
    @IsString()
    @IsNotEmpty()
    name: Aula;

    horarios?: Horario[];

    local?: Localidade;

    available?: number;
    vagas?: number;
}