import { NextResponse } from 'next/server';
import { chatWithAssistant } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const { message, history = [] } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Limit conversation history to last 10 messages to manage token usage
    const limitedHistory = history.slice(-10);

    const response = await chatWithAssistant(message, limitedHistory);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error processing chat:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
