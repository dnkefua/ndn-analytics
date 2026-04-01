export function trackEvent(
  action: string,
  params?: Record<string, unknown>
) {
  if (typeof gtag === 'function') {
    gtag('event', action, params);
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
