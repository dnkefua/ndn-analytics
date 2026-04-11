import { Link } from 'react-router-dom';
import SEO from '../seo/SEO';
import CaseStudyCard from './CaseStudyCard';
import { CASE_STUDIES } from './caseStudyData';
import { trackCTAClick } from '../../lib/analytics';

export default function CaseStudiesSection() {
  const featuredStudies = CASE_STUDIES.filter(cs => cs.featured);

  return (
    <>
      <SEO
        title="Case Studies"
        description="See how NDN Analytics helps organizations achieve measurable results with AI and blockchain solutions. Real implementations, real outcomes."
        keywords="AI case studies, blockchain implementation, enterprise AI results, supply chain traceability, demand forecasting"
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
              Case Studies
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
              Real Results From<br />
              <span style={{ color: '#7C3AED' }}>Real Implementations</span>
            </h1>
            <p
              style={{
                fontSize: '1.1rem',
                color: '#64748B',
                maxWidth: 600,
                margin: '0 auto',
                lineHeight: 1.7,
              }}
            >
              See how organizations across industries are achieving measurable outcomes with NDN Analytics AI and blockchain solutions.
            </p>
          </div>

          {/* Stats Banner */}
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
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>95%</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Client Retention</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>$50M+</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Client Savings</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>90 Days</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Avg. Time to ROI</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>12+</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Industries Served</div>
            </div>
          </div>

          {/* Featured Case Studies */}
          <div
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
              Ready to Become Our Next Success Story?
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
              Let's discuss how NDN Analytics can deliver measurable results for your organization.
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
