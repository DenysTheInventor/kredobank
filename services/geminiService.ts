

import { GoogleGenAI } from "@google/genai";
// Fix: Added .ts extension to the import path.
import type { Transaction } from "../types.ts";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("API_KEY environment variable not set. Gemini API will not be available.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getFinancialAdvice = async (prompt: string, transactions: Transaction[]): Promise<string> => {
    if (!API_KEY) {
        return "Gemini API key is not configured. Please set the API_KEY environment variable.";
    }

    const model = 'gemini-2.5-flash';

    const transactionSummary = transactions
        .slice(0, 10) // Use recent transactions for context
        .map(t => `- ${t.description}: ${t.amount} ${t.currency} on ${new Date(t.date).toLocaleDateString()}`)
        .join('\n');

    const fullPrompt = `
        Based on the following recent transactions, answer the user's question.
        Be a friendly and helpful financial assistant. Provide concise and clear answers.
        Analyze the data and provide insights if possible.

        Recent Transactions:
        ${transactionSummary}

        User's Question: "${prompt}"
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: fullPrompt,
            config: {
                systemInstruction: "You are a helpful banking assistant for the KredoBank app. Your answers should be in the same language as the user's question.",
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "Sorry, I'm having trouble connecting to my brain right now. Please try again later.";
    }
};