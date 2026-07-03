// Affiliate click tracking types
import type { Timestamp } from 'firebase/firestore';

export interface UTMParams {
  source: string;
  medium: string;
  campaign: string;
  content?: string;
  term?: string;
}

export interface AffiliateClick {
  id: string;
  productId: string;
  productName: string;
  clickedAt: Timestamp;
  sessionId: string;
  leadId?: string;
  referrerPath: string;
  utmParams: UTMParams;
  userAgent: string;
  destinationUrl: string;
}

// News source types for RSS aggregation
export type NewsCategory = 'ai' | 'blockchain' | 'enterprise' | 'tech';
export type FeedType = 'rss' | 'atom' | 'json';

export interface NewsSource {
  id: string;
  name: string;
  feedUrl: string;
  feedType: FeedType;
  category: NewsCategory;
  priority: number;
  isActive: boolean;
  lastFetchedAt?: Timestamp;
  fetchIntervalMinutes: number;
  maxArticlesPerFetch: number;
}

export interface ProcessedArticle {
  id: string;
  sourceId: string;
  sourceName: string;
  originalUrl: string;
  originalTitle: string;
  originalExcerpt?: string;
  fetchedAt: Timestamp;
  processedAt?: Timestamp;
  blogPostId?: string;
  skipped: boolean;
  skipReason?: string;
}

// Default UTM configuration
export const DEFAULT_UTM: Partial<UTMParams> = {
  source: 'ndnanalytics',
  medium: 'affiliate',
};

// Build UTM query string
export function buildUTMQueryString(params: UTMParams): string {
  const searchParams = new URLSearchParams();
  searchParams.set('utm_source', params.source);
  searchParams.set('utm_medium', params.medium);
  searchParams.set('utm_campaign', params.campaign);
  if (params.content) searchParams.set('utm_content', params.content);
  if (params.term) searchParams.set('utm_term', params.term);
  return searchParams.toString();
}
