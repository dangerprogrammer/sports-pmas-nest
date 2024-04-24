import { IsNotEmpty, IsString } from "class-validator";
import { LocalDto } from "./local.dto";
import { Aula, Role } from "@prisma/client";
import { ModalidadeDto } from "./modalidade.dto";
import { SolicDto } from "./solic.dto";
import { InscricaoDto } from "./inscricao.dto";

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

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    cpf: string;

    @IsNotEmpty()
    update: Partial<{
        password: string;
        tel: string;
        email: string;

        aluno?: any;
        professor?: any;
        admin?: any;

        inscricoes?: InscricaoDto[];

        roles?: Role[];

        solic?: any;

        accepted?: boolean;
    }>;
}

export class UpdateSolicDto {
    @IsNotEmpty()
    @IsString()
    cpf: string;

    @IsNotEmpty()
    update: Partial<SolicDto>;
}