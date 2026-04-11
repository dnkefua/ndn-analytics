export function initAnalytics() {
  const id = import.meta.env.VITE_GA_ID as string | undefined;
  if (!id) {
    return;
  }
  if (typeof window === 'undefined') return;
  if (typeof window.gtag === 'function') return;
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) { (window.dataLayer as unknown[]).push(args); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', id, { send_page_view: false });
}

export function debugAnalytics() {
  const id = import.meta.env.VITE_GA_ID as string | undefined;
  if (!id) {
    console.info('[Analytics] VITE_GA_ID not set. Analytics disabled.');
    return;
  }
  const ready = typeof window !== 'undefined' && typeof window.gtag === 'function';
  console.info(`[Analytics] Initialized with ID ${id}. window.gtag present: ${ready}`);
}

export function trackEvent(
  action: string,
  params?: Record<string, unknown>
) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', action, params);
  }
}

export function trackPageView(path: string) {
  trackEvent('page_view', { page_path: path });
}

export function trackFormSubmit(formName: string) {
  trackEvent('form_submit', { form_name: formName });
}

export function trackCTAClick(buttonName: string, location: string) {
  trackEvent('cta_click', { button_name: buttonName, location });
}

export function trackDemoBooking(source: string) {
  trackEvent('demo_booking', { source });
}

export function trackProductView(productId: string) {
  trackEvent('product_view', { product_id: productId });
}

export function trackBlogRead(slug: string) {
  trackEvent('blog_read', { article_slug: slug });
}
