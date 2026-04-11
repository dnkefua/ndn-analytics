// Engagement tracking hook for automatic page and product view tracking
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackAnonymousEngagement, addEngagement, isFirebaseEnabled } from './leads';
import type { EngagementType } from '../types/leads';

// Global storage for current lead ID (set after email capture)
let currentLeadId: string | null = null;

export function setCurrentLeadId(leadId: string | null) {
  currentLeadId = leadId;
}

export function getCurrentLeadId(): string | null {
  return currentLeadId;
}

// Track an engagement (attributed if lead exists, anonymous otherwise)
export async function trackEngagement(
  type: EngagementType,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  if (!isFirebaseEnabled()) return;

  if (currentLeadId) {
    await addEngagement(currentLeadId, type, metadata);
  } else {
    await trackAnonymousEngagement(type, metadata);
  }
}

// Hook for automatic page view tracking
export function usePageTracking() {
  const location = useLocation();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    // Avoid duplicate tracking on same path
    if (location.pathname === lastPath.current) return;
    lastPath.current = location.pathname;

    const metadata: Record<string, unknown> = {
      path: location.pathname,
      referrer: document.referrer || undefined,
      timestamp: Date.now(),
    };

    // Determine engagement type based on path
    if (location.pathname.startsWith('/products/')) {
      const productId = location.pathname.split('/products/')[1];
      trackEngagement('product_view', { ...metadata, productId });
    } else if (location.pathname.startsWith('/blog/') && location.pathname !== '/blog') {
      const slug = location.pathname.split('/blog/')[1];
      trackEngagement('blog_read', { ...metadata, slug });
    } else {
      trackEngagement('page_view', metadata);
    }
  }, [location.pathname]);
}

// Track CTA clicks
export function trackCtaClick(ctaId: string, destination?: string) {
  trackEngagement('cta_click', {
    ctaId,
    destination,
    timestamp: Date.now(),
  });
}

// Track content downloads
export function trackContentDownload(downloadId: string, title?: string) {
  trackEngagement('content_download', {
    downloadId,
    title,
    timestamp: Date.now(),
  });
}

// Track form submissions
export function trackFormSubmission(formId: string, formType?: string) {
  trackEngagement('form_submit', {
    formId,
    formType,
    timestamp: Date.now(),
  });
}

// Get engagement summary from session storage
export function getSessionEngagements(): Array<{
  type: EngagementType;
  metadata: Record<string, unknown>;
  timestamp: number;
}> {
  const key = 'ndn_engagements';
  return JSON.parse(sessionStorage.getItem(key) || '[]');
}

// Count engagements by type
export function countEngagementsByType(): Record<string, number> {
  const engagements = getSessionEngagements();
  return engagements.reduce((acc, eng) => {
    acc[eng.type] = (acc[eng.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}
