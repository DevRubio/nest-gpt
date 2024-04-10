import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslatorDto } from './dtos';
import type { Response } from 'express';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographyCheck(
    @Body() orthographyDto: OrthographyDto,
  ){
    //return orthographyDto
    return this.gptService.orthographyCheck(orthographyDto)
  }

  @Post('pros-cons-discusser')
  prosConsDicusser(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
  ){
    return this.gptService.prosConsDiscusser(prosConsDiscusserDto)
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDicusserStream(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
    @Res() res: Response
  ){
    const stream = await this.gptService.prosConsDiscusserStream(prosConsDiscusserDto)
    res.setHeader('Content-Type','application/jspn')
    res.status(HttpStatus.OK)

    for await(const chunk of stream){
      const piece = chunk.choices[0].delta.content || ''
      //console.log(piece)
      res.write(piece)
    }
    res.end()
  }

  @Post('translator')
  translator(
    @Body() translatorDto: TranslatorDto,
  ){
    return this.gptService.translator(translatorDto)
  }

  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() res: Response
  ){
    const filePath = await this.gptService.textToAudio(textToAudioDto)

    res.setHeader('Content-Type','audio/mp3')
    res.status(HttpStatus.OK)
    res.sendFile(filePath)
  }

  @Get('text-to-audio/:fileId')
  async textToAudioGetter(
    @Res() res: Response,
    @Param('fileId') fileId: string
  ){
    const filePath = await this.gptService.textoToAudioGetter(fileId)
    res.setHeader('Content-Type','audio/mp3')
    res.status(HttpStatus.OK)
    res.sendFile(filePath)
  }


}
