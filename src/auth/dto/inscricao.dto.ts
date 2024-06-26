import { Aula, Days } from "@prisma/client";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class InscricaoDto {
    @IsString()
    @IsNotEmpty()
    aula: Aula;

    @IsDate()
    @IsNotEmpty()
    horario: Date;

    @IsString()
    @IsNotEmpty()
    week_day: Days;
}