import { Link } from 'react-router-dom';
import { PRODUCTS } from '../products/productData';

const FOOTER_PRODUCTS = PRODUCTS.filter(p =>
  ['ndn-001', 'ndn-002', 'ndn-005', 'ndn-009', 'ndn-010'].includes(p.id)
);

const COMPANY_LINKS = [
  ['About', '/about'],
  ['Solutions', '/solutions'],
  ['Technology', '/tech'],
  ['Contact', '/contact'],
  ['Blog', '/blog'],
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      position: 'relative',
      zIndex: 10,
      background: 'rgba(1,3,9,0.9)',
      borderTop: '1px solid var(--border-subtle)',
      padding: '48px 0 32px',
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ fontFamily: "'Syne Variable', 'Syne', sans-serif", fontSize: '1rem', fontWeight: 900, color: 'var(--brand-cyan)', marginBottom: 12 }}>NDN ANALYTICS</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Enterprise AI & Blockchain intelligence for the next era of business.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <a href="https://twitter.com/NDNAnalytics" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)"
                style={{ color: 'var(--text-secondary)', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }}
                onMouseOver={e => (e.currentTarget.style.color = 'var(--brand-cyan)')}
                onMouseOut={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.845L1.255 2.25H8.08l4.266 5.64L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/ndn-analytics-inc/" target="_blank" rel="noopener noreferrer" aria-label="NDN Analytics on LinkedIn"
                style={{ color: 'var(--text-secondary)', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }}
                onMouseOver={e => (e.currentTarget.style.color = 'var(--brand-cyan)')}
                onMouseOut={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono Variable', 'JetBrains Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--text-tertiary)', marginBottom: 16, textTransform: 'uppercase' }}>Products</div>
            {FOOTER_PRODUCTS.map(p => (
              <div key={p.id} style={{ marginBottom: 8 }}>
                <Link to={`/products/${p.id}`} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseOver={e => (e.currentTarget.style.color = 'var(--brand-cyan)')}
                  onMouseOut={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
                  {p.name}
                </Link>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono Variable', 'JetBrains Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--text-tertiary)', marginBottom: 16, textTransform: 'uppercase' }}>Company</div>
            {COMPANY_LINKS.map(([label, href]) => (
              <div key={href} style={{ marginBottom: 8 }}>
                <Link to={href} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseOver={e => (e.currentTarget.style.color = 'var(--brand-cyan)')}
                  onMouseOut={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
                  {label}
                </Link>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono Variable', 'JetBrains Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--text-tertiary)', marginBottom: 16, textTransform: 'uppercase' }}>Compliance</div>
            {['SOC 2 Type II', 'ISO 27001', 'HIPAA', 'GDPR'].map(c => (
              <div key={c} style={{ marginBottom: 8, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{c}</div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ fontFamily: "'JetBrains Mono Variable', 'JetBrains Mono', monospace", fontSize: '0.65rem', color: 'var(--text-tertiary)', letterSpacing: '0.1em' }}>
            © {year} NDN ANALYTICS. ALL RIGHTS RESERVED.
          </div>
          <div style={{ fontFamily: "'JetBrains Mono Variable', 'JetBrains Mono', monospace", fontSize: '0.65rem', color: 'var(--text-tertiary)', letterSpacing: '0.08em' }}>
            POWERED BY GOOGLE CLOUD + ETHEREUM
          </div>
        </div>
      </div>
    </footer>
  );
}
