import { test, expect } from '@playwright/test';

test.describe('Visual regression', () => {
  test('homepage above-the-fold', async ({ page }) => {
    await page.goto('/');
    // Wait for hero counters to finish animating
    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot('homepage-hero.png', {
      fullPage: false,
    });
  });

  test('products page grid', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('products-grid.png', {
      fullPage: false,
    });
  });

  test('contact page form', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('contact-form.png', {
      fullPage: false,
    });
  });

  test('blog page', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('domcontentloaded');
    // Allow rendering to settle (blog fetches from Firestore, networkidle may never fire)
    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot('blog-listing.png', {
      fullPage: false,
    });
  });

  test('mobile homepage viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: false,
    });
  });
});
