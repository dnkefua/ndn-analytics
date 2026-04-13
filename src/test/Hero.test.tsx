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

    expect(screen.getByText('Uptime SLA')).toBeInTheDocument();
    expect(screen.getByText('Blockchain Networks')).toBeInTheDocument();
    expect(screen.getByText('Hour Support')).toBeInTheDocument();
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

    expect(screen.getByText('NDN Demand IQ')).toBeInTheDocument();
    expect(screen.getByText('NDN TraceChain')).toBeInTheDocument();
    expect(screen.getByText('NDN PayStream')).toBeInTheDocument();
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

    expect(screen.getByText('45% Stockout Reduction')).toBeInTheDocument();
    expect(screen.getByText('100% FDA Compliance')).toBeInTheDocument();
  });

  it('renders testimonials', async () => {
    const { default: Hero } = await import('../components/hero/Hero');

    render(
      <HelmetProvider>
        <MemoryRouter>
          <Hero />
        </MemoryRouter>
      </HelmetProvider>
    );

    expect(screen.getByText(/Sarah Chen/)).toBeInTheDocument();
    expect(screen.getByText(/Dr. James Okafor/)).toBeInTheDocument();
    expect(screen.getByText(/Maria Rodriguez/)).toBeInTheDocument();
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

    expect(screen.getByText(/Explore Our Products/)).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });
});
