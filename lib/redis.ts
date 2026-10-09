import { Redis } from '@upstash/redis';

// Initialize Upstash Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Cache key prefixes for organization
export const CACHE_KEYS = {
  PRODUCTS: 'products:all',
  PRODUCT: (id: string) => `product:${id}`,
  CATEGORIES: 'categories:all',
  CATEGORY_PRODUCTS: (slug: string) => `category:${slug}:products`,
  USER_CART: (userId: string) => `cart:${userId}`,
  PRODUCT_SEARCH: (query: string) => `search:${query}`,
} as const;

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  PRODUCTS: 300, // 5 minutes
  PRODUCT: 600, // 10 minutes
  CATEGORIES: 3600, // 1 hour
  SEARCH: 180, // 3 minutes
  CART: 86400, // 24 hours
} as const;

// Helper function to get or set cache
export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number
): Promise<T> {
  try {
    // Try to get from cache
    const cached = await redis.get<T>(key);
    if (cached) {
      console.log(`Cache HIT: ${key}`);
      return cached;
    }

    // Cache miss - fetch fresh data
    console.log(`Cache MISS: ${key}`);
    const data = await fetcher();

    // Store in cache with TTL
    await redis.setex(key, ttl, JSON.stringify(data));

    return data;
  } catch (error) {
    console.error('Redis error:', error);
    // Fallback to fetcher if Redis fails
    return fetcher();
  }
}

// Helper function to invalidate cache
export async function invalidateCache(key: string | string[]): Promise<void> {
  try {
    const keys = Array.isArray(key) ? key : [key];
    await redis.del(...keys);
    console.log(`Cache invalidated: ${keys.join(', ')}`);
  } catch (error) {
    console.error('Redis invalidation error:', error);
  }
}

// Helper function to invalidate pattern-based keys
export async function invalidateCachePattern(pattern: string): Promise<void> {
  try {
    // Get all keys matching pattern
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`Cache pattern invalidated: ${pattern} (${keys.length} keys)`);
    }
  } catch (error) {
    console.error('Redis pattern invalidation error:', error);
  }
}

// Helper to set cache directly
export async function setCache<T>(
  key: string,
  value: T,
  ttl: number
): Promise<void> {
  try {
    await redis.setex(key, ttl, JSON.stringify(value));
  } catch (error) {
    console.error('Redis set error:', error);
  }
}
