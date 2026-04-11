import type { AIProduct } from '../../types/aiProducts';
import { buildTrackedLink, trackAffiliateClick } from '../../lib/aiProductsService';

interface Props {
  product: AIProduct;
}

const CATEGORY_COLORS: Record<string, string> = {
  llm_api: 'var(--brand-cyan)',
  dev_tools: 'var(--brand-blue)',
  productivity: 'var(--brand-purple)',
  design: 'var(--brand-gold)',
  analytics: 'var(--brand-cyan)',
  automation: 'var(--brand-blue)',
  database: 'var(--brand-purple)',
  infrastructure: 'var(--brand-gold)',
};

const PRICING_LABELS: Record<string, string> = {
  free: 'Free',
  freemium: 'Freemium',
  paid: 'Paid',
  enterprise: 'Enterprise',
};

export default function AIToolCard({ product }: Props) {
  const handleClick = () => {
    trackAffiliateClick(product, window.location.pathname, 'aitools');
  };

  const trackedLink = buildTrackedLink(product, 'aitools');

  return (
    <a
      href={trackedLink}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(10,22,40,0.6)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 12,
        padding: 24,
        textDecoration: 'none',
        color: 'inherit',
        transition: 'border-color 0.3s, transform 0.3s',
      }}
      onMouseOver={e => {
        e.currentTarget.style.borderColor = 'var(--brand-cyan)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseOut={e => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.transform = 'none';
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
        {/* Logo */}
        {product.logoUrl ? (
          <img
            src={product.logoUrl}
            alt={`${product.name} logo`}
            style={{
              width: 48,
              height: 48,
              borderRadius: 8,
              objectFit: 'contain',
              background: 'rgba(255,255,255,0.05)',
            }}
          />
        ) : (
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 8,
              background: CATEGORY_COLORS[product.category] || 'var(--brand-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'rgba(0,0,0,0.8)',
            }}
          >
            {product.name.charAt(0)}
          </div>
        )}

        <div style={{ flex: 1 }}>
          <h3 style={{
            fontFamily: "'Syne Variable', sans-serif",
            fontSize: '1.1rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 4,
          }}>
            {product.name}
          </h3>
          <p style={{
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.4,
          }}>
            {product.tagline}
          </p>
        </div>

        {product.featured && (
          <span style={{
            fontSize: '0.6rem',
            fontFamily: "'JetBrains Mono Variable', monospace",
            color: 'var(--brand-gold)',
            background: 'rgba(251,191,36,0.1)',
            padding: '4px 8px',
            borderRadius: 12,
            letterSpacing: '0.05em',
          }}>
            FEATURED
          </span>
        )}
      </div>

      {/* Description */}
      <p style={{
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.6,
        marginBottom: 16,
        flex: 1,
      }}>
        {product.description}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <span style={{
          fontSize: '0.65rem',
          fontFamily: "'JetBrains Mono Variable', monospace",
          color: CATEGORY_COLORS[product.category] || 'var(--brand-cyan)',
          background: `${CATEGORY_COLORS[product.category] || 'var(--brand-cyan)'}15`,
          padding: '4px 10px',
          borderRadius: 20,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          {product.category.replace('_', ' ')}
        </span>
        <span style={{
          fontSize: '0.65rem',
          fontFamily: "'JetBrains Mono Variable', monospace",
          color: 'var(--text-tertiary)',
          background: 'rgba(100,116,139,0.1)',
          padding: '4px 10px',
          borderRadius: 20,
        }}>
          {PRICING_LABELS[product.pricing] || product.pricing}
        </span>
      </div>

      {/* CTA */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 16,
        borderTop: '1px solid var(--border-subtle)',
      }}>
        <span style={{
          fontSize: '0.75rem',
          fontFamily: "'JetBrains Mono Variable', monospace",
          color: 'var(--brand-cyan)',
        }}>
          Try {product.name} →
        </span>
        {product.badge && (
          <span style={{
            fontSize: '0.6rem',
            fontFamily: "'JetBrains Mono Variable', monospace",
            color: 'var(--text-tertiary)',
            background: 'rgba(100,116,139,0.1)',
            padding: '4px 8px',
            borderRadius: 8,
          }}>
            {product.badge}
          </span>
        )}
      </div>
    </a>
  );
}
