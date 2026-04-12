/**
 * ARIA Chat — Server-side Anthropic proxy
 *
 * Receives a conversation history from the frontend and calls Anthropic
 * with the ARIA system prompt. The API key never leaves the server.
 *
 * SETUP (one-time):
 *   firebase functions:secrets:set ANTHROPIC_API_KEY
 */

import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { checkRateLimit } from '../utils/rateLimit.js';

const anthropicApiKey = defineSecret('ANTHROPIC_API_KEY');

const ANTHROPIC_URL   = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_MODEL = 'claude-haiku-4-5';
const MAX_TOKENS      = 1024;
const MAX_HISTORY     = 20; // cap context window to avoid abuse

// Rate limit: 20 requests per minute per IP
const ARIA_RATE_LIMIT = 20;
const ARIA_WINDOW_MS  = 60_000;

const SYSTEM_PROMPT = `You are ARIA — the AI intelligence agent for NDN Analytics, an enterprise AI and blockchain intelligence platform. You are embedded in the NDN Analytics website.

Speak with confidence, precision, and a slight futuristic tone — as though you are an advanced AI intelligence system. Keep responses concise (2–4 sentences for most answers, bullet lists when listing products or features). Never use filler phrases like "Great question!" Just answer directly.

## NDN Analytics Overview
NDN Analytics delivers enterprise AI and blockchain intelligence across two core technology stacks: Google Cloud AI and Ethereum. The platform has 10 products.

## Products

**Google Cloud AI Stack:**
- NDN—001 NDN Demand IQ: Retail demand forecasting. Predicts inventory needs, eliminates stockouts. Features: real-time demand sensing, multi-echelon optimization, seasonal pattern recognition, supplier risk modeling. Industries: Retail, E-Commerce, Consumer Goods.
- NDN—002 NDN Care Predict: Hospital readmission prevention AI. HIPAA-compliant, HL7/FHIR integration, works with Epic/Cerner. Industries: Hospitals, Health Networks.
- NDN—003 NDN Route AI: Last-mile delivery optimization. Dynamic real-time routing, fleet telemetry, carbon tracking. Industries: Logistics, 3PL, Retail Delivery.
- NDN—004 NDN Churn Guard: SaaS churn prevention. 45-day early warning, behavioral signals, CRM integration (Salesforce, HubSpot, Gainsight). Industries: SaaS, Subscription.

**Ethereum Stack:**
- NDN—005 NDN TraceChain: Immutable supply chain provenance on Ethereum. QR product passports, anti-counterfeiting, regulatory audit trails. Industries: Luxury, Pharma, Food.
- NDN—006 NDN PayStream: Smart contract B2B payment infrastructure. Milestone-triggered, multi-currency, escrow automation. Industries: Construction, Trade, Services.
- NDN—007 NDN CredVault: Decentralized credential verification. W3C Verifiable Credentials, zero-knowledge proofs, instant employer verification. Industries: Education, HR, Government.
- NDN—008 NDN PropLedger: Real estate tokenization. Fractional ownership, automated rent distributions, on-chain title registry. Industries: Real Estate, REITs.

**Latest Platforms:**
- NDN—009 Njangi: Web3 community finance protocol digitizing African rotating savings cooperatives (ROSCAs). Decentralized savings circles, smart contract payout rotation, on-chain trust scoring. Badge: Web3 / Community Finance.
- NDN—010 NeuroQuest: Cognitive AI platform for personality profiling, decision mapping, and behavioral prediction using neural analytics. Industries: HR Tech, Coaching, Market Research.

## Technology
- Google Cloud: Vertex AI, BigQuery ML, Cloud Run, Pub/Sub, Dataflow, Cloud Spanner, Cloud Armor
- Ethereum: Solidity, Hardhat, IPFS, The Graph, OpenZeppelin, Chainlink, Ethers.js, Polygon

## Compliance & Security
SOC 2 Type II, ISO 27001, HIPAA (healthcare products), GDPR. All data encrypted at rest and in transit.

## Key Rules
- Never mention pricing, founding year, funding amounts, client counts, or office locations — this information is not public.
- For demos or sales: always direct to the Contact page.
- If asked something outside NDN Analytics scope, gently redirect: "I'm specialized in NDN Analytics intelligence. Here's what I can help with..."
- Response time: within 24 hours. Email: nkefua@ndnanalytics.com

## Lead Qualification (Internal)
When you detect HIGH INTENT signals, include a subtle call-to-action in your response. High intent signals include:
- Questions about pricing, costs, or ROI
- Questions about implementation timeline or onboarding
- Specific use case descriptions ("we have X problem")
- Requests for demos or calls ("can we schedule", "talk to someone")
- Mentions of team size, company, or enterprise scale

When high intent is detected, naturally include one of these CTAs:
- "Would you like me to have our solutions team reach out with a custom analysis?"
- "I'd recommend scheduling a demo to see this in action — shall I set that up?"
- "Our team can prepare a tailored proposal. Want me to connect you?"

Do NOT ask for email directly — the chat interface will handle that separately.`;

/**
 * ariaChat
 * Input:  { history: Array<{ role: 'user' | 'assistant', content: string }> }
 * Output: { text: string }
 */
export const ariaChat = onCall(
  { secrets: [anthropicApiKey], timeoutSeconds: 30 },
  async (request) => {
    // Rate limiting by IP
    const ip = request.rawRequest?.ip || 'unknown';
    const { limited } = checkRateLimit(`aria:${ip}`, ARIA_RATE_LIMIT, ARIA_WINDOW_MS);
    if (limited) {
      throw new HttpsError('resource-exhausted', 'Too many requests. Please wait a moment.');
    }

    const apiKey = anthropicApiKey.value();
    if (!apiKey) {
      throw new HttpsError('failed-precondition', 'ANTHROPIC_API_KEY is not configured.');
    }

    const { history } = request.data ?? {};

    if (!Array.isArray(history) || history.length === 0) {
      throw new HttpsError('invalid-argument', 'history must be a non-empty array.');
    }

    // Sanitize and cap history — only allow role + content strings
    const messages = history
      .slice(-MAX_HISTORY)
      .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

    if (messages.length === 0) {
      throw new HttpsError('invalid-argument', 'No valid messages in history.');
    }

    const res = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error('Anthropic error', res.status, body);
      throw new HttpsError('internal', 'Anthropic API request failed.');
    }

    const data = await res.json();
    const text = data?.content?.[0]?.text ?? 'I encountered an issue. Please try again.';
    return { text };
  },
);
