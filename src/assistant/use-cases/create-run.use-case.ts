import OpenAI from "openai";

interface Options{
    threadId: string
    assistanId?: string
}


export const createRunUseCase = async(openai: OpenAI, options: Options)=>{

    const {threadId, assistanId = 'asst_VnoaTdiv0Ik5uf9d6FgpohCm'} = options

    const run = await openai.beta.threads.runs.create(threadId,{
        assistant_id: assistanId,        
    })

    console.log({run})
    return run

}