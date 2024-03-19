import { Role } from "@prisma/client";
import { IsNotEmpty, IsString } from "class-validator";

export class SolicDto {
    roles: Role[];

    @IsNotEmpty()
    @IsString()
    cpf: string;
}