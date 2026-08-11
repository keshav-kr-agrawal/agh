import { NextRequest } from 'next/server';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const ipStore = new Map<string, RateLimitStore>();

// Clean up stale IP records every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipStore.entries()) {
    if (now > record.resetTime) {
      ipStore.delete(ip);
    }
  }
}, 5 * 60 * 1000);

/**
 * Basic IP-based Rate Limiter to prevent DoS attacks & spamming
 * @param req NextRequest
 * @param maxRequests Maximum allowed requests per window
 * @param windowMs Time window in milliseconds
 */
export function checkRateLimit(req: NextRequest, maxRequests = 15, windowMs = 60 * 1000): { success: boolean; limit: number; remaining: number } {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
             req.headers.get('x-real-ip') || 
             '127.0.0.1';

  const now = Date.now();
  const record = ipStore.get(ip);

  if (!record || now > record.resetTime) {
    ipStore.set(ip, { count: 1, resetTime: now + windowMs });
    return { success: true, limit: maxRequests, remaining: maxRequests - 1 };
  }

  if (record.count >= maxRequests) {
    return { success: false, limit: maxRequests, remaining: 0 };
  }

  record.count += 1;
  return { success: true, limit: maxRequests, remaining: maxRequests - record.count };
}
