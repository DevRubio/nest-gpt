import { IsString } from "class-validator";

export class AudioToTextDto{
    @IsString()
    @IsString()
    readonly prompt: string
}