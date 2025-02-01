import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import fs from 'fs/promises';
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import * as secrets from "./Secret.js";

try {

    let tex = await fs.readFile('./asca.txt', 'utf-8');
    let text_splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        separators: ['.'],
        chunkOverlap: 50
    });
    const output = await text_splitter.createDocuments([tex])
    console.log(output)
    const sbApiKey = secrets.sbApiKey;
    const sbApiUrl = secrets.sbApiUrl;
    const supabase = createClient(sbApiUrl, sbApiKey);

    await SupabaseVectorStore.fromDocuments(
        output,
        new MistralAIEmbeddings({
            model: "mistral-embed",
            apiKey:secrets.mistralApiKey
        }),
        {
            client: supabase,
            tableName: 'documents'
        })

} catch (error) {
    console.log(error)
}



