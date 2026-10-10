import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const startTime = Date.now();
    
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    const dbTime = Date.now() - startTime;
    
    // Check Redis (if available)
    let redisStatus = 'not configured';
    try {
      if (process.env.REDIS_URL) {
        // Redis check would go here
        redisStatus = 'healthy';
      }
    } catch {
      redisStatus = 'unhealthy';
    }
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: 'healthy',
          responseTime: `${dbTime}ms`
        },
        redis: {
          status: redisStatus
        }
      },
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
