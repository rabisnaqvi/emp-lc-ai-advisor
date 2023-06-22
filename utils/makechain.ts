import { OpenAI } from 'langchain/llms/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { ConversationalRetrievalQAChain } from 'langchain/chains';

const CONDENSE_PROMPT = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;

const QA_PROMPT = `You are a helpful sales advisor. Use the following pieces of context to answer the question which came from a potential customer at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer. If you don't know the answer, let the customer know they can place a direct call with a live advisor, and postfix your response with "SYSTEM_CALL:SHOW_CTA;".
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.
Your response should be in a conversational tone, like you are talking to a friend. You cannot use emojis or gifs.
Your response should be in a format which can be passed to a text-to-speech engine.

{context}

Question: {question}
Helpful answer in text format:`;

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
