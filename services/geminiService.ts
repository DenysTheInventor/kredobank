
import { GoogleGenAI } from "@google/genai";
import type { Transaction } from "../types.ts";

export const getFinancialAdvice = async (prompt: string, transactions: Transaction[]): Promise<string> => {
    try {
        // Initialize the GoogleGenAI client here, just-in-time.
        // This ensures that process.env.API_KEY has been set by the environment before we try to use it.
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

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
        if (error instanceof Error && (error.message.includes('API Key') || error.message.includes('api_key'))) {
             return "There is an issue with the API Key configuration. Please ensure it is set up correctly in the environment.";
        }
        return "Sorry, I'm having trouble connecting to my brain right now. Please try again later.";
    }
};
