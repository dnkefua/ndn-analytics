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
          background: '#FFFFFF',
          borderRadius: 20,
          overflow: 'hidden',
          textDecoration: 'none',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          transition: 'transform 0.3s, box-shadow 0.3s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.12)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)';
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)',
            padding: 32,
            color: '#FFFFFF',
          }}
        >
          <div
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              opacity: 0.9,
              marginBottom: 12,
            }}
          >
            {caseStudy.client.industry}
          </div>
          <h3
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              lineHeight: 1.3,
              marginBottom: 8,
            }}
          >
            {caseStudy.title}
          </h3>
          <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>{caseStudy.subtitle}</p>
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
                    color: '#7C3AED',
                    marginBottom: 4,
                  }}
                >
                  {result.value}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{result.metric}</div>
              </div>
            ))}
          </div>

          {caseStudy.testimonial && (
            <blockquote
              style={{
                borderLeft: '3px solid #7C3AED',
                paddingLeft: 16,
                margin: 0,
                fontStyle: 'italic',
                color: '#475569',
                fontSize: '0.9rem',
                lineHeight: 1.6,
              }}
            >
              "{caseStudy.testimonial.quote.slice(0, 120)}..."
            </blockquote>
          )}

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
                    background: '#F1F5F9',
                    borderRadius: 6,
                    fontSize: '0.75rem',
                    color: '#64748B',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
            <span style={{ color: '#7C3AED', fontWeight: 600, fontSize: '0.9rem' }}>
              Read Case Study →
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
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 16,
        padding: 24,
        textDecoration: 'none',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div
        style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#7C3AED',
          marginBottom: 8,
        }}
      >
        {caseStudy.client.industry}
      </div>

      <h3
        style={{
          fontSize: '1.15rem',
          fontWeight: 700,
          color: '#0F172A',
          marginBottom: 8,
          lineHeight: 1.4,
        }}
      >
        {caseStudy.title}
      </h3>

      <p
        style={{
          fontSize: '0.9rem',
          color: '#64748B',
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
          borderTop: '1px solid #F1F5F9',
        }}
      >
        <div>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#7C3AED' }}>
            {topResult.value}
          </span>
          <span style={{ fontSize: '0.8rem', color: '#94A3B8', marginLeft: 8 }}>
            {topResult.metric}
          </span>
        </div>
        <span style={{ color: '#7C3AED', fontSize: '0.85rem', fontWeight: 500 }}>
          Read More →
        </span>
      </div>
    </Link>
  );
}
