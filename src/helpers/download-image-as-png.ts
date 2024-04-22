import { InternalServerErrorException } from "@nestjs/common"
import * as path from "path"
import * as fs from 'fs'
import * as sharp from 'sharp'

export const downloadImageAsPng = async(url:string)=>{

    const response = await fetch(url)

    if(!response.ok){
        throw new InternalServerErrorException('Download image failed')
    }

    const folderPath = path.resolve('./','./generated/images/')
    fs.mkdirSync(folderPath, {recursive: true})

    const imageNamePng = `${new Date().getTime()}.png`
    const buffer = Buffer.from(await response.arrayBuffer())

    //fs.writeFileSync(`${folderPath}/${imageNamePng}`, buffer)

    const completePath = path.join(folderPath, imageNamePng)
    await sharp(buffer)
        .png()
        .ensureAlpha()
        .toFile(completePath)

    return imageNamePng
        


}

export const downloadBase64ImageAsPng = async(base64Image: string)=>{
    //remover encabezado
    base64Image = base64Image.split(';base64,').pop()
    const imageBuffer = Buffer.from(base64Image, 'base64')

    const folderPath = path.resolve('./','./generated/images/')
    fs.mkdirSync(folderPath, {recursive: true})

    const imageNamePng = `${new Date().getTime()}-64.png`

    // Transformar a RGBA, png // Asi lo espera OpenAI
    const completePath = path.join(folderPath, imageNamePng)
    
    await sharp(imageBuffer)
        .png()
        .ensureAlpha()
        .toFile(completePath)

    return imageNamePng
}