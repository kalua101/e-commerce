import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate a product description using OpenAI Responses API
 */
export async function generateProductDescription(productName: string, category: string) {
  try {
    // Using the newer Responses API format with gpt-6-luna model
    const response = await openai.responses.create({
      model: 'gpt-6-luna',
      input: `Write a compelling product description for: ${productName} in the ${category} category. Keep it concise (2-3 sentences) and highlight key benefits. You are a professional e-commerce copywriter creating engaging, SEO-friendly content.`,
      store: true,
    });

    return response.output_text || '';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate product description');
  }
}

/**
 * Generate product suggestions using OpenAI Responses API
 */
export async function generateProductSuggestions(userQuery: string, limit: number = 5) {
  try {
    const response = await openai.responses.create({
      model: 'gpt-6-luna',
      input: `You are a helpful shopping assistant. Suggest ${limit} specific product names for: "${userQuery}". Return only product names, one per line, no numbering or extra text.`,
      store: true,
    });

    const suggestions = response.output_text?.split('\n').filter(s => s.trim()) || [];
    return suggestions.slice(0, limit);
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate suggestions');
  }
}

/**
 * Chat with AI assistant using OpenAI Responses API
 * Note: Responses API is simpler but doesn't support conversation history in the same way
 */
export async function chatWithAssistant(userMessage: string, conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []) {
  try {
    // Combine history into a single input for the Responses API
    let contextualInput = 'You are a friendly e-commerce customer service assistant. Help customers find products, answer questions, and provide shopping advice.\n\n';
    
    if (conversationHistory.length > 0) {
      contextualInput += 'Previous conversation:\n';
      conversationHistory.slice(-3).forEach(msg => { // Only last 3 messages for context
        contextualInput += `${msg.role === 'user' ? 'Customer' : 'Assistant'}: ${msg.content}\n`;
      });
      contextualInput += '\n';
    }
    
    contextualInput += `Customer: ${userMessage}\nAssistant:`;

    const response = await openai.responses.create({
      model: 'gpt-6-luna',
      input: contextualInput,
      store: true,
    });

    return response.output_text || '';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to process chat message');
  }
}

/**
 * Simple AI text generation (like your haiku example)
 */
export async function generateText(prompt: string) {
  try {
    const response = await openai.responses.create({
      model: 'gpt-6-luna',
      input: prompt,
      store: true,
    });

    return response.output_text || '';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate text');
  }
}
