import { Link } from 'react-router-dom';
import type { CaseStudy } from './caseStudyData';

interface Props {
  caseStudy: CaseStudy;
  variant?: 'card' | 'featured';
}

export default function CaseStudyCard({ caseStudy, variant = 'card' }: Props) {
  const topResult = caseStudy.results[0];

  if (variant === 'featured') {
    return (
      <Link
        to={`/case-studies/${caseStudy.slug}`}
        style={{
          display: 'block',
          background: 'linear-gradient(135deg, rgba(7, 24, 41, 0.6) 0%, rgba(7, 24, 41, 0.3) 100%)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 20,
          overflow: 'hidden',
          textDecoration: 'none',
          backdropFilter: 'blur(18px) saturate(150%)',
          WebkitBackdropFilter: 'blur(18px) saturate(150%)',
          boxShadow: '0 18px 50px rgba(2, 6, 23, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          transition: 'transform 0.3s, border-color 0.3s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.borderColor = 'var(--brand-purple)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)',
            padding: 32,
            borderBottom: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
          }}
        >
          <div
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--brand-cyan)',
              marginBottom: 12,
            }}
          >
            Reference Implementation &middot; {caseStudy.client.industry}
          </div>
          <h3
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              lineHeight: 1.3,
              marginBottom: 8,
              color: 'var(--text-primary)',
            }}
          >
            {caseStudy.title}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{caseStudy.subtitle}</p>
        </div>

        <div style={{ padding: 28 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 16,
              marginBottom: 20,
            }}
          >
            {caseStudy.results.slice(0, 4).map(result => (
              <div key={result.metric} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'var(--brand-cyan)',
                    marginBottom: 4,
                  }}
                >
                  {result.value}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{result.metric}</div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {caseStudy.technologies.slice(0, 3).map(tech => (
                <span
                  key={tech}
                  style={{
                    padding: '4px 10px',
                    background: 'rgba(6, 182, 212, 0.08)',
                    borderRadius: 6,
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
            <span style={{ color: 'var(--brand-purple)', fontWeight: 600, fontSize: '0.9rem' }}>
              View Reference →
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/case-studies/${caseStudy.slug}`}
      style={{
        display: 'block',
        background: 'linear-gradient(135deg, rgba(7, 24, 41, 0.6) 0%, rgba(7, 24, 41, 0.3) 100%)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 16,
        padding: 24,
        textDecoration: 'none',
        backdropFilter: 'blur(18px) saturate(150%)',
        WebkitBackdropFilter: 'blur(18px) saturate(150%)',
        boxShadow: '0 18px 50px rgba(2, 6, 23, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        transition: 'transform 0.2s, border-color 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = 'var(--brand-cyan)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
      }}
    >
      <div
        style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--brand-cyan)',
          marginBottom: 8,
        }}
      >
        {caseStudy.client.industry}
      </div>

      <h3
        style={{
          fontSize: '1.15rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 8,
          lineHeight: 1.4,
        }}
      >
        {caseStudy.title}
      </h3>

      <p
        style={{
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          marginBottom: 16,
          lineHeight: 1.5,
        }}
      >
        {caseStudy.subtitle}
      </p>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 16,
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <div>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--brand-purple)' }}>
            {topResult.value}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: 8 }}>
            {topResult.metric}
          </span>
        </div>
        <span style={{ color: 'var(--brand-purple)', fontSize: '0.85rem', fontWeight: 500 }}>
          View Reference →
        </span>
      </div>
    </Link>
  );
}
