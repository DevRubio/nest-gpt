import { Body, Controller, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { GptService } from './gpt.service';
import { AudioToTextDto, OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslatorDto } from './dtos';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'

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

  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file',{
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file, callback)=>{
          const fileExtension = file.originalname.split('.').pop()
          const fileName = `${new Date().getTime()}.${fileExtension}` 
          return callback(null, fileName)
        }
      })
    })
  )
  async audioToText(
    @UploadedFile(
      new ParseFilePipe({
        validators:[
          new MaxFileSizeValidator({maxSize: 1000 * 1024 * 5, message: 'File is bigger than 5 Mb'}),
          new FileTypeValidator({fileType: 'audio/*'})
        ]
      })
    )file: Express.Multer.File,
    @Body() audioToTextDto:AudioToTextDto
  ){
    return this.gptService.audioToText(file, audioToTextDto)
  }


}
