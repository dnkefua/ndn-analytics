// Lead capture types for autonomous revenue generation
import type { Timestamp } from 'firebase/firestore';

export type LeadSource =
  | 'newsletter_footer'
  | 'newsletter_blog'
  | 'content_upgrade'
  | 'aria_chat'
  | 'contact_form'
  | 'exit_intent'
  | 'fine_tuning_teaser';

export type LeadStatus = 'new' | 'nurturing' | 'qualified' | 'contacted' | 'customer';

export interface Lead {
  id: string;
  email: string;
  name?: string;
  company?: string;
  productInterests: string[];
  source: LeadSource;
  score: number;
  status: LeadStatus;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type EngagementType =
  | 'page_view'
  | 'blog_read'
  | 'product_view'
  | 'content_download'
  | 'aria_conversation'
  | 'form_submit'
  | 'cta_click';

export interface Engagement {
  id: string;
  type: EngagementType;
  timestamp: Timestamp;
  metadata: Record<string, unknown>;
}

export interface AriaConversation {
  id: string;
  leadId?: string;
  sessionId: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  intentSignals: IntentSignal[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface IntentSignal {
  type: 'product_interest' | 'pricing_inquiry' | 'demo_request' | 'timeline_mention';
  productId?: string;
  confidence: number;
  extractedAt: Timestamp;
}

// Score weights for lead scoring
export const SCORE_WEIGHTS = {
  // Source scores
  contact_form: 25,
  aria_chat: 20,
  content_upgrade: 15,
  newsletter_footer: 10,
  newsletter_blog: 10,
  exit_intent: 5,

  // Engagement scores
  page_view: 1,
  blog_read: 2,
  product_view: 5,
  content_download: 8,
  aria_conversation: 3,
  form_submit: 10,
  cta_click: 3,

  // Intent signals from ARIA
  demo_request: 30,
  pricing_inquiry: 20,
  timeline_mention: 15,
  product_interest: 10,
} as const;

// Score thresholds
export const SCORE_THRESHOLDS = {
  cold: 20,      // 0-20: Newsletter nurture
  warm: 50,      // 21-50: Targeted content
  hot: 80,       // 51-80: Sales outreach
  qualified: 81, // 81+: Immediate notification
} as const;
