// AI product types for affiliate tracking
import type { Timestamp } from 'firebase/firestore';

export type AffiliateProgram =
  | 'anthropic'
  | 'openai'
  | 'vercel'
  | 'supabase'
  | 'retool'
  | 'notion'
  | 'linear'
  | 'impact'
  | 'partnerstack'
  | 'direct'
  | 'none';

export type AIProductCategory =
  | 'llm_api'
  | 'dev_tools'
  | 'productivity'
  | 'design'
  | 'analytics'
  | 'automation'
  | 'database'
  | 'infrastructure';

export type ProductPricing = 'free' | 'freemium' | 'paid' | 'enterprise';

export interface AIProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logoUrl: string;
  websiteUrl: string;

  // Affiliate configuration
  affiliateUrl?: string;
  affiliateProgramUrl?: string;  // Sign-up page for affiliate program
  affiliateProgram: AffiliateProgram;
  commissionRate?: string;
  cookieDuration?: number;

  // NDN Analytics service tie-in
  ndnServiceTieIn?: string;  // CTA connecting product to NDN services

  // Categorization
  category: AIProductCategory;
  tags: string[];
  pricing: ProductPricing;

  // Display
  featured: boolean;
  sortOrder: number;
  badge?: string;

  // Metrics
  clickCount: number;

  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Category display labels
export const CATEGORY_LABELS: Record<AIProductCategory, string> = {
  llm_api: 'LLM APIs',
  dev_tools: 'Developer Tools',
  productivity: 'Productivity',
  design: 'Design',
  analytics: 'Analytics',
  automation: 'Automation',
  database: 'Database',
  infrastructure: 'Infrastructure',
};

// Affiliate program display names
export const AFFILIATE_PROGRAM_LABELS: Record<AffiliateProgram, string> = {
  anthropic: 'Anthropic Partner',
  openai: 'OpenAI Affiliate',
  vercel: 'Vercel Partner',
  supabase: 'Supabase Affiliate',
  retool: 'Retool Partner',
  notion: 'Notion Affiliate',
  linear: 'Linear Partner',
  impact: 'Impact Radius',
  partnerstack: 'PartnerStack',
  direct: 'Direct Partnership',
  none: 'No Affiliate',
};
