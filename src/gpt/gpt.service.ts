import { Injectable } from '@nestjs/common';
import { orthographyCheckUseCase, prosConsDiscusserUseCase } from './use-cases';
import { OrthographyDto, ProsConsDiscusserDto } from './dtos';
import OpenAI from 'openai';

@Injectable()
export class GptService {

    private openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    })
    //Solo va a llamar casos de usos
    async orthographyCheck(orthographyDto: OrthographyDto){
        return await orthographyCheckUseCase(this.openai,{
            prompt: orthographyDto.prompt
        })
    }

    async prosConsDiscusserDto(prosConsDiscusserDto: ProsConsDiscusserDto){
        return await prosConsDiscusserUseCase(this.openai,{
            prompt: prosConsDiscusserDto.prompt
        })
    }
}

