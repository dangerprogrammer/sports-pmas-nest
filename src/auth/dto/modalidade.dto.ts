import { IsNotEmpty, IsString } from "class-validator";
import { Horario, Localidade } from "@prisma/client";

export class ModalidadeDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    horarios?: Horario[];

    local?: Localidade;

    available?: number;
    vagas?: number;
}