
import { ChatMistralAI } from "@langchain/mistralai";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { MistralAIEmbeddings } from "@langchain/mistralai";

import {sbApiKey, sbApiUrl, mistralApiKey} from "./Secret";

export const getSupabaseClient = ()=> createClient(sbApiUrl, sbApiKey);
export const getMistralEmbeder = () =>(new MistralAIEmbeddings({
    model: "mistral-embed",
    apiKey: mistralApiKey
}));
export const getSupabaseVectorStore = (embedding, client)=> new SupabaseVectorStore(embedding,{
    client: client,
    tableName: 'documents',
    queryName:'match_documents'
});

export const getMistralChat = ()=> new ChatMistralAI({
    model: "mistral-large-latest",
    temperature: 0,
    apiKey: mistralApiKey
});

