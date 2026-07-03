/**
 * Firestore-backed rate limiter for Cloud Functions.
 *
 * Persists request counts per key in Firestore, surviving cold starts
 * and shared across all function instances.
 *
 * Collection: _rateLimits/{key}
 * Fields: count (number), windowStart (timestamp ms)
 */

import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const COLLECTION = '_rateLimits';

/**
 * Check if a request should be rate-limited.
 *
 * @param {string} key       - Unique key (e.g. "checkout:192.168.1.1")
 * @param {number} limit     - Max requests per window
 * @param {number} windowMs  - Window size in ms (default: 60 000 = 1 minute)
 * @returns {Promise<{ limited: boolean, remaining: number, resetIn: number }>}
 */
export async function checkRateLimit(key, limit, windowMs = 60_000) {
  const db = getFirestore();
  const docRef = db.collection(COLLECTION).doc(encodeURIComponent(key));
  const now = Date.now();

  try {
    const result = await db.runTransaction(async (tx) => {
      const snap = await tx.get(docRef);

      if (!snap.exists || now - snap.data().windowStart > windowMs) {
        // New window — reset counter
        tx.set(docRef, { count: 1, windowStart: now });
        return { limited: false, remaining: limit - 1, resetIn: windowMs };
      }

      const data = snap.data();
      const newCount = data.count + 1;

      if (newCount > limit) {
        const resetIn = windowMs - (now - data.windowStart);
        return { limited: true, remaining: 0, resetIn };
      }

      tx.update(docRef, { count: FieldValue.increment(1) });
      return { limited: false, remaining: limit - newCount, resetIn: windowMs - (now - data.windowStart) };
    });

    return result;
  } catch (err) {
    // On Firestore failure, fail open (allow the request) to avoid blocking users
    console.error('Rate limit check failed, allowing request:', err);
    return { limited: false, remaining: limit, resetIn: windowMs };
  }
}
