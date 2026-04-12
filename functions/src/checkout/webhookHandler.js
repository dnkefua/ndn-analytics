/**
 * Stripe Webhook Handler
 *
 * Listens for Stripe events and fulfils orders server-side.
 * Handles: checkout.session.completed
 *
 * SETUP (one-time):
 *   1. In Stripe Dashboard → Developers → Webhooks → Add endpoint:
 *        URL: https://stripwebhook-5qzkloym2q-uc.a.run.app
 *        Events: checkout.session.completed
 *   2. Copy the "Signing secret" (whsec_...) and store it:
 *        firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
 *
 * NOTE: The function URL is printed after `firebase deploy --only functions`.
 *       It follows the pattern: https://stripewebhook-<hash>-uc.a.run.app
 */

import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { initializeApp, getApps } from 'firebase-admin/app';
import Stripe from 'stripe';

// Secrets
const stripeSecretKey     = defineSecret('STRIPE_SECRET_KEY');
const stripeWebhookSecret = defineSecret('STRIPE_WEBHOOK_SECRET');
const resendApiKey        = defineSecret('RESEND_API_KEY');

// Admin SDK init (idempotent)
if (!getApps().length) initializeApp();

const INTERNAL_ALERT_EMAIL = 'nkefua@ndnanalytics.com';
const FROM_EMAIL           = 'NDN Analytics <hello@ndnanalytics.com>';
const RESEND_API_URL       = 'https://api.resend.com/emails';

// ─── Helper: send email via Resend ───────────────────────────────────────────
async function sendEmail({ to, subject, html, resendApiKey }) {
  const res = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error('Resend error', res.status, body);
    // Non-fatal — don't throw, so Firestore record still lands
  }
}

// ─── Email: buyer confirmation ────────────────────────────────────────────────
function buyerConfirmationHtml({ name, email, sessionId }) {
  const displayName = name || email;
  return `
<div style="font-family:'Inter',-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:40px 24px;color:#1E293B;">
  <div style="text-align:center;margin-bottom:32px;">
    <h1 style="color:#7C3AED;font-size:24px;margin-bottom:8px;">NDN Analytics</h1>
    <p style="color:#64748B;font-size:14px;">AI &amp; Blockchain Enterprise Solutions</p>
  </div>

  <h2 style="font-size:22px;color:#0F172A;margin-bottom:16px;">
    Your AI Readiness Assessment is Confirmed ✓
  </h2>

  <p style="font-size:16px;line-height:1.7;color:#475569;margin-bottom:20px;">
    Hi ${displayName},<br><br>
    Thank you for purchasing the <strong>NDN Analytics AI Readiness Assessment</strong>. 
    Your payment of <strong>$499</strong> has been received.
  </p>

  <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:24px;margin-bottom:24px;">
    <h3 style="font-size:16px;color:#0F172A;margin:0 0 16px 0;">What happens next:</h3>
    <ol style="font-size:15px;line-height:1.9;color:#475569;margin:0;padding-left:20px;">
      <li><strong>Within 24 hours</strong> — You'll receive a calendar invite for your 2-hour discovery workshop</li>
      <li><strong>Discovery workshop</strong> — We map your AI &amp; blockchain opportunities across your operations</li>
      <li><strong>Within 5 business days</strong> — You receive your AI Readiness Scorecard, opportunity map, and implementation roadmap</li>
      <li><strong>30 days</strong> — Email support from your assigned NDN Analytics strategist</li>
    </ol>
  </div>

  <p style="font-size:15px;line-height:1.7;color:#475569;margin-bottom:24px;">
    Reference: <code style="background:#F1F5F9;padding:2px 6px;border-radius:4px;font-size:13px;">${sessionId}</code>
  </p>

  <p style="font-size:15px;color:#475569;margin-bottom:8px;">
    Questions? Reply to this email or reach us at 
    <a href="mailto:nkefua@ndnanalytics.com" style="color:#7C3AED;">nkefua@ndnanalytics.com</a>
  </p>

  <hr style="border:none;border-top:1px solid #E2E8F0;margin:32px 0;">
  <p style="font-size:13px;color:#94A3B8;text-align:center;">NDN Analytics &mdash; Enterprise AI &amp; Blockchain Intelligence</p>
</div>`;
}

// ─── Email: internal alert ────────────────────────────────────────────────────
function internalAlertHtml({ name, email, sessionId, amount }) {
  const amountFormatted = `$${(amount / 100).toFixed(2)}`;
  return `
<div style="font-family:monospace;max-width:600px;margin:0 auto;padding:32px 24px;">
  <h2 style="color:#7C3AED;">🎉 New Purchase: AI Readiness Assessment</h2>
  <table style="border-collapse:collapse;width:100%;font-size:14px;">
    <tr><td style="padding:6px 12px 6px 0;color:#64748B;width:140px;">Amount</td><td style="padding:6px 0;font-weight:bold;">${amountFormatted}</td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#64748B;">Customer name</td><td style="padding:6px 0;">${name || '(not provided)'}</td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#64748B;">Customer email</td><td style="padding:6px 0;"><a href="mailto:${email}">${email}</a></td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#64748B;">Session ID</td><td style="padding:6px 0;font-size:12px;">${sessionId}</td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#64748B;">Time</td><td style="padding:6px 0;">${new Date().toUTCString()}</td></tr>
  </table>
  <p style="margin-top:24px;font-size:13px;color:#64748B;">
    Action required: Send calendar invite for discovery workshop within 24 hours.
  </p>
</div>`;
}

// ─── Main webhook handler ─────────────────────────────────────────────────────
export const stripeWebhook = onRequest(
  {
    secrets: [stripeSecretKey, stripeWebhookSecret, resendApiKey],
    // Stripe requires the raw body to verify the signature
    invoker: 'public',
  },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    const signature    = req.headers['stripe-signature'];
    const webhookSec   = stripeWebhookSecret.value();
    const secretKey    = stripeSecretKey.value();

    if (!webhookSec || !secretKey) {
      console.error('Stripe secrets not configured');
      res.status(500).send('Server configuration error');
      return;
    }

    const stripe = new Stripe(secretKey, { apiVersion: '2025-02-24.acacia' });

    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.rawBody, signature, webhookSec);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Acknowledge receipt immediately
    res.status(200).json({ received: true });

    // Handle events
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      const customerEmail  = session.customer_details?.email ?? '';
      const customerName   = session.customer_details?.name ?? '';
      const sessionId      = session.id;
      const amountTotal    = session.amount_total ?? 0; // cents
      const paymentStatus  = session.payment_status;
      const productId      = session.metadata?.productId ?? 'ai-readiness-assessment';

      if (paymentStatus !== 'paid') {
        console.warn('Session not paid, skipping fulfilment:', sessionId);
        return;
      }

      const db = getFirestore();

      // ── 1. Record purchase in Firestore ──────────────────────────────────
      try {
        await db.collection('purchases').doc(sessionId).set({
          sessionId,
          productId,
          customerEmail,
          customerName,
          amountTotal,
          currency: session.currency ?? 'usd',
          paymentStatus,
          fulfilledAt: FieldValue.serverTimestamp(),
          stripeCustomerId: session.customer ?? null,
          stripePaymentIntent: session.payment_intent ?? null,
        });
        console.log('Purchase recorded:', sessionId);
      } catch (err) {
        console.error('Failed to record purchase to Firestore:', err);
      }

      // ── 2. Send confirmation email to buyer ──────────────────────────────
      // Resend key is stored server-side as a secret; fall back gracefully if not set
      const resendKey = resendApiKey.value();
      if (resendKey && customerEmail) {
        await sendEmail({
          to: customerEmail,
          subject: 'Your AI Readiness Assessment — Next Steps',
          html: buyerConfirmationHtml({
            name: customerName,
            email: customerEmail,
            sessionId,
          }),
          resendApiKey: resendKey,
        });

        // ── 3. Internal alert ──────────────────────────────────────────────
        await sendEmail({
          to: INTERNAL_ALERT_EMAIL,
          subject: `🎉 New $499 Purchase — ${customerEmail}`,
          html: internalAlertHtml({
            name: customerName,
            email: customerEmail,
            sessionId,
            amount: amountTotal,
          }),
          resendApiKey: resendKey,
        });
      } else {
        console.warn('RESEND_API_KEY not configured — emails not sent for session:', sessionId);
      }
    }
  },
);
