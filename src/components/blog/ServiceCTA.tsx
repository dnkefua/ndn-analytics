import { Link } from 'react-router-dom';

interface ServiceCTAProps {
  serviceCTA?: string;
  relatedProducts?: string[];
  source?: 'ai_generated' | 'manual';
}

// Map product IDs to display info
const PRODUCT_INFO: Record<string, { name: string; tagline: string }> = {
  'ndn-001': { name: 'NDN Demand IQ', tagline: 'Retail demand forecasting' },
  'ndn-002': { name: 'NDN Care Predict', tagline: 'Hospital readmission prevention' },
  'ndn-003': { name: 'NDN Route AI', tagline: 'Last-mile delivery optimization' },
  'ndn-004': { name: 'NDN Churn Guard', tagline: 'SaaS churn prevention' },
  'ndn-005': { name: 'NDN TraceChain', tagline: 'Supply chain provenance' },
  'ndn-006': { name: 'NDN PayStream', tagline: 'Smart contract payments' },
  'ndn-007': { name: 'NDN CredVault', tagline: 'Credential verification' },
  'ndn-008': { name: 'NDN PropLedger', tagline: 'Real estate tokenization' },
  'ndn-009': { name: 'Njangi', tagline: 'Web3 community finance' },
  'ndn-010': { name: 'NeuroQuest', tagline: 'Cognitive AI profiling' },
  'ndn-011': { name: 'NDN Interpreter', tagline: 'Sign language translation' },
  'ndn-012': { name: 'NDN Model Studio', tagline: 'No-code fine-tuning' },
  'ndn-013': { name: 'NDN IPFS CHAIN', tagline: 'IPFS proof layer' },
  'ndn-014': { name: 'TheDiaspora App', tagline: 'Diaspora community network' },
};

export default function ServiceCTA({ serviceCTA, relatedProducts, source }: ServiceCTAProps) {
  const contactUrl = `/contact?utm_source=blog&utm_medium=cta&utm_campaign=${source === 'ai_generated' ? 'ai_article' : 'blog_article'}`;

  return (
    <div
      style={{
        marginTop: 48,
        padding: 32,
        borderRadius: 16,
        background: 'linear-gradient(135deg, rgba(6,182,212,0.08) 0%, rgba(139,92,246,0.08) 100%)',
        border: '1px solid rgba(6,182,212,0.2)',
      }}
    >
      <h3
        style={{
          fontFamily: "'Syne Variable', sans-serif",
          fontSize: '1.3rem',
          fontWeight: 700,
          marginBottom: 12,
          color: 'var(--text-primary)',
        }}
      >
        Need Help Implementing AI/Blockchain Solutions?
      </h3>

      {serviceCTA && (
        <p
          style={{
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            marginBottom: 20,
          }}
        >
          {serviceCTA}
        </p>
      )}

      {!serviceCTA && (
        <p
          style={{
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            marginBottom: 20,
          }}
        >
          NDN Analytics specializes in enterprise AI and blockchain implementation.
          Our team can help you integrate cutting-edge technology into your existing workflows.
        </p>
      )}

      {relatedProducts && relatedProducts.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <p
            style={{
              fontSize: '0.75rem',
              fontFamily: "'JetBrains Mono Variable', monospace",
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 12,
            }}
          >
            Related NDN Products
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {relatedProducts.map(productId => {
              const product = PRODUCT_INFO[productId];
              if (!product) return null;
              return (
                <Link
                  key={productId}
                  to={`/products/${productId}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 14px',
                    background: 'rgba(6,182,212,0.1)',
                    borderRadius: 8,
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    color: 'var(--text-primary)',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(6,182,212,0.2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(6,182,212,0.1)')}
                >
                  <span style={{ fontWeight: 600 }}>{product.name}</span>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                    {product.tagline}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Link to={contactUrl} className="btn btn-primary">
          Book a Consultation
        </Link>
        <Link
          to="/products"
          className="btn"
          style={{
            background: 'transparent',
            border: '1px solid var(--brand-cyan)',
            color: 'var(--brand-cyan)',
          }}
        >
          Explore Our Products
        </Link>
      </div>
    </div>
  );
}
