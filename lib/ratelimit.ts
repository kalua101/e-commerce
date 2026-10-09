import { Ratelimit } from '@upstash/ratelimit';
import { redis } from './redis';

// Rate limit configurations for different endpoints

// Strict rate limit for authentication endpoints (prevent brute force)
export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 requests per 15 minutes
  analytics: true,
  prefix: 'ratelimit:auth',
});

// Moderate rate limit for API endpoints
export const apiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
  analytics: true,
  prefix: 'ratelimit:api',
});

// Relaxed rate limit for general pages
export const pageRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, '10 s'), // 30 requests per 10 seconds
  analytics: true,
  prefix: 'ratelimit:page',
});

// Very strict for sensitive operations (password reset, email verification)
export const sensitiveRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'), // 3 requests per hour
  analytics: true,
  prefix: 'ratelimit:sensitive',
});

// Helper function to check rate limit and return appropriate response
export async function checkRateLimit(
  identifier: string,
  ratelimiter: Ratelimit
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  const { success, limit, remaining, reset } = await ratelimiter.limit(identifier);
  
  return {
    success,
    limit,
    remaining,
    reset,
  };
}

// Get identifier from request (IP or user ID)
export function getIdentifier(req: Request, userId?: string): string {
  if (userId) {
    return `user:${userId}`;
  }
  
  // Try to get IP from headers (for proxies/load balancers)
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'anonymous';
  
  return `ip:${ip}`;
}

// Rate limit response headers
export function getRateLimitHeaders(result: {
  limit: number;
  remaining: number;
  reset: number;
}) {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
  };
}
