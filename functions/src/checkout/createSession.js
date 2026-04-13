/**
 * Stripe Checkout Session Creator
 *
 * Creates a Stripe Checkout session for the AI Readiness Assessment ($499).
 *
 * SETUP (one-time):
 *   1. Get your keys from https://dashboard.stripe.com/apikeys
 *   2. Set the secret key in Firebase:
 *        firebase functions:secrets:set STRIPE_SECRET_KEY
 *   3. Add your publishable key to ndn-analytics/.env:
 *        VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
 *   4. In Stripe dashboard, create a webhook pointing to:
 *        https://<region>-<project>.cloudfunctions.net/stripeWebhook
 *      and set STRIPE_WEBHOOK_SECRET via:
 *        firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
 */

import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import Stripe from 'stripe';
import { checkRateLimit } from '../utils/rateLimit.js';

const stripeSecretKey = defineSecret('STRIPE_SECRET_KEY');

// Rate limit: 5 checkout creations per minute per IP
const CHECKOUT_RATE_LIMIT = 5;
const CHECKOUT_WINDOW_MS  = 60_000;

/** Products available for purchase */
const PRODUCTS = {
  'ai-readiness-assessment': {
    name: 'AI Readiness Assessment',
    description:
      '2-hour discovery workshop, AI/Blockchain opportunity mapping, implementation roadmap, ROI projection report, and 30-day email support.',
    amount: 49900, // $499.00 in cents
    currency: 'usd',
    mode: 'payment', // one-time
  },
};

/**
 * createCheckoutSession
 * Called from the frontend via Firebase callable function.
 *
 * Input: { productId: string, customerEmail?: string }
 * Returns: { url: string } — the Stripe-hosted checkout URL
 */
export const createCheckoutSession = onCall(
  { secrets: [stripeSecretKey] },
  async (request) => {
    // Rate limiting by IP
    const ip = request.rawRequest?.ip || 'unknown';
    const { limited } = await checkRateLimit(`checkout:${ip}`, CHECKOUT_RATE_LIMIT, CHECKOUT_WINDOW_MS);
    if (limited) {
      throw new HttpsError('resource-exhausted', 'Too many requests. Please try again shortly.');
    }

    const { productId = 'ai-readiness-assessment', customerEmail } = request.data ?? {};

    const product = PRODUCTS[productId];
    if (!product) {
      throw new HttpsError('not-found', `Unknown product: ${productId}`);
    }

    const secretKey = stripeSecretKey.value();
    if (!secretKey || secretKey.startsWith('sk_test_PLACEHOLDER')) {
      throw new HttpsError(
        'failed-precondition',
        'Stripe is not yet configured. Set STRIPE_SECRET_KEY via: firebase functions:secrets:set STRIPE_SECRET_KEY',
      );
    }

    const stripe = new Stripe(secretKey, { apiVersion: '2024-12-18.acacia' });

    // Determine the site origin for redirect URLs
    const origin = request.rawRequest?.headers?.origin ?? 'https://ndn-analytics.web.app';

    try {
      const session = await stripe.checkout.sessions.create({
        mode: product.mode,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: product.currency,
              product_data: {
                name: product.name,
                description: product.description,
                images: ['https://ndn-analytics.web.app/og-image.svg'],
              },
              unit_amount: product.amount,
            },
            quantity: 1,
          },
        ],
        customer_email: customerEmail ?? undefined,
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/checkout/cancelled`,
        metadata: {
          productId,
          source: 'pricing_page',
        },
        // Collect billing address for invoicing
        billing_address_collection: 'required',
        // Allow promo codes
        allow_promotion_codes: true,
        // Custom branding text
        custom_text: {
          submit: {
            message:
              'Once payment is confirmed, our team will contact you within 1 business day to schedule the discovery workshop.',
          },
        },
      });

      return { url: session.url };
    } catch (err) {
      console.error('Stripe session creation failed:', err);
      throw new HttpsError('internal', 'Failed to create checkout session. Please try again.');
    }
  },
);
