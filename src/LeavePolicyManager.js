import {getMistralChat, getMistralEmbeder, getSupabaseClient, getSupabaseVectorStore} from "./LlmManager"
import {StringOutputParser} from "@langchain/core/output_parsers";
import {RunnablePassthrough, RunnableSequence} from "@langchain/core/runnables";
import {getAnserPrompt, getStandaloneQuestionPrompt} from "./PromptManager";

const supabaseClient = getSupabaseClient();
const mistralEmbedding = getMistralEmbeder();
const supabaseVectorStore= getSupabaseVectorStore(mistralEmbedding, supabaseClient);

const retreiver = supabaseVectorStore.asRetriever()//retrive data from the vector store for nearrest match
const mistralChat = getMistralChat();

const  standaloneQuestionTemplate= "Given a question convert it to a standalone question: {question} standalone question";
const standalonePrompt = getStandaloneQuestionPrompt(standaloneQuestionTemplate);

const standaloneChain = standalonePrompt.pipe(mistralChat).pipe(new StringOutputParser());
const  retrieverChain = RunnableSequence.from([
    prevResult => prevResult.standaloneQuestion,
    retreiver,
    combineDocuments
]);

const anserTemplate = `Use this context to answer the question answer.If you dont have the answer, you can say "I dont know" or "I dont have enough information.
And tell to contact the HR department harshanathwak@gmail.com.And Remove unnessasary characters.And give line brakes properly.
context : {context}
question : {question}
anser:"`;
const anserPrompt = getAnserPrompt(anserTemplate);
const anserChain = anserPrompt.pipe(mistralChat).pipe(new StringOutputParser());


const promptChain = RunnableSequence.from([
    {
        standaloneQuestion :standaloneChain,
        original_input : new RunnablePassthrough()
    },
    {
        context : retrieverChain,
        question: ({original_input})=>original_input.question
    },
    anserChain
])




function combineDocuments(documents){
    return documents.map(doc=>doc.pageContent).join('\n\n');
}

export const giveQuestion = async (question) =>{
    const response = await promptChain.invoke({question:question});
    return response;
}