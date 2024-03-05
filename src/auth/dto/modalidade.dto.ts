import { IsNotEmpty, IsString } from "class-validator";
import { Periodo } from "../types";

export class ModalidadeDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsString()
    @IsNotEmpty()
    periodo: Periodo;

    @IsNotEmpty()
    horarios: Date[];

    @IsString()
    @IsNotEmpty()
    cpf: string;
}