import { IsNotEmpty, IsString } from "class-validator";
import { LocalDto } from "./local.dto";
import { Aula } from "@prisma/client";
import { ModalidadeDto } from "./modalidade.dto";

export class UpdateLocalDto {
    @IsNotEmpty()
    local: LocalDto;

    @IsNotEmpty()
    update: Partial<LocalDto>;
}

export class UpdateModalidadeDto {
    @IsString()
    @IsNotEmpty()
    name: Aula;

    @IsNotEmpty()
    update: Partial<ModalidadeDto>;
}