import { useState, useEffect } from 'react';
import { fetchAIProducts } from '../../lib/aiProductsService';
import STATIC_PRODUCTS from '../../lib/aiProductsData';
import AIToolCard from './AIToolCard';
import SEO from '../seo/SEO';
import type { AIProduct, AIProductCategory } from '../../types/aiProducts';
import { CATEGORY_LABELS } from '../../types/aiProducts';

const CATEGORIES: AIProductCategory[] = [
  'llm_api',
  'dev_tools',
  'productivity',
  'design',
  'analytics',
  'automation',
  'database',
  'infrastructure',
];

export default function AIToolsSection() {
  // Initialise with static data so the page renders immediately (no loading flash)
  const [products, setProducts] = useState<AIProduct[]>(STATIC_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<AIProductCategory | 'all'>('all');

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      try {
        const liveProducts = await fetchAIProducts();
        // Only replace static data if Firestore returned actual products
        if (mounted && liveProducts.length > 0) {
          setProducts(liveProducts);
        }
      } catch (error) {
        // Static fallback remains displayed — no user-visible error
        console.warn('Firestore unavailable, using static product catalog:', error);
      }
    }

    loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const featuredProducts = products.filter(p => p.featured);

  return (
    <>
      <SEO
        title="AI Tools Directory"
        description="Curated directory of the best AI tools and platforms for enterprise. LLM APIs, developer tools, productivity apps, and more."
        keywords="AI tools, LLM API, developer tools, productivity AI, enterprise AI tools, machine learning platforms"
        canonicalPath="/ai-tools"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'AI Tools', path: '/ai-tools' },
        ]}
      />

      <section className="section" style={{ minHeight: '100vh', paddingTop: 120, paddingBottom: 80 }}>
        <div className="container">
          <div className="section-tag">Directory</div>
          <h1 className="section-title" style={{ marginBottom: 16 }}>
            AI Tools &<br />
            <span className="text-gradient">Platforms</span>
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            maxWidth: 600,
            marginBottom: 48,
            lineHeight: 1.7,
          }}>
            Curated directory of the best AI tools for enterprise. LLM APIs, developer platforms, productivity apps, and infrastructure.
          </p>

          {/* Category filters */}
          <div style={{
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            marginBottom: 40,
          }}>
            <button
              onClick={() => setSelectedCategory('all')}
              className="aria-chip"
              style={{
                background: selectedCategory === 'all' ? 'var(--brand-cyan)' : 'rgba(6,182,212,0.1)',
                color: selectedCategory === 'all' ? 'rgba(0,0,0,0.9)' : 'var(--text-secondary)',
                border: 'none',
                padding: '8px 16px',
                borderRadius: 20,
                cursor: 'pointer',
                fontFamily: "'JetBrains Mono Variable', monospace",
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
                transition: 'all 0.2s',
              }}
            >
              All
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="aria-chip"
                style={{
                  background: selectedCategory === cat ? 'var(--brand-cyan)' : 'rgba(6,182,212,0.1)',
                  color: selectedCategory === cat ? 'rgba(0,0,0,0.9)' : 'var(--text-secondary)',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: 20,
                  cursor: 'pointer',
                  fontFamily: "'JetBrains Mono Variable', monospace",
                  fontSize: '0.75rem',
                  letterSpacing: '0.05em',
                  transition: 'all 0.2s',
                }}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          {/* Featured section */}
          {featuredProducts.length > 0 && selectedCategory === 'all' && (
            <>
              <h2 style={{
                fontFamily: "'Syne Variable', sans-serif",
                fontSize: '1.3rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 24,
              }}>
                Featured Tools
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: 24,
                marginBottom: 48,
              }}>
                {featuredProducts.map(product => (
                  <AIToolCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}

          {/* All products grid */}
          {filteredProducts.length > 0 && (
            <>
              {selectedCategory === 'all' && featuredProducts.length > 0 && (
                <h2 style={{
                  fontFamily: "'Syne Variable', sans-serif",
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 24,
                }}>
                  All Tools
                </h2>
              )}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: 24,
              }}>
                {(selectedCategory === 'all'
                  ? filteredProducts.filter(p => !p.featured)
                  : filteredProducts
                ).map(product => (
                  <AIToolCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}

          {/* Affiliate disclosure */}
          <div style={{
            marginTop: 48,
            padding: 20,
            background: 'rgba(10,22,40,0.4)',
            borderRadius: 8,
            border: '1px solid var(--border-subtle)',
          }}>
            <p style={{
              fontSize: '0.75rem',
              color: 'var(--text-tertiary)',
              fontFamily: "'JetBrains Mono Variable', monospace",
              lineHeight: 1.6,
            }}>
              Disclosure: Some links on this page are affiliate links. NDN Analytics may earn a commission at no extra cost to you. We only recommend tools we've evaluated and believe provide value.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
