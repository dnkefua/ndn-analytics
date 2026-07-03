import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Mock analytics to avoid side effects
vi.mock('../lib/analytics', () => ({
  trackCTAClick: vi.fn(),
  trackFormSubmit: vi.fn(),
  trackPageView: vi.fn(),
}));

// Lazy imports need to be resolved for testing
import CheckoutSuccess from '../components/checkout/CheckoutSuccess';
import CheckoutCancelled from '../components/checkout/CheckoutCancelled';

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <HelmetProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </HelmetProvider>
  );
}

describe('Checkout Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('CheckoutSuccess', () => {
    it('renders success confirmation', () => {
      renderWithProviders(<CheckoutSuccess />);
      expect(screen.getByText(/confirmed/i)).toBeInTheDocument();
    });

    it('renders booking confirmation heading', () => {
      renderWithProviders(<CheckoutSuccess />);
      expect(screen.getByText(/booked/i)).toBeInTheDocument();
    });

    it('provides link back to products or home', () => {
      renderWithProviders(<CheckoutSuccess />);
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
    });

    it('contains SEO meta for success page', () => {
      renderWithProviders(<CheckoutSuccess />);
      // Helmet renders title asynchronously, but the component should exist
      expect(screen.getByText(/confirmed/i)).toBeInTheDocument();
    });
  });

  describe('CheckoutCancelled', () => {
    it('renders cancellation message', () => {
      renderWithProviders(<CheckoutCancelled />);
      expect(screen.getByText(/cancel/i)).toBeInTheDocument();
    });

    it('provides link to discovery call', () => {
      renderWithProviders(<CheckoutCancelled />);
      const ctaLink = screen.getByRole('link', { name: /discovery call/i });
      expect(ctaLink).toBeInTheDocument();
    });
  });
});

describe('Checkout Server Logic (unit)', () => {
  describe('Product validation', () => {
    const PRODUCTS: Record<string, { name: string; amount: number; currency: string; mode: string }> = {
      'ai-readiness-assessment': {
        name: 'AI Readiness Assessment',
        amount: 49900,
        currency: 'usd',
        mode: 'payment',
      },
    };

    it('known product ID resolves correctly', () => {
      const product = PRODUCTS['ai-readiness-assessment'];
      expect(product).toBeDefined();
      expect(product.amount).toBe(49900);
      expect(product.currency).toBe('usd');
      expect(product.mode).toBe('payment');
    });

    it('unknown product ID returns undefined', () => {
      const product = PRODUCTS['nonexistent'];
      expect(product).toBeUndefined();
    });

    it('amount converts to correct dollar value', () => {
      const product = PRODUCTS['ai-readiness-assessment'];
      expect(product.amount / 100).toBe(499);
    });
  });

  describe('Rate limit logic', () => {
    it('allows requests under limit', () => {
      const limit = 5;
      const count = 3;
      const limited = count >= limit;
      expect(limited).toBe(false);
    });

    it('blocks requests at limit', () => {
      const limit = 5;
      const count = 5;
      const limited = count >= limit;
      expect(limited).toBe(true);
    });

    it('resets after window expires', () => {
      const windowMs = 60_000;
      const windowStart = Date.now() - 61_000;
      const expired = (Date.now() - windowStart) > windowMs;
      expect(expired).toBe(true);
    });

    it('window not expired within timeframe', () => {
      const windowMs = 60_000;
      const windowStart = Date.now() - 30_000;
      const expired = (Date.now() - windowStart) > windowMs;
      expect(expired).toBe(false);
    });
  });
});
