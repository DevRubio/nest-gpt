import OpenAI from "openai";

interface Options{
    lang: string
    prompt: string
}


export const translatorUseCase = async(openai: OpenAI, options: Options)=>{

    const { lang, prompt } = options

    const response = await openai.chat.completions.create({
        messages:[
            {
                role: 'system',
                content: `
                Traduce el siguiente texto al idioma ${lang}:${ prompt }
                `
            }
        ],
        model: 'gpt-3.5-turbo',
        temperature: 0.2
    })
    return {message: response.choices[0].message.content}
}