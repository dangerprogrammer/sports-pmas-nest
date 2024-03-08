import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class AcceptDto {
    @IsString()
    @IsNotEmpty()
    cpf: string;

    @IsBoolean()
    accepted?: boolean;
}