import OpenAI from 'openai';
interface Options{
    prompt: string;
}

export const orthographyCheckUseCase = async(openai: OpenAI, options: Options)=>{

    const { prompt } = options

    const completion = await openai.chat.completions.create({
        messages:[
            {
                role: "system", 
                content:`
                Te serán proveídos textos en español con posibles errores ortográficos y gramaticales, 
                Las palabras usadas deben de existir en el diccionario de la Real Academia Española,
                debes de responder en formato JSON,
                Tu tarea es corregirlos y retornar información soluciones,
                También debes de dar un porcentaje de aciertos por el usuario,
                
                Si no hay errores, debes de retornar un mensaje de felicitaciones.

                Ejemplo de salida:
                {
                    userScore: number,
                    errors: string[],//['Error -> Solución'],
                    message: string,// Usa emojis y texto para felicitar al usuario
                }
                
                `
            },
            {
                role: 'user', 
                content: prompt
            }
        ],
        model:"gpt-3.5-turbo",
        temperature: 0.3,
        max_tokens: 150
    })
    const jsonResponse = JSON.parse(completion.choices[0].message.content)
    return jsonResponse

}