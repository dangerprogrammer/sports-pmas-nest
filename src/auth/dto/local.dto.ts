import { IsNotEmpty, IsString } from "class-validator";

export class LocalDto {
    @IsString()
    @IsNotEmpty()
    endereco: string;
    
    @IsString()
    @IsNotEmpty()
    bairro: string;
    
    @IsString()
    @IsNotEmpty()
    full_location?: string;
}