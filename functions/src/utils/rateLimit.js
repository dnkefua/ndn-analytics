/**
 * Simple in-memory rate limiter for Cloud Functions.
 *
 * Tracks request counts per IP using a sliding window.
 * Memory resets on cold start, which is acceptable — it prevents
 * sustained abuse without needing Redis or external storage.
 */

const buckets = new Map();

const CLEANUP_INTERVAL = 60_000; // 1 minute

// Periodic cleanup of expired entries
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of buckets) {
    if (now - entry.windowStart > entry.windowMs) {
      buckets.delete(key);
    }
  }
}, CLEANUP_INTERVAL);

/**
 * Check if a request should be rate-limited.
 *
 * @param {string} key     - Unique key (typically IP address)
 * @param {number} limit   - Max requests per window
 * @param {number} windowMs - Window size in ms (default: 60 000 = 1 minute)
 * @returns {{ limited: boolean, remaining: number, resetIn: number }}
 */
export function checkRateLimit(key, limit, windowMs = 60_000) {
  const now = Date.now();
  let entry = buckets.get(key);

  if (!entry || now - entry.windowStart > windowMs) {
    entry = { count: 1, windowStart: now, windowMs };
    buckets.set(key, entry);
    return { limited: false, remaining: limit - 1, resetIn: windowMs };
  }

  entry.count += 1;

  if (entry.count > limit) {
    const resetIn = windowMs - (now - entry.windowStart);
    return { limited: true, remaining: 0, resetIn };
  }

  return { limited: false, remaining: limit - entry.count, resetIn: windowMs - (now - entry.windowStart) };
}
