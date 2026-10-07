import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Helper function to generate product descriptions
export async function generateProductDescription(productName: string, category: string) {
  try {
    const interaction = await ai.interactions.create({
      model: "gemini-1.5-flash",
      input: `Write a compelling product description for an e-commerce site for: ${productName} in the ${category} category. Keep it under 100 words, professional, and persuasive.`,
    });
    return interaction.output_text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

// Helper function to generate product recommendations
export async function getProductRecommendations(userQuery: string) {
  try {
    const interaction = await ai.interactions.create({
      model: "gemini-1.5-flash",
      input: `Based on this customer query: "${userQuery}", suggest 3 specific product categories or types they might be interested in. Return only a JSON array of strings, nothing else.`,
    });
    return JSON.parse(interaction.output_text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

// Helper function for customer support chatbot
export async function getAIResponse(userMessage: string, context?: string) {
  try {
    const prompt = context 
      ? `You are a helpful e-commerce customer support assistant for "Shopping" store. Context: ${context}\n\nCustomer: ${userMessage}\n\nAssistant:`
      : `You are a helpful e-commerce customer support assistant for "Shopping" store.\n\nCustomer: ${userMessage}\n\nAssistant:`;
    
    const interaction = await ai.interactions.create({
      model: "gemini-1.5-flash",
      input: prompt,
    });
    return interaction.output_text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

// Helper function to analyze product reviews sentiment
export async function analyzeReviewSentiment(review: string) {
  try {
    const interaction = await ai.interactions.create({
      model: "gemini-1.5-flash",
      input: `Analyze the sentiment of this product review and return only one word: "positive", "negative", or "neutral". Review: "${review}"`,
    });
    return interaction.output_text.toLowerCase().trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
