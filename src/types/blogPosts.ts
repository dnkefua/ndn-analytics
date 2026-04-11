// Dynamic blog post types for Firestore storage
import type { Timestamp } from 'firebase/firestore';

export type BlogPostStatus = 'draft' | 'published' | 'archived';
export type BlogPostSource = 'manual' | 'ai_generated' | 'curated';
export type BlogCategory = 'AI' | 'Blockchain' | 'Industry' | 'Product' | 'Tools';

export interface DynamicBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: Timestamp;
  publishedAt?: Timestamp;
  author: string;
  category: BlogCategory;
  readTime: string;
  image?: string;
  relatedProducts?: string[];
  contentUpgrade?: {
    title: string;
    description: string;
    downloadId: string;
  };

  // AI generation metadata
  source: BlogPostSource;
  sourceUrl?: string;
  sourceTitle?: string;
  generationModel?: string;
  ndnServiceCTA?: string;  // NDN Analytics service tie-in CTA

  // SEO & analytics
  tags: string[];
  metaDescription?: string;
  status: BlogPostStatus;
  viewCount: number;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Unified blog post type for frontend (compatible with static blogData.ts)
export interface UnifiedBlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: BlogCategory;
  readTime: string;
  image?: string;
  relatedProducts?: string[];
  contentUpgrade?: {
    title: string;
    description: string;
    downloadId: string;
  };

  // Additional fields for dynamic posts
  id?: string;
  source?: BlogPostSource;
  sourceUrl?: string;
  tags?: string[];
  viewCount?: number;
  ndnServiceCTA?: string;  // NDN Analytics service tie-in CTA
}
