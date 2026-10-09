import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis for rate limiting
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Define rate limiters
const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 requests per 15 minutes
  analytics: true,
  prefix: 'ratelimit:auth',
});

const apiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
  analytics: true,
  prefix: 'ratelimit:api',
});

const sensitiveRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'), // 3 requests per hour
  analytics: true,
  prefix: 'ratelimit:sensitive',
});

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isAdmin = (req.auth?.user as any)?.role === "ADMIN";
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isAuthRoute = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");
  const isAccountRoute = nextUrl.pathname.startsWith("/account");
  const isCheckoutRoute = nextUrl.pathname.startsWith("/checkout");
  
  // Rate limiting for API routes
  if (nextUrl.pathname.startsWith('/api/')) {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'anonymous';
    const identifier = `ip:${ip}`;
    
    let ratelimit: Ratelimit | null = null;
    let limitType = 'none';
    
    // Apply strict rate limiting to authentication endpoints
    if (
      nextUrl.pathname.startsWith('/api/auth/signin') ||
      nextUrl.pathname.startsWith('/api/auth/signup') ||
      nextUrl.pathname.startsWith('/api/register')
    ) {
      ratelimit = authRateLimit;
      limitType = 'auth';
    }
    // Apply very strict rate limiting to sensitive endpoints
    else if (
      nextUrl.pathname.startsWith('/api/auth/reset-password') ||
      nextUrl.pathname.startsWith('/api/auth/verify-email')
    ) {
      ratelimit = sensitiveRateLimit;
      limitType = 'sensitive';
    }
    // Apply moderate rate limiting to all other API endpoints
    else {
      ratelimit = apiRateLimit;
      limitType = 'api';
    }
    
    // Check rate limit
    try {
      const { success, limit, remaining, reset } = await ratelimit.limit(identifier);
      
      if (!success) {
        console.log(`⚠️ Rate limit exceeded for ${identifier} on ${nextUrl.pathname} (${limitType})`);
        const response = NextResponse.json(
          {
            error: 'Too many requests',
            message: 'Rate limit exceeded. Please try again later.',
            type: limitType,
          },
          { status: 429 }
        );
        
        response.headers.set('X-RateLimit-Limit', limit.toString());
        response.headers.set('X-RateLimit-Remaining', remaining.toString());
        response.headers.set('X-RateLimit-Reset', reset.toString());
        
        return response;
      }
      
      // Add rate limit headers to successful requests
      const response = NextResponse.next();
      response.headers.set('X-RateLimit-Limit', limit.toString());
      response.headers.set('X-RateLimit-Remaining', remaining.toString());
      response.headers.set('X-RateLimit-Reset', reset.toString());
      
      // Continue with auth checks for non-API routes
      if (!nextUrl.pathname.startsWith('/api/')) {
        return performAuthChecks(req, isLoggedIn, isAdmin, isAdminRoute, isAuthRoute, isAccountRoute, isCheckoutRoute, nextUrl, response);
      }
      
      return response;
    } catch (error) {
      console.error('Rate limiting error:', error);
      // On error, allow the request to proceed (fail open)
    }
  }
  
  // Auth checks for non-API routes
  return performAuthChecks(req, isLoggedIn, isAdmin, isAdminRoute, isAuthRoute, isAccountRoute, isCheckoutRoute, nextUrl);
});

function performAuthChecks(
  req: any,
  isLoggedIn: boolean,
  isAdmin: boolean,
  isAdminRoute: boolean,
  isAuthRoute: boolean,
  isAccountRoute: boolean,
  isCheckoutRoute: boolean,
  nextUrl: any,
  response?: NextResponse
) {
  if (isAdminRoute) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login?callbackUrl=/admin", nextUrl));
    if (!isAdmin) return NextResponse.redirect(new URL("/", nextUrl));
  }
  if ((isAccountRoute || isCheckoutRoute) && !isLoggedIn) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${nextUrl.pathname}`, nextUrl));
  }
  return response || NextResponse.next();
}

export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"] };