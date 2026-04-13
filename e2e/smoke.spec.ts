import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('renders hero with correct heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Build Smarter');
  });

  test('skip-to-content link is focusable', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skipLink = page.locator('a.skip-link');
    await expect(skipLink).toBeFocused();
  });

  test('hero counters animate to target values', async ({ page }) => {
    await page.goto('/');
    // Wait for counter animation (1400ms + buffer)
    await page.waitForTimeout(2000);
    const stats = page.locator('.hero-stat-value');
    const firstStat = await stats.first().textContent();
    expect(firstStat).toContain('99.9');
  });

  test('navigation links are visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.getByRole('link', { name: /products/i }).first()).toBeVisible();
  });

  test('featured products section renders three cards', async ({ page }) => {
    await page.goto('/');
    const productCards = page.locator('a[href*="/products/ndn-"]');
    await expect(productCards).toHaveCount(3);
  });
});

test.describe('Navigation', () => {
  test('products page loads', async ({ page }) => {
    await page.goto('/products');
    await expect(page).toHaveTitle(/Products/i);
  });

  test('contact page loads', async ({ page }) => {
    await page.goto('/contact');
    await expect(page).toHaveTitle(/Contact/i);
  });

  test('blog page loads', async ({ page }) => {
    await page.goto('/blog');
    await expect(page).toHaveTitle(/Blog/i);
  });

  test('404 page for unknown routes', async ({ page }) => {
    await page.goto('/this-does-not-exist');
    await expect(page.locator('body')).toContainText(/not found|404/i);
  });
});

test.describe('SEO', () => {
  test('homepage has correct meta tags', async ({ page }) => {
    await page.goto('/');
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', /.+/);
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /.+/);
  });

  test('canonical URL is set', async ({ page }) => {
    await page.goto('/');
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /.+/);
  });
});

test.describe('Accessibility', () => {
  test('main landmark exists', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main#main-content')).toBeVisible();
  });

  test('images have alt text', async ({ page }) => {
    await page.goto('/');
    const images = page.locator('img:visible');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      const ariaHidden = await images.nth(i).getAttribute('aria-hidden');
      const decorative = ariaHidden === 'true' || (await images.nth(i).getAttribute('role')) === 'presentation';
      if (!decorative) {
        expect(alt, `Image ${i} missing alt text`).toBeTruthy();
      }
    }
  });
});
