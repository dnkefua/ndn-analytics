import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import ArticleSchema from '../components/seo/ArticleSchema';
import ProductSchema from '../components/seo/ProductSchema';
import type { Product } from '../types';

function renderWithHelmet(ui: React.ReactElement) {
  return render(<HelmetProvider>{ui}</HelmetProvider>);
}

const mockProduct: Product = {
  id: 'ndn-001',
  number: 'NDN—001',
  name: 'NDN Demand IQ',
  description: 'Demand forecasting product',
  tagline: 'Predict demand before it happens.',
  features: ['Real-time demand sensing'],
  badge: 'GCP',
  stack: 'gcloud',
  icon: '◈',
};

describe('ArticleSchema', () => {
  it('renders valid JSON-LD script', () => {
    const { container } = renderWithHelmet(
      <ArticleSchema
        title="Test Article"
        excerpt="A test description"
        slug="test-article"
        author="NDN Analytics"
        datePublished="2026-01-01"
        category="AI"
      />
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeTruthy();
    if (script) {
      const data = JSON.parse(script.textContent || '');
      expect(data['@type']).toBe('Article');
      expect(data.headline).toBe('Test Article');
      expect(data.author.name).toBe('NDN Analytics');
    }
  });
});

describe('ProductSchema', () => {
  it('renders valid JSON-LD SoftwareApplication schema', () => {
    const { container } = renderWithHelmet(
      <ProductSchema product={mockProduct} />
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeTruthy();
    if (script) {
      const data = JSON.parse(script.textContent || '');
      expect(data['@type']).toBe('SoftwareApplication');
      expect(data.name).toBe('NDN Demand IQ');
    }
  });
});
