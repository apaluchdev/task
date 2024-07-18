// lib/rateLimiter.ts
import { getServerSession } from "next-auth";
import redis from "./redis";
import { authOptions } from "./auth";

const RATE_LIMIT_WINDOW_SECONDS = 30; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // Max 5 requests per window

export async function rateLimit(userId: string): Promise<boolean> {
  const key = `rate_limit:${userId}`;
  const currentCount = await redis.get<number>(key);

  if (currentCount === null) {
    await redis.set(key, 1, { ex: RATE_LIMIT_WINDOW_SECONDS });
    return true; // Allow request
  }

  if (currentCount < RATE_LIMIT_MAX_REQUESTS) {
    await redis.incr(key);
    return true; // Allow request
  }

  return false; // Reject request
}

export async function isRateLimitExceeded(): Promise<boolean> {
  const session = await getServerSession(authOptions);

  return await rateLimit(session?.user.id as string);
}
