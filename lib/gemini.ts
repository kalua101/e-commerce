import { HfInference } from "@huggingface/inference";

if (!process.env.HUGGINGFACE_API_KEY) {
  throw new Error("HUGGINGFACE_API_KEY is not set in environment variables");
}

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Helper function to generate product descriptions
export async function generateProductDescription(productName: string, category: string) {
  try {
    const prompt = `Write a compelling product description for an e-commerce site for: ${productName} in the ${category} category. Keep it under 100 words, professional, and persuasive.`;
    
    const response = await hf.chatCompletion({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    });
    
    return response.choices[0]?.message?.content || 'Could not generate description';
  } catch (error) {
    console.error("Hugging Face API Error:", error);
    throw error;
  }
}

// Helper function to generate product recommendations
export async function getProductRecommendations(userQuery: string) {
  try {
    const prompt = `Based on this customer query: "${userQuery}", suggest 3 specific product categories or types they might be interested in. Return only a JSON array of strings, nothing else. Example: ["Electronics", "Clothing", "Books"]`;
    
    const response = await hf.chatCompletion({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
      temperature: 0.5,
    });
    
    try {
      const content = response.choices[0]?.message?.content;
      return content ? JSON.parse(content) : ["Electronics", "Clothing", "Home & Garden"];
    } catch {
      return ["Electronics", "Clothing", "Home & Garden"];
    }
  } catch (error) {
    console.error("Hugging Face API Error:", error);
    throw error;
  }
}

// Helper function for customer support chatbot
export async function getAIResponse(userMessage: string, context?: string) {
  try {
    const systemMessage = `You are a helpful e-commerce customer support assistant for "Shopping" store.`;
    const userPrompt = context 
      ? `Context: ${context}\n\nCustomer: ${userMessage}`
      : userMessage;
    
    const response = await hf.chatCompletion({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });
    
    return response.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error("Hugging Face API Error:", error);
    throw error;
  }
}

// Helper function to analyze product reviews sentiment
export async function analyzeReviewSentiment(review: string) {
  try {
    const prompt = `Analyze the sentiment of this product review and return only one word: "positive", "negative", or "neutral". Review: "${review}"`;
    
    const response = await hf.chatCompletion({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 10,
      temperature: 0.3,
    });
    
    return response.choices[0]?.message?.content?.toLowerCase().trim() || 'neutral';
  } catch (error) {
    console.error("Hugging Face API Error:", error);
    throw error;
  }
}
