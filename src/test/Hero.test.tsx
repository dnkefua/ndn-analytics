import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Mock IntersectionObserver as a proper class
beforeEach(() => {
  class MockIntersectionObserver {
    callback: IntersectionObserverCallback;
    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback;
    }
    observe(target: Element) {
      // Immediately trigger as intersecting
      this.callback(
        [{ isIntersecting: true, target, boundingClientRect: { top: 0, bottom: 100 } }] as unknown as IntersectionObserverEntry[],
        this as unknown as IntersectionObserver
      );
    }
    disconnect() {}
    unobserve() {}
  }
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

  // Mock getBoundingClientRect so the eager check fires
  Element.prototype.getBoundingClientRect = vi.fn(() => ({
    top: 100, bottom: 200, left: 0, right: 100,
    width: 100, height: 100, x: 0, y: 100, toJSON: () => {},
  }));
});

describe('Hero integration', () => {
  it('renders stat labels', async () => {
    // Dynamic import to ensure mocks are in place
    const { default: Hero } = await import('../components/hero/Hero');

    render(
      <HelmetProvider>
        <MemoryRouter>
          <Hero />
        </MemoryRouter>
      </HelmetProvider>
    );

    expect(screen.getByText('Uptime Target')).toBeInTheDocument();
    expect(screen.getByText('Blockchain Networks')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
  });

  it('renders featured products section', async () => {
    const { default: Hero } = await import('../components/hero/Hero');

    render(
      <HelmetProvider>
        <MemoryRouter>
          <Hero />
        </MemoryRouter>
      </HelmetProvider>
    );

    // Use getAllByText since product names now appear in both featured section and FAQ
    expect(screen.getAllByText('NDN Demand IQ').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('NDN TraceChain').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('NDN PayStream').length).toBeGreaterThanOrEqual(1);
  });

  it('renders case study highlights', async () => {
    const { default: Hero } = await import('../components/hero/Hero');

    render(
      <HelmetProvider>
        <MemoryRouter>
          <Hero />
        </MemoryRouter>
      </HelmetProvider>
    );

    expect(screen.getByText('AI Demand Forecasting')).toBeInTheDocument();
    expect(screen.getByText('On-Chain Supply Chain Traceability')).toBeInTheDocument();
  });

  it('renders product spotlights section', async () => {
    const { default: Hero } = await import('../components/hero/Hero');

    render(
      <HelmetProvider>
        <MemoryRouter>
          <Hero />
        </MemoryRouter>
      </HelmetProvider>
    );

    expect(screen.getByText('Retail & supply chain intelligence')).toBeInTheDocument();
    expect(screen.getByText('Immutable provenance on Ethereum')).toBeInTheDocument();
  });

  it('renders CTA buttons', async () => {
    const { default: Hero } = await import('../components/hero/Hero');

    render(
      <HelmetProvider>
        <MemoryRouter>
          <Hero />
        </MemoryRouter>
      </HelmetProvider>
    );

    expect(screen.getByText(/Book a Discovery Call/)).toBeInTheDocument();
    expect(screen.getByText(/View Our Products/)).toBeInTheDocument();
  });
});
