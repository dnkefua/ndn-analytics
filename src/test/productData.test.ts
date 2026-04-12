import { describe, it, expect } from 'vitest';
import { PRODUCTS } from '../components/products/productData';

describe('productData integrity', () => {
  it('contains at least 10 products', () => {
    expect(PRODUCTS.length).toBeGreaterThanOrEqual(10);
  });

  it('has unique IDs across all products', () => {
    const ids = PRODUCTS.map(p => p.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('has unique names across all products', () => {
    const names = PRODUCTS.map(p => p.name);
    const unique = new Set(names);
    expect(unique.size).toBe(names.length);
  });

  describe.each(
    PRODUCTS.map(p => [p.id, p] as const)
  )('product %s', (_id, product) => {
    it('has a non-empty id', () => {
      expect(product.id).toBeTruthy();
    });

    it('has a non-empty name', () => {
      expect(product.name).toBeTruthy();
    });

    it('has a non-empty description', () => {
      expect(product.description).toBeTruthy();
      expect(product.description.length).toBeGreaterThan(10);
    });

    it('has a valid stack type', () => {
      expect(['gcloud', 'ethereum', 'new']).toContain(product.stack);
    });

    it('has at least 1 feature', () => {
      expect(product.features.length).toBeGreaterThanOrEqual(1);
    });

    it('has no empty feature strings', () => {
      product.features.forEach(f => {
        expect(f.trim().length).toBeGreaterThan(0);
      });
    });

    it('has a badge', () => {
      expect(product.badge).toBeTruthy();
    });

    it('has an icon', () => {
      expect(product.icon).toBeTruthy();
    });

    it('has a product number', () => {
      expect(product.number).toBeTruthy();
    });
  });

  it('IDs follow ndn-XXX pattern', () => {
    PRODUCTS.forEach(p => {
      expect(p.id).toMatch(/^ndn-\d{3}$/);
    });
  });

  it('all products have useCases array when defined', () => {
    PRODUCTS.forEach(p => {
      if (p.useCases) {
        expect(Array.isArray(p.useCases)).toBe(true);
        expect(p.useCases.length).toBeGreaterThan(0);
      }
    });
  });

  it('all products have metrics array when defined', () => {
    PRODUCTS.forEach(p => {
      if (p.metrics) {
        expect(Array.isArray(p.metrics)).toBe(true);
        expect(p.metrics.length).toBeGreaterThan(0);
      }
    });
  });
});
