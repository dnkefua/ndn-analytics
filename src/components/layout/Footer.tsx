import { Link } from 'react-router-dom';

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
          </div>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono Variable', 'JetBrains Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--text-tertiary)', marginBottom: 16, textTransform: 'uppercase' }}>Products</div>
            {['NDN Demand IQ', 'NDN Care Predict', 'NDN TraceChain', 'Njangi', 'NeuroQuest'].map(p => (
              <div key={p} style={{ marginBottom: 8 }}>
                <Link to="/products" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseOver={e => (e.currentTarget.style.color = 'var(--brand-cyan)')}
                  onMouseOut={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
                  {p}
                </Link>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono Variable', 'JetBrains Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--text-tertiary)', marginBottom: 16, textTransform: 'uppercase' }}>Company</div>
            {[['About', '/about'], ['Solutions', '/solutions'], ['Technology', '/tech'], ['Contact', '/contact']].map(([label, href]) => (
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
