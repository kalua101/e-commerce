import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to generate product descriptions
export async function generateProductDescription(productName: string, category: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const prompt = `Write a compelling product description for an e-commerce site for: ${productName} in the ${category} category. Keep it under 100 words, professional, and persuasive.`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

// Helper function to generate product recommendations
export async function getProductRecommendations(userQuery: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const prompt = `Based on this customer query: "${userQuery}", suggest 3 specific product categories or types they might be interested in. Return only a JSON array of strings, nothing else.`;
    
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

// Helper function for customer support chatbot
export async function getAIResponse(userMessage: string, context?: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const prompt = context 
      ? `You are a helpful e-commerce customer support assistant for "Shopping" store. Context: ${context}\n\nCustomer: ${userMessage}\n\nAssistant:`
      : `You are a helpful e-commerce customer support assistant for "Shopping" store.\n\nCustomer: ${userMessage}\n\nAssistant:`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

// Helper function to analyze product reviews sentiment
export async function analyzeReviewSentiment(review: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const prompt = `Analyze the sentiment of this product review and return only one word: "positive", "negative", or "neutral". Review: "${review}"`;
    
    const result = await model.generateContent(prompt);
    return result.response.text().toLowerCase().trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
