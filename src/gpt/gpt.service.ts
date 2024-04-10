import { Injectable } from '@nestjs/common';
import { orthographyCheckUseCase, prosConsDiscusserStreamUseCase, prosConsDiscusserUseCase, translatorUseCase } from './use-cases';
import { OrthographyDto, ProsConsDiscusserDto } from './dtos';
import OpenAI from 'openai';
import { TranslatorDto } from './dtos/translator.dto';

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

    async prosConsDiscusser(prosConsDiscusserDto: ProsConsDiscusserDto){
        return await prosConsDiscusserUseCase(this.openai,{
            prompt: prosConsDiscusserDto.prompt
        })
    }

    async prosConsDiscusserStream({prompt}: ProsConsDiscusserDto){
        return await prosConsDiscusserStreamUseCase(this.openai,{prompt})
    }

    async translator(translatorDto : TranslatorDto){
        return await translatorUseCase(this.openai,{
            lang: translatorDto.lang,
            prompt: translatorDto.prompt
        })
    }
}

