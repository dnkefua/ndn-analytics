import { Link } from 'react-router-dom';
import SEO from '../seo/SEO';
import CaseStudyCard from './CaseStudyCard';
import { CASE_STUDIES } from './caseStudyData';
import { trackCTAClick } from '../../lib/analytics';
import './CaseStudies.css';

export default function CaseStudiesSection() {
  const featuredStudies = CASE_STUDIES.filter(cs => cs.featured);

  return (
    <>
      <SEO
        title="Reference Implementations — NDN Analytics"
        description="Reference implementations showing how NDN Analytics products address real-world challenges in retail, healthcare, and supply chain. Modeled scenarios based on product architecture and domain research."
        keywords="AI reference implementation, blockchain scenario, demand forecasting, supply chain traceability, healthcare AI"
        canonicalPath="/case-studies"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Case Studies', path: '/case-studies' },
        ]}
      />

      <section style={{ minHeight: '100vh', paddingTop: 120, paddingBottom: 80 }}>
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div
              style={{
                display: 'inline-block',
                padding: '6px 16px',
                background: 'rgba(6,182,212,0.1)',
                borderRadius: 20,
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--brand-cyan)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              Reference Implementations
            </div>
            <h1
              style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: 16,
                lineHeight: 1.2,
              }}
            >
              Products Applied to<br />
              <span className="text-gradient">Real-World Scenarios</span>
            </h1>
            <p
              style={{
                fontSize: '1.1rem',
                color: 'var(--text-secondary)',
                maxWidth: 660,
                margin: '0 auto',
                lineHeight: 1.7,
              }}
            >
              These reference implementations show how NDN Analytics products address specific industry challenges.
              Scenarios are modeled against real domain constraints and product architecture — not historical client engagements.
            </p>
          </div>

          {/* Domain Coverage */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 24,
              padding: 32,
              background: 'var(--gradient-primary)',
              borderRadius: 16,
              marginBottom: 64,
              textAlign: 'center',
              color: '#FFFFFF',
              boxShadow: '0 8px 32px rgba(6, 182, 212, 0.15)',
            }}
          >
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>12</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Products</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>2</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Blockchain Networks</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>GCP</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>AI Infrastructure</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>Apache 2</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Open Source License</div>
            </div>
          </div>

          {/* Featured Case Studies */}
          <div
            className="cs-featured-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: 32,
              marginBottom: 64,
            }}
          >
            {featuredStudies.map(study => (
              <CaseStudyCard key={study.id} caseStudy={study} variant="featured" />
            ))}
          </div>

          {/* CTA Section */}
          <div
            style={{
              textAlign: 'center',
              padding: 48,
              background: 'linear-gradient(135deg, rgba(7, 24, 41, 0.6) 0%, rgba(7, 24, 41, 0.3) 100%)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 16,
              backdropFilter: 'blur(18px) saturate(150%)',
              WebkitBackdropFilter: 'blur(18px) saturate(150%)',
              boxShadow: '0 18px 50px rgba(2, 6, 23, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            }}
          >
            <h2
              style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 12,
              }}
            >
              See How This Applies to Your Problem
            </h2>
            <p
              style={{
                color: 'var(--text-secondary)',
                marginBottom: 28,
                maxWidth: 500,
                margin: '0 auto 28px',
                lineHeight: 1.7,
              }}
            >
              These scenarios are starting points. Bring your specific challenge and we'll scope a solution against your actual stack and constraints.
            </p>
            <Link
              to="/contact?utm_source=case_studies&utm_medium=cta"
              className="btn btn-primary"
              onClick={() => trackCTAClick('case_studies_cta', 'case_studies_page')}
            >
              Schedule a Consultation →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
