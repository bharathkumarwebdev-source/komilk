import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMilkAdvice = async (userQuery: string): Promise<string> => {
  try {
    // Construct a context-aware prompt
    const productContext = PRODUCTS.map(p => 
      `- ${p.name} (₹${p.price}): ${p.description}`
    ).join('\n');

    const systemInstruction = `
      You are the AI Assistant for "KO-MILK", a premium milk delivery service in India.
      Your goal is to help customers choose between Cow Milk, Buffalo Milk, and Native Cow Milk based on their needs (tea, curd, drinking, health, price).
      
      Here is our current product catalog:
      ${productContext}
      
      Guidelines:
      1. Be helpful, polite, and emphasize our "Farm Fresh, Zero Processing" philosophy.
      2. Prices are in Indian Rupees (₹).
      3. If asked for recipes, suggest Indian dairy-based recipes (Paneer, Kheer, Curd, Chai).
      4. Keep responses concise (under 100 words).
      5. We deliver to doorsteps in Namakkal and surrounding areas.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userQuery,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "I couldn't process that request right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the server. Please try again later.";
  }
};