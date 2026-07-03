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
                background: 'rgba(124,58,237,0.1)',
                borderRadius: 20,
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#7C3AED',
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
                color: '#0F172A',
                marginBottom: 16,
                lineHeight: 1.2,
              }}
            >
              Products Applied to<br />
              <span style={{ color: '#7C3AED' }}>Real-World Scenarios</span>
            </h1>
            <p
              style={{
                fontSize: '1.1rem',
                color: '#64748B',
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
              background: 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)',
              borderRadius: 16,
              marginBottom: 64,
              textAlign: 'center',
              color: '#FFFFFF',
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
              background: '#F8FAFC',
              borderRadius: 16,
              border: '1px solid #E2E8F0',
            }}
          >
            <h2
              style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                color: '#0F172A',
                marginBottom: 12,
              }}
            >
              See How This Applies to Your Problem
            </h2>
            <p
              style={{
                color: '#64748B',
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
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 28px',
                background: '#7C3AED',
                color: '#FFFFFF',
                borderRadius: 8,
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Schedule a Consultation →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
