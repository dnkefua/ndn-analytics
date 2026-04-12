import { describe, it, expect } from 'vitest';
import {
  analyzeIntent,
  isHighIntent,
  extractProductInterests,
  type ChatMessage,
} from '../components/aria/ariaApi';

describe('analyzeIntent', () => {
  describe('pricing inquiry detection', () => {
    it.each([
      'What is the price?',
      'How much does it cost?',
      'What is the pricing for Demand IQ?',
      'What budget do I need?',
      'What is the ROI?',
      'Can we afford this investment?',
    ])('detects pricing intent in: "%s"', (msg) => {
      const signals = analyzeIntent(msg);
      expect(signals.some(s => s.type === 'pricing_inquiry')).toBe(true);
    });

    it('does not detect pricing for unrelated message', () => {
      const signals = analyzeIntent('Tell me about your company.');
      expect(signals.some(s => s.type === 'pricing_inquiry')).toBe(false);
    });
  });

  describe('demo request detection', () => {
    it.each([
      'Can I schedule a demo?',
      'I want to talk to someone',
      'Can we set up a meeting?',
      'I would like to speak with a rep',
      'How do I connect with sales?',
      'Please reach out to me',
    ])('detects demo intent in: "%s"', (msg) => {
      const signals = analyzeIntent(msg);
      expect(signals.some(s => s.type === 'demo_request')).toBe(true);
    });
  });

  describe('timeline mention detection', () => {
    it.each([
      'What is the timeline for deployment?',
      'How long does implementation take?',
      'When can we launch?',
      'We want to deploy by Q3',
      'How do we start the rollout?',
    ])('detects timeline intent in: "%s"', (msg) => {
      const signals = analyzeIntent(msg);
      expect(signals.some(s => s.type === 'timeline_mention')).toBe(true);
    });
  });

  describe('use case detection', () => {
    it.each([
      'We have a supply chain problem.',
      'Our company needs better analytics.',
      'Our team is looking for a solution.',
      'We need to reduce churn.',
      "We're looking for AI tools.",
      'The challenge is real-time tracking.',
    ])('detects use_case intent in: "%s"', (msg) => {
      const signals = analyzeIntent(msg);
      expect(signals.some(s => s.type === 'use_case')).toBe(true);
    });
  });

  describe('product interest detection — all product keywords', () => {
    const keywordMap: [string, string][] = [
      ['demand iq', 'ndn-001'],
      ['demand forecasting', 'ndn-001'],
      ['inventory', 'ndn-001'],
      ['care predict', 'ndn-002'],
      ['readmission', 'ndn-002'],
      ['hospital', 'ndn-002'],
      ['healthcare', 'ndn-002'],
      ['route ai', 'ndn-003'],
      ['delivery', 'ndn-003'],
      ['logistics', 'ndn-003'],
      ['churn guard', 'ndn-004'],
      ['churn', 'ndn-004'],
      ['subscription', 'ndn-004'],
      ['tracechain', 'ndn-005'],
      ['supply chain', 'ndn-005'],
      ['provenance', 'ndn-005'],
      ['paystream', 'ndn-006'],
      ['payment', 'ndn-006'],
      ['smart contract', 'ndn-006'],
      ['credvault', 'ndn-007'],
      ['credential', 'ndn-007'],
      ['verification', 'ndn-007'],
      ['propledger', 'ndn-008'],
      ['real estate', 'ndn-008'],
      ['tokenization', 'ndn-008'],
      ['njangi', 'ndn-009'],
      ['rosca', 'ndn-009'],
      ['savings', 'ndn-009'],
      ['neuroquest', 'ndn-010'],
      ['personality', 'ndn-010'],
      ['behavioral', 'ndn-010'],
    ];

    it.each(keywordMap)(
      'maps keyword "%s" to product %s',
      (keyword, expectedProductId) => {
        const signals = analyzeIntent(`Tell me about ${keyword}`);
        const productSignal = signals.find(
          s => s.type === 'product_interest' && s.productId === expectedProductId
        );
        expect(productSignal).toBeDefined();
        expect(productSignal!.confidence).toBe(0.7);
      }
    );
  });

  describe('multi-signal detection', () => {
    it('detects both pricing and product interest in one message', () => {
      const signals = analyzeIntent('How much does Demand IQ cost?');
      expect(signals.some(s => s.type === 'pricing_inquiry')).toBe(true);
      expect(signals.some(s => s.type === 'product_interest' && s.productId === 'ndn-001')).toBe(true);
    });

    it('detects demo request and product interest together', () => {
      const signals = analyzeIntent('Can I schedule a demo for PayStream?');
      expect(signals.some(s => s.type === 'demo_request')).toBe(true);
      expect(signals.some(s => s.type === 'product_interest' && s.productId === 'ndn-006')).toBe(true);
    });

    it('detects multiple products in one message', () => {
      const signals = analyzeIntent('Compare Demand IQ and Care Predict');
      const productSignals = signals.filter(s => s.type === 'product_interest');
      const productIds = productSignals.map(s => s.productId);
      expect(productIds).toContain('ndn-001');
      expect(productIds).toContain('ndn-002');
    });
  });

  it('returns empty array for generic message with no signals', () => {
    const signals = analyzeIntent('Hello there!');
    expect(signals).toEqual([]);
  });

  it('is case-insensitive', () => {
    const signals = analyzeIntent('DEMAND IQ PRICING');
    expect(signals.some(s => s.type === 'pricing_inquiry')).toBe(true);
    expect(signals.some(s => s.type === 'product_interest' && s.productId === 'ndn-001')).toBe(true);
  });
});

describe('isHighIntent', () => {
  it('returns false for empty conversation', () => {
    expect(isHighIntent([])).toBe(false);
  });

  it('returns false for 2 product mentions (below threshold)', () => {
    const history: ChatMessage[] = [
      { role: 'user', content: 'Tell me about demand iq' },
      { role: 'assistant', content: 'Sure...' },
      { role: 'user', content: 'What about care predict?' },
    ];
    expect(isHighIntent(history)).toBe(false);
  });

  it('returns true for 3+ product mentions', () => {
    const history: ChatMessage[] = [
      { role: 'user', content: 'Tell me about demand iq' },
      { role: 'assistant', content: 'Sure...' },
      { role: 'user', content: 'What about care predict?' },
      { role: 'assistant', content: 'Of course...' },
      { role: 'user', content: 'And route ai?' },
    ];
    expect(isHighIntent(history)).toBe(true);
  });

  it('returns true for single pricing inquiry (high intent)', () => {
    const history: ChatMessage[] = [
      { role: 'user', content: 'How much does it cost?' },
    ];
    expect(isHighIntent(history)).toBe(true);
  });

  it('returns true for single demo request', () => {
    const history: ChatMessage[] = [
      { role: 'user', content: 'Can I schedule a demo?' },
    ];
    expect(isHighIntent(history)).toBe(true);
  });

  it('ignores assistant messages', () => {
    const history: ChatMessage[] = [
      { role: 'assistant', content: 'Our pricing starts at...' },
      { role: 'assistant', content: 'Schedule a demo at...' },
    ];
    expect(isHighIntent(history)).toBe(false);
  });
});

describe('extractProductInterests', () => {
  it('returns empty array for no product mentions', () => {
    const history: ChatMessage[] = [
      { role: 'user', content: 'Hello' },
    ];
    expect(extractProductInterests(history)).toEqual([]);
  });

  it('extracts single product interest', () => {
    const history: ChatMessage[] = [
      { role: 'user', content: 'Tell me about demand iq' },
    ];
    expect(extractProductInterests(history)).toContain('ndn-001');
  });

  it('extracts multiple product interests', () => {
    const history: ChatMessage[] = [
      { role: 'user', content: 'Compare demand iq and care predict' },
      { role: 'assistant', content: 'Sure...' },
      { role: 'user', content: 'Also interested in paystream' },
    ];
    const products = extractProductInterests(history);
    expect(products).toContain('ndn-001');
    expect(products).toContain('ndn-002');
    expect(products).toContain('ndn-006');
  });

  it('deduplicates product mentions', () => {
    const history: ChatMessage[] = [
      { role: 'user', content: 'Tell me about demand iq' },
      { role: 'user', content: 'More about demand forecasting' }, // same product
    ];
    const products = extractProductInterests(history);
    const ndn001Count = products.filter(p => p === 'ndn-001').length;
    expect(ndn001Count).toBe(1);
  });

  it('ignores assistant messages', () => {
    const history: ChatMessage[] = [
      { role: 'assistant', content: 'Demand IQ is great for retail' },
    ];
    expect(extractProductInterests(history)).toEqual([]);
  });
});
