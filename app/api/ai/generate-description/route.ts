import { NextResponse } from "next/server";
import { generateProductDescription } from "@/lib/gemini";
import { auth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    // Only admins can generate descriptions
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productName, category } = await req.json();

    if (!productName || !category) {
      return NextResponse.json({ 
        error: "Product name and category are required" 
      }, { status: 400 });
    }

    const description = await generateProductDescription(productName, category);

    return NextResponse.json({ 
      success: true,
      description 
    });
  } catch (error: any) {
    console.error("Description Generation Error:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to generate description" 
    }, { status: 500 });
  }
}
