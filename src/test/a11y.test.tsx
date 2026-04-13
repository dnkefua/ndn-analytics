import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, type AxeMatchers } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ProductCard from '../components/products/ProductCard';
import type { Product } from '../types';

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Assertion extends AxeMatchers {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}

expect.extend(matchers);

const mockProduct: Product = {
  id: 'ndn-099',
  number: 'NDN—099',
  name: 'Test Product',
  description: 'A test product for accessibility testing.',
  tagline: 'Accessible by default.',
  features: ['Feature A', 'Feature B'],
  badge: 'GCP',
  stack: 'gcloud',
  icon: '◎',
};

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <HelmetProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </HelmetProvider>
  );
}

describe('Accessibility (axe)', () => {
  it('ProductCard has no a11y violations', async () => {
    const { container } = renderWithProviders(
      <ProductCard product={mockProduct} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
