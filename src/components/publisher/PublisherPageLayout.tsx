import type { ReactNode } from 'react';
import SEO from '../seo/SEO';

interface PublisherPageLayoutProps {
  label: string;
  title: string;
  description: string;
  canonicalPath: string;
  children: ReactNode;
}

export function PublisherPageLayout({
  label,
  title,
  description,
  canonicalPath,
  children,
}: PublisherPageLayoutProps) {
  return (
    <>
      <SEO
        title={title}
        description={description}
        canonicalPath={canonicalPath}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: title, path: canonicalPath },
        ]}
      />
      <section style={{ minHeight: '100vh', padding: '120px 0 100px' }}>
        <div className="container" style={{ maxWidth: 840, margin: '0 auto' }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{
              fontFamily: "'JetBrains Mono Variable', 'JetBrains Mono', monospace",
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              color: 'var(--brand-cyan)',
              textTransform: 'uppercase',
              marginBottom: 12,
            }}>
              {label}
            </div>
            <h1 style={{
              fontFamily: "'Syne Variable', 'Syne', sans-serif",
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 900,
              color: 'var(--text-primary)',
              lineHeight: 1.1,
              marginBottom: 16,
            }}>
              {title}
            </h1>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '1rem',
              lineHeight: 1.8,
              margin: 0,
            }}>
              {description}
            </p>
          </div>
          <div style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: 32,
          }}>
            {children}
          </div>
        </div>
      </section>
    </>
  );
}

export function PublisherSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{
        fontFamily: "'Syne Variable', 'Syne', sans-serif",
        fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
        fontWeight: 700,
        color: 'var(--brand-cyan)',
        marginBottom: 14,
      }}>
        {title}
      </h2>
      <div style={{
        color: 'var(--text-secondary)',
        fontSize: '0.95rem',
        lineHeight: 1.85,
      }}>
        {children}
      </div>
    </section>
  );
}
