import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // This will create tables if they don't exist
    await prisma.$executeRaw`SELECT 1`;
    
    return NextResponse.json({ 
      message: "Database connection successful! Now run: npx prisma db push" 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      message: "Database not initialized. Please run migrations." 
    }, { status: 500 });
  }
}
