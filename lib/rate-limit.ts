/**
 * In-memory rate limit for the donation API.
 * Uses client IP (x-forwarded-for / x-real-ip). Resets per deployment in serverless.
 * For multi-instance persistence use Redis/KV later.
 */

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10;

const store = new Map<string, number[]>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

function prune(key: string): void {
  const now = Date.now();
  const timestamps = store.get(key) ?? [];
  const valid = timestamps.filter((t) => now - t < WINDOW_MS);
  if (valid.length === 0) store.delete(key);
  else store.set(key, valid);
}

/**
 * Returns true if the request should be rate limited (too many requests).
 * Call before processing POST /api/donations.
 */
export function isRateLimited(request: Request): boolean {
  const key = `donation:${getClientIp(request)}`;
  const now = Date.now();

  prune(key);
  const timestamps = store.get(key) ?? [];
  if (timestamps.length >= MAX_REQUESTS) {
    return true;
  }
  timestamps.push(now);
  store.set(key, timestamps);
  return false;
}
