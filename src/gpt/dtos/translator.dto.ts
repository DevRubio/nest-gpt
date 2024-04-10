import { IsString } from "class-validator";

export class TranslatorDto{
    @IsString()
    readonly prompt: string

    @IsString()
    readonly lang: string
}