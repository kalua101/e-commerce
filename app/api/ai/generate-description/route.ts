import { NextResponse } from 'next/server';
import { generateProductDescription } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const { productName, category } = await request.json();

    if (!productName || !category) {
      return NextResponse.json(
        { error: 'Product name and category are required' },
        { status: 400 }
      );
    }

    const description = await generateProductDescription(productName, category);

    return NextResponse.json({ description });
  } catch (error) {
    console.error('Error generating description:', error);
    return NextResponse.json(
      { error: 'Failed to generate description' },
      { status: 500 }
    );
  }
}
