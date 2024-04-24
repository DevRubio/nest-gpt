import { IsString } from "class-validator";

export class QuestionDto {
    @IsString()
    readonly thereadId: string

    @IsString()
    readonly question: string

}