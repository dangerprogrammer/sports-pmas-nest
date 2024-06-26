import { Role } from "@prisma/client";
import { IsNotEmpty, IsString } from "class-validator";

export class SolicDto {
    roles: Role[];

    @IsNotEmpty()
    @IsString()
    cpf: string;

    accepted: boolean;
    done: boolean;

    doneBy?: any;

    toAdmins: any;
}