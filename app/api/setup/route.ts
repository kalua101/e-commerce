import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Try a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    await prisma.$disconnect();
    
    return NextResponse.json({ 
      success: true,
      message: "Database connection successful!",
      test: result,
      tables: tables,
      databaseUrl: process.env.DATABASE_URL ? "✅ Set" : "❌ Not set"
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false,
      error: error.message,
      code: error.code,
      message: "Database connection failed",
      databaseUrl: process.env.DATABASE_URL ? "✅ Set" : "❌ Not set"
    }, { status: 500 });
  }
}
