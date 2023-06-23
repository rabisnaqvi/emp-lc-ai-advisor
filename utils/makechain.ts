import { OpenAI } from 'langchain/llms/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { ConversationalRetrievalQAChain } from 'langchain/chains';

const CONDENSE_PROMPT = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;

const QA_PROMPT = `You are a helpful AI sales advisor. Use the following pieces of context to answer the question which came from a potential customer at the end.
If you don't know the answer, or the questions cannot be answered from the context provided, just say you don't know. DO NOT try to make up an answer or answer from information that is not in the context. If you don't know the answer, let the customer know they can place a direct call with a live advisor, and postfix your response with "SYSTEM_CALL:SHOW_CTA;".
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.
If the question is not about products but generic, like what kind, type, category or brands of products the shop sells, respond with a list of categories or brands of products the shop sells. Don't respond with information about a specific product.
When mentioning a product, you should use the product's title only, and refrain from specifying specifications unless the question is about the specifications of the product.
Your response should be in a conversational tone, like you are talking to a friend. You cannot use emojis or gifs.
Your response should be in a format which can be passed to a text-to-speech engine.

{context}

Question: {question}
Helpful answer in text format:`;

// const QA_PROMPT = `You are an AI question parser system. Your task is to identify which category does the question belong to from the context. Respond with just the name of the category. If the question is generic or does not belong to any category, respond casually that you don't have enough information to answer the question and postfix your response with "SYSTEM_CALL:SHOW_CTA;".
//
// {context}
//
// Question: {question}
// Answer in text format:`;

export const makeChain = (vectorstore: PineconeStore) => {
  const model = new OpenAI({
    temperature: 0, // increase temepreature to get more creative answers
    modelName: 'gpt-3.5-turbo', //change this to gpt-4 if you have access
  });

  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorstore.asRetriever(),
    {
      qaTemplate: QA_PROMPT,
      questionGeneratorTemplate: CONDENSE_PROMPT,
      returnSourceDocuments: false, //The number of source documents returned is 4 by default
    },
  );
  return chain;
};
