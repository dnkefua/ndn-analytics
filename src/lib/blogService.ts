// Blog service - combines static and dynamic blog posts
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  increment,
  limit,
} from 'firebase/firestore';
import { db, isFirebaseEnabled } from './firebase';
import { BLOG_POSTS as STATIC_POSTS } from '../components/blog/blogData';
import type { UnifiedBlogPost, DynamicBlogPost } from '../types/blogPosts';

const BLOG_POSTS_COLLECTION = 'blogPosts';

/**
 * Convert Firestore DynamicBlogPost to UnifiedBlogPost
 */
function convertToUnified(doc: DynamicBlogPost): UnifiedBlogPost {
  return {
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt,
    content: doc.content,
    date: doc.date?.toDate?.()?.toISOString?.() || new Date().toISOString(),
    author: doc.author,
    category: doc.category,
    readTime: doc.readTime,
    image: doc.image,
    video: doc.video,
    relatedProducts: doc.relatedProducts,
    contentUpgrade: doc.contentUpgrade,
    id: doc.id,
    source: doc.source,
    sourceUrl: doc.sourceUrl,
    tags: doc.tags,
    viewCount: doc.viewCount,
    ndnServiceCTA: doc.ndnServiceCTA,
  };
}

/**
 * Fetch all published blog posts from Firestore
 */
async function fetchDynamicPosts(maxPosts = 50): Promise<UnifiedBlogPost[]> {
  if (!db || !isFirebaseEnabled()) {
    return [];
  }

  try {
    const q = query(
      collection(db, BLOG_POSTS_COLLECTION),
      where('status', '==', 'published'),
      orderBy('date', 'desc'),
      limit(maxPosts)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(docSnap => {
      const data = docSnap.data() as Omit<DynamicBlogPost, 'id'>;
      return convertToUnified({ id: docSnap.id, ...data } as DynamicBlogPost);
    });
  } catch (error) {
    console.error('Failed to fetch dynamic posts:', error);
    return [];
  }
}

/**
 * Get all blog posts (static + dynamic, sorted by date)
 */
export async function getAllBlogPosts(): Promise<UnifiedBlogPost[]> {
  // Get static posts
  const staticPosts: UnifiedBlogPost[] = STATIC_POSTS.map(post => ({
    ...post,
    source: 'manual' as const,
  }));

  // Get dynamic posts from Firestore
  const dynamicPosts = await fetchDynamicPosts();

  // Merge and sort by date (newest first)
  const allPosts = [...staticPosts, ...dynamicPosts];
  allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return allPosts;
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<UnifiedBlogPost | null> {
  // Check static posts first
  const staticPost = STATIC_POSTS.find(p => p.slug === slug);
  if (staticPost) {
    return { ...staticPost, source: 'manual' as const };
  }

  // Check dynamic posts in Firestore
  if (!db || !isFirebaseEnabled()) {
    return null;
  }

  try {
    const q = query(
      collection(db, BLOG_POSTS_COLLECTION),
      where('slug', '==', slug),
      where('status', '==', 'published'),
      limit(1)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const docSnap = snapshot.docs[0];
    const data = docSnap.data() as Omit<DynamicBlogPost, 'id'>;

    // Increment view count asynchronously
    incrementViewCount(docSnap.id);

    return convertToUnified({ id: docSnap.id, ...data } as DynamicBlogPost);
  } catch (error) {
    console.error('Failed to fetch post by slug:', error);
    return null;
  }
}

/**
 * Increment view count for a dynamic post
 */
async function incrementViewCount(postId: string): Promise<void> {
  if (!db) return;

  try {
    const postRef = doc(db, BLOG_POSTS_COLLECTION, postId);
    await updateDoc(postRef, {
      viewCount: increment(1),
    });
  } catch (error) {
    console.error('Failed to increment view count:', error);
  }
}

/**
 * Get posts by category
 */
export async function getBlogPostsByCategory(category: string): Promise<UnifiedBlogPost[]> {
  const allPosts = await getAllBlogPosts();
  return allPosts.filter(p => p.category.toLowerCase() === category.toLowerCase());
}

/**
 * Get posts by tag
 */
export async function getBlogPostsByTag(tag: string): Promise<UnifiedBlogPost[]> {
  const allPosts = await getAllBlogPosts();
  return allPosts.filter(p => p.tags?.includes(tag));
}
