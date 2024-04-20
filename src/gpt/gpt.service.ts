import * as path from "path"
import * as fs from 'fs'
import { Injectable, NotFoundException } from '@nestjs/common';
import { audioToTextUseCase, orthographyCheckUseCase, prosConsDiscusserStreamUseCase, prosConsDiscusserUseCase, textToAudioUseCase, translatorUseCase } from './use-cases';
import { AudioToTextDto, OrthographyDto, ProsConsDiscusserDto, TextToAudioDto } from './dtos';
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

    async textToAudio({prompt, voice} : TextToAudioDto){
        return await textToAudioUseCase(this.openai, {prompt, voice})
    }

    async textoToAudioGetter(fileId: string){
        const filePath = path.resolve(__dirname,'../../generated/audios/', `${fileId}.mp3`)
        const wasFound =fs.existsSync(filePath)

        if(!wasFound) throw new NotFoundException(`File ${fileId} not found`)

            return filePath
    }

    async audioToText(audioFile: Express.Multer.File, prompt?:string){        
        return await audioToTextUseCase(this.openai,{audioFile, prompt})
    }

}

