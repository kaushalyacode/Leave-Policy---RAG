import {ChatPromptTemplate as AnserTemplate, PromptTemplate} from "@langchain/core/prompts";

export const getStandaloneQuestionPrompt=(standaloneQuestionTemplate)=>{
    return PromptTemplate.fromTemplate(standaloneQuestionTemplate);
}

export const getAnserPrompt = (anserTemplate)=>{
    return AnserTemplate.fromTemplate(anserTemplate);
}