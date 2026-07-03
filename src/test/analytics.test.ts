import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  trackEvent,
  trackPageView,
  trackFormSubmit,
  trackCTAClick,
  trackDemoBooking,
  trackProductView,
  trackBlogRead,
} from '../lib/analytics';

describe('analytics', () => {
  let gtagSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    gtagSpy = vi.fn();
    // @ts-expect-error — assigning mock to window.gtag
    window.gtag = gtagSpy;
  });

  describe('trackEvent', () => {
    it('calls gtag with event action and params', () => {
      trackEvent('test_action', { key: 'value' });
      expect(gtagSpy).toHaveBeenCalledWith('event', 'test_action', { key: 'value' });
    });

    it('calls gtag with action only when no params', () => {
      trackEvent('simple_action');
      expect(gtagSpy).toHaveBeenCalledWith('event', 'simple_action', undefined);
    });

    it('does not throw when gtag is undefined', () => {
      // @ts-expect-error — removing window.gtag
      delete window.gtag;
      expect(() => trackEvent('orphan_event')).not.toThrow();
    });
  });

  describe('trackPageView', () => {
    it('sends page_view event with correct path', () => {
      trackPageView('/products/ndn-001');
      expect(gtagSpy).toHaveBeenCalledWith('event', 'page_view', { page_path: '/products/ndn-001' });
    });
  });

  describe('trackFormSubmit', () => {
    it('sends form_submit event with form name', () => {
      trackFormSubmit('contact');
      expect(gtagSpy).toHaveBeenCalledWith('event', 'form_submit', { form_name: 'contact' });
    });
  });

  describe('trackCTAClick', () => {
    it('sends cta_click with button name and location', () => {
      trackCTAClick('Book Demo', 'hero');
      expect(gtagSpy).toHaveBeenCalledWith('event', 'cta_click', {
        button_name: 'Book Demo',
        location: 'hero',
      });
    });
  });

  describe('trackDemoBooking', () => {
    it('sends demo_booking with source', () => {
      trackDemoBooking('pricing_page');
      expect(gtagSpy).toHaveBeenCalledWith('event', 'demo_booking', { source: 'pricing_page' });
    });
  });

  describe('trackProductView', () => {
    it('sends product_view with product id', () => {
      trackProductView('ndn-006');
      expect(gtagSpy).toHaveBeenCalledWith('event', 'product_view', { product_id: 'ndn-006' });
    });
  });

  describe('trackBlogRead', () => {
    it('sends blog_read with article slug', () => {
      trackBlogRead('ai-in-healthcare');
      expect(gtagSpy).toHaveBeenCalledWith('event', 'blog_read', { article_slug: 'ai-in-healthcare' });
    });
  });
});
