// ── Anthropic Claude API integration ─────────────────────────────────────────
// Model: claude-haiku-4-5 (fast, cost-efficient for chat)
// Key: VITE_ANTHROPIC_API_KEY in .env

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || '';
const ANTHROPIC_MODEL   = 'claude-haiku-4-5';
const ANTHROPIC_URL     = 'https://api.anthropic.com/v1/messages';

export const HAS_ANTHROPIC_KEY = Boolean(ANTHROPIC_API_KEY);

// ── System prompt: full NDN context + intent detection ─────────────────────────
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

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Intent signal types
export type IntentType = 'pricing_inquiry' | 'demo_request' | 'timeline_mention' | 'use_case' | 'product_interest';

export interface IntentSignal {
  type: IntentType;
  confidence: number;
  productId?: string;
}

// Product ID mapping for intent detection
const PRODUCT_KEYWORDS: Record<string, string> = {
  'demand iq': 'ndn-001',
  'demand forecasting': 'ndn-001',
  'inventory': 'ndn-001',
  'care predict': 'ndn-002',
  'readmission': 'ndn-002',
  'hospital': 'ndn-002',
  'healthcare': 'ndn-002',
  'route ai': 'ndn-003',
  'delivery': 'ndn-003',
  'logistics': 'ndn-003',
  'churn guard': 'ndn-004',
  'churn': 'ndn-004',
  'subscription': 'ndn-004',
  'tracechain': 'ndn-005',
  'supply chain': 'ndn-005',
  'provenance': 'ndn-005',
  'paystream': 'ndn-006',
  'payment': 'ndn-006',
  'smart contract': 'ndn-006',
  'credvault': 'ndn-007',
  'credential': 'ndn-007',
  'verification': 'ndn-007',
  'propledger': 'ndn-008',
  'real estate': 'ndn-008',
  'tokenization': 'ndn-008',
  'njangi': 'ndn-009',
  'rosca': 'ndn-009',
  'savings': 'ndn-009',
  'neuroquest': 'ndn-010',
  'personality': 'ndn-010',
  'behavioral': 'ndn-010',
};

// Analyze message for intent signals
export function analyzeIntent(message: string): IntentSignal[] {
  const signals: IntentSignal[] = [];
  const lower = message.toLowerCase();

  // Pricing inquiry
  if (/\b(price|pricing|cost|budget|roi|investment|how much|afford)\b/i.test(lower)) {
    signals.push({ type: 'pricing_inquiry', confidence: 0.9 });
  }

  // Demo request
  if (/\b(demo|schedule|call|meeting|talk|speak|connect|reach out)\b/i.test(lower)) {
    signals.push({ type: 'demo_request', confidence: 0.95 });
  }

  // Timeline mention
  if (/\b(timeline|when|how long|implement|deploy|launch|start|begin|rollout)\b/i.test(lower)) {
    signals.push({ type: 'timeline_mention', confidence: 0.8 });
  }

  // Use case description
  if (/\b(we have|our company|our team|we need|we're looking|problem|challenge|use case)\b/i.test(lower)) {
    signals.push({ type: 'use_case', confidence: 0.85 });
  }

  // Product interest
  for (const [keyword, productId] of Object.entries(PRODUCT_KEYWORDS)) {
    if (lower.includes(keyword)) {
      signals.push({ type: 'product_interest', confidence: 0.7, productId });
    }
  }

  return signals;
}

// Check if conversation shows high intent (should trigger email capture)
export function isHighIntent(history: ChatMessage[]): boolean {
  let productMentions = 0;
  let highIntentSignals = 0;

  for (const msg of history) {
    if (msg.role !== 'user') continue;

    const signals = analyzeIntent(msg.content);
    for (const signal of signals) {
      if (signal.type === 'product_interest') {
        productMentions++;
      }
      if (signal.type === 'pricing_inquiry' || signal.type === 'demo_request') {
        highIntentSignals++;
      }
    }
  }

  // Trigger email capture after 3+ product mentions OR any pricing/demo inquiry
  return productMentions >= 3 || highIntentSignals >= 1;
}

// Get all product interests from conversation
export function extractProductInterests(history: ChatMessage[]): string[] {
  const products = new Set<string>();

  for (const msg of history) {
    if (msg.role !== 'user') continue;
    const signals = analyzeIntent(msg.content);
    for (const signal of signals) {
      if (signal.productId) {
        products.add(signal.productId);
      }
    }
  }

  return Array.from(products);
}

export async function askAria(history: ChatMessage[]): Promise<string> {
  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: history,
    }),
  });

  if (!res.ok) throw new Error(`Anthropic error: ${res.status}`);

  const data = await res.json();
  return data?.content?.[0]?.text ?? 'I encountered an issue. Please try again.';
}
