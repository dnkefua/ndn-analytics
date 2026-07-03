// AI Products service - fetch products and track affiliate clicks
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseEnabled } from './firebase';
import { getSessionId } from './leads';
import type { AIProduct, AIProductCategory } from '../types/aiProducts';
import type { UTMParams } from '../types/affiliateClicks';

const AI_PRODUCTS_COLLECTION = 'aiProducts';
const AFFILIATE_CLICKS_COLLECTION = 'affiliateClicks';

/**
 * Fetch all active AI products
 */
export async function fetchAIProducts(): Promise<AIProduct[]> {
  if (!db || !isFirebaseEnabled()) {
    return [];
  }

  try {
    const q = query(
      collection(db, AI_PRODUCTS_COLLECTION),
      where('isActive', '==', true),
      orderBy('sortOrder', 'asc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as AIProduct[];
  } catch (error) {
    console.error('Failed to fetch AI products:', error);
    return [];
  }
}

/**
 * Fetch featured AI products
 */
export async function fetchFeaturedProducts(): Promise<AIProduct[]> {
  if (!db || !isFirebaseEnabled()) {
    return [];
  }

  try {
    const q = query(
      collection(db, AI_PRODUCTS_COLLECTION),
      where('isActive', '==', true),
      where('featured', '==', true),
      orderBy('sortOrder', 'asc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as AIProduct[];
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
    return [];
  }
}

/**
 * Fetch products by category
 */
export async function fetchProductsByCategory(category: AIProductCategory): Promise<AIProduct[]> {
  if (!db || !isFirebaseEnabled()) {
    return [];
  }

  try {
    const q = query(
      collection(db, AI_PRODUCTS_COLLECTION),
      where('isActive', '==', true),
      where('category', '==', category),
      orderBy('sortOrder', 'asc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as AIProduct[];
  } catch (error) {
    console.error('Failed to fetch products by category:', error);
    return [];
  }
}

/**
 * Get a single product by ID
 */
export async function getProductById(productId: string): Promise<AIProduct | null> {
  if (!db || !isFirebaseEnabled()) {
    return null;
  }

  try {
    const docRef = doc(db, AI_PRODUCTS_COLLECTION, productId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return { id: docSnap.id, ...docSnap.data() } as AIProduct;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

/**
 * Build a tracked affiliate link
 */
export function buildTrackedLink(
  product: AIProduct,
  campaign: string = 'aitools',
  additionalParams?: Partial<UTMParams>
): string {
  const sessionId = getSessionId();
  const baseUrl = `/go/${product.id}`;

  const params = new URLSearchParams();
  params.set('sid', sessionId);
  params.set('campaign', campaign);

  if (additionalParams?.term) {
    params.set('utm_term', additionalParams.term);
  }

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Build a direct link with UTM parameters (for static/fallback use)
 */
export function buildDirectLink(
  product: AIProduct,
  campaign: string = 'aitools'
): string {
  const url = new URL(product.affiliateUrl || product.websiteUrl);

  url.searchParams.set('utm_source', 'ndnanalytics');
  url.searchParams.set('utm_medium', 'affiliate');
  url.searchParams.set('utm_campaign', campaign);
  url.searchParams.set('utm_content', product.id);

  return url.toString();
}

/**
 * Track an affiliate click (client-side logging)
 */
export async function trackAffiliateClick(
  product: AIProduct,
  referrerPath: string,
  campaign: string = 'aitools'
): Promise<void> {
  if (!db || !isFirebaseEnabled()) {
    return;
  }

  const sessionId = getSessionId();

  try {
    // Log click
    await addDoc(collection(db, AFFILIATE_CLICKS_COLLECTION), {
      productId: product.id,
      productName: product.name,
      clickedAt: serverTimestamp(),
      sessionId,
      referrerPath,
      utmParams: {
        source: 'ndnanalytics',
        medium: 'affiliate',
        campaign,
        content: product.id,
      },
      userAgent: navigator.userAgent,
      destinationUrl: product.affiliateUrl || product.websiteUrl,
    });

    // Increment click count
    const productRef = doc(db, AI_PRODUCTS_COLLECTION, product.id);
    await updateDoc(productRef, {
      clickCount: increment(1),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Failed to track affiliate click:', error);
  }
}

/**
 * Get click statistics for a product
 */
export async function getProductClickCount(productId: string): Promise<number> {
  const product = await getProductById(productId);
  return product?.clickCount ?? 0;
}
