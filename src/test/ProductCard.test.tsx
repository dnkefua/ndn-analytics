import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import type { Product } from '../types';

const mockProduct: Product = {
  id: 'ndn-099',
  number: 'NDN—099',
  name: 'Test Product',
  description: 'A test product for unit testing purposes.',
  tagline: 'Testing made easy.',
  features: ['Feature Alpha', 'Feature Beta', 'Feature Gamma'],
  badge: 'Test Badge',
  stack: 'gcloud',
  icon: '◎',
};

function renderCard(product: Product = mockProduct) {
  return render(
    <MemoryRouter>
      <ProductCard product={product} />
    </MemoryRouter>
  );
}

describe('ProductCard', () => {
  it('renders product name', () => {
    renderCard();
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('renders product number', () => {
    renderCard();
    expect(screen.getByText('NDN—099')).toBeInTheDocument();
  });

  it('renders product description', () => {
    renderCard();
    expect(screen.getByText('A test product for unit testing purposes.')).toBeInTheDocument();
  });

  it('renders product badge', () => {
    renderCard();
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('renders product icon', () => {
    renderCard();
    expect(screen.getByText('◎')).toBeInTheDocument();
  });

  it('renders all features', () => {
    renderCard();
    expect(screen.getByText('Feature Alpha')).toBeInTheDocument();
    expect(screen.getByText('Feature Beta')).toBeInTheDocument();
    expect(screen.getByText('Feature Gamma')).toBeInTheDocument();
  });

  it('renders "Learn More" link pointing to product page', () => {
    renderCard();
    const link = screen.getByRole('link', { name: /learn more/i });
    expect(link).toHaveAttribute('href', '/products/ndn-099');
  });

  it('applies gcloud accent color', () => {
    const { container } = renderCard();
    const card = container.querySelector('.product-card') as HTMLElement;
    expect(card.style.getPropertyValue('--accent')).toBe('var(--brand-cyan)');
  });

  it('applies ethereum accent color', () => {
    const ethProduct: Product = { ...mockProduct, stack: 'ethereum' };
    const { container } = renderCard(ethProduct);
    const card = container.querySelector('.product-card') as HTMLElement;
    expect(card.style.getPropertyValue('--accent')).toBe('var(--brand-blue)');
  });

  it('applies new accent color', () => {
    const newProduct: Product = { ...mockProduct, stack: 'new' };
    const { container } = renderCard(newProduct);
    const card = container.querySelector('.product-card') as HTMLElement;
    expect(card.style.getPropertyValue('--accent')).toBe('var(--brand-gold)');
  });

  it('renders correct number of feature list items', () => {
    renderCard();
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
  });
});
