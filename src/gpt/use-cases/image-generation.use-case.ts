import OpenAI from "openai";
import { downloadImageAsPng } from '../../helpers/download-image-as-png';

interface Options{
    prompt: string
    originalImage?: string
    maskImage?:string
}


export const imageGenerationUseCase = async(openAi: OpenAI, options: Options)=>{

    const {prompt, originalImage, maskImage} = options

    const response = await openAi.images.generate({
        prompt: prompt,
        model: 'dall-e-3',
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'url'
    })

    await downloadImageAsPng(response.data[0].url)
    

    return{
        url: response.data[0].url,
        localPath: '',
        revised_prompt: response.data[0].revised_prompt
    }

}