import { NextResponse } from 'next/server';
import { generateText } from '@/lib/openai';

/**
 * Test endpoint - equivalent to your Python example
 * GET /api/ai/test?prompt=write+a+haiku+about+ai
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const prompt = searchParams.get('prompt') || 'write a haiku about ai';

    const result = await generateText(prompt);

    return NextResponse.json({ 
      output_text: result,
      prompt: prompt,
      model: 'gpt-6-luna'
    });
  } catch (error: any) {
    console.error('OpenAI test error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to generate text',
        details: error.toString()
      },
      { status: 500 }
    );
  }
}

/**
 * POST version for more complex requests
 */
export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const result = await generateText(prompt);

    return NextResponse.json({ 
      output_text: result,
      prompt: prompt,
      model: 'gpt-6-luna'
    });
  } catch (error: any) {
    console.error('OpenAI test error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to generate text',
        details: error.toString()
      },
      { status: 500 }
    );
  }
}
