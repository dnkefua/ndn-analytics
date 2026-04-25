// ── ARIA Chat API — calls server-side Firebase callable (key never in browser)
import { getFunctions, httpsCallable } from 'firebase/functions';

export const HAS_ANTHROPIC_KEY = true; // key is always available server-side
// System prompt lives server-side in functions/src/aria/ariaChat.js

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
  'model studio': 'ndn-012',
  'fine tuning': 'ndn-012',
  'ipfs chain': 'ndn-013',
  'diaspora': 'ndn-014',
  'thediaspora': 'ndn-014',
  'community network': 'ndn-014',
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
  const functions = getFunctions();
  const ariaChat = httpsCallable<{ history: ChatMessage[] }, { text: string }>(functions, 'ariaChat');
  const result = await ariaChat({ history });
  return result.data.text;
}
