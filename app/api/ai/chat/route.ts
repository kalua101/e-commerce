import { NextResponse } from "next/server";
import { getAIResponse } from "@/lib/gemini";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const response = await getAIResponse(message, context);

    return NextResponse.json({ 
      success: true,
      response 
    });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to get AI response" 
    }, { status: 500 });
  }
}
