import { useParams, Link } from 'react-router-dom';
import SEO from '../seo/SEO';
import { getCaseStudyBySlug, CASE_STUDIES } from './caseStudyData';
import CaseStudyCard from './CaseStudyCard';
import { trackCTAClick } from '../../lib/analytics';
import './CaseStudies.css';

export default function CaseStudyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const caseStudy = slug ? getCaseStudyBySlug(slug) : undefined;

  if (!caseStudy) {
    return (
      <section style={{ minHeight: '60vh', paddingTop: 120, textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '2rem', color: '#0F172A', marginBottom: 16 }}>
            Case Study Not Found
          </h1>
          <Link to="/case-studies" style={{ color: '#7C3AED' }}>
            ← Back to Case Studies
          </Link>
        </div>
      </section>
    );
  }

  const relatedStudies = CASE_STUDIES.filter(cs => cs.id !== caseStudy.id).slice(0, 2);

  return (
    <>
      <SEO
        title={caseStudy.title}
        description={caseStudy.subtitle}
        keywords={`${caseStudy.client.industry}, AI implementation, ${caseStudy.technologies.join(', ')}`}
        canonicalPath={`/case-studies/${caseStudy.slug}`}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Case Studies', path: '/case-studies' },
          { name: caseStudy.client.industry, path: `/case-studies/${caseStudy.slug}` },
        ]}
      />

      <article style={{ paddingTop: 100, paddingBottom: 80 }}>
        {/* Hero */}
        <header
          style={{
            background: 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)',
            color: '#FFFFFF',
            padding: '80px 0',
            marginBottom: 48,
          }}
        >
          <div className="container">
            <Link
              to="/case-studies"
              style={{
                color: 'rgba(255,255,255,0.8)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 24,
              }}
            >
              ← Back to Case Studies
            </Link>

            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                opacity: 0.9,
                marginBottom: 16,
              }}
            >
              {caseStudy.client.industry} • {caseStudy.timeline}
            </div>

            <h1
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 800,
                marginBottom: 16,
                lineHeight: 1.2,
                maxWidth: 800,
              }}
            >
              {caseStudy.title}
            </h1>

            <p style={{ fontSize: '1.15rem', opacity: 0.9, maxWidth: 700 }}>
              {caseStudy.subtitle}
            </p>

            {/* Results Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: 20,
                marginTop: 48,
                maxWidth: 800,
              }}
            >
              {caseStudy.results.map(result => (
                <div
                  key={result.metric}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    padding: 20,
                    borderRadius: 12,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{result.value}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>{result.metric}</div>
                </div>
              ))}
            </div>
          </div>
        </header>

        <div className="container">
          <div
            className="cs-detail-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 300px',
              gap: 48,
              maxWidth: 1100,
              margin: '0 auto',
            }}
          >
            {/* Main Content */}
            <div>
              {/* Client Info */}
              <section style={{ marginBottom: 48 }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: 16 }}>
                  About the Client
                </h2>
                <div
                  style={{
                    background: '#F8FAFC',
                    padding: 24,
                    borderRadius: 12,
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <div style={{ display: 'grid', gap: 12 }}>
                    <div>
                      <span style={{ color: '#64748B', fontSize: '0.85rem' }}>Organization: </span>
                      <span style={{ color: '#0F172A', fontWeight: 500 }}>{caseStudy.client.name}</span>
                    </div>
                    <div>
                      <span style={{ color: '#64748B', fontSize: '0.85rem' }}>Industry: </span>
                      <span style={{ color: '#0F172A', fontWeight: 500 }}>{caseStudy.client.industry}</span>
                    </div>
                    <div>
                      <span style={{ color: '#64748B', fontSize: '0.85rem' }}>Size: </span>
                      <span style={{ color: '#0F172A', fontWeight: 500 }}>{caseStudy.client.size}</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Challenge */}
              <section style={{ marginBottom: 48 }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: 16 }}>
                  The Challenge
                </h2>
                <p style={{ color: '#475569', lineHeight: 1.8, fontSize: '1.05rem' }}>
                  {caseStudy.challenge}
                </p>
              </section>

              {/* Solution */}
              <section style={{ marginBottom: 48 }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: 16 }}>
                  Our Solution
                </h2>
                <p style={{ color: '#475569', lineHeight: 1.8, fontSize: '1.05rem' }}>
                  {caseStudy.solution}
                </p>
              </section>

              {/* Results Detail */}
              <section style={{ marginBottom: 48 }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: 16 }}>
                  Results Achieved
                </h2>
                <div style={{ display: 'grid', gap: 16 }}>
                  {caseStudy.results.map(result => (
                    <div
                      key={result.metric}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 20,
                        padding: 20,
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: 12,
                      }}
                    >
                      <div
                        style={{
                          fontSize: '1.5rem',
                          fontWeight: 700,
                          color: '#7C3AED',
                          minWidth: 80,
                        }}
                      >
                        {result.value}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#0F172A', marginBottom: 2 }}>
                          {result.metric}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#64748B' }}>
                          {result.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Testimonial */}
              {caseStudy.testimonial && (
                <section style={{ marginBottom: 48 }}>
                  <blockquote
                    style={{
                      background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(59,130,246,0.08))',
                      borderLeft: '4px solid #7C3AED',
                      padding: 32,
                      borderRadius: 12,
                      margin: 0,
                    }}
                  >
                    <p
                      style={{
                        fontSize: '1.15rem',
                        fontStyle: 'italic',
                        color: '#0F172A',
                        lineHeight: 1.7,
                        marginBottom: 16,
                      }}
                    >
                      "{caseStudy.testimonial.quote}"
                    </p>
                    <footer>
                      <cite style={{ fontStyle: 'normal' }}>
                        <span style={{ fontWeight: 600, color: '#0F172A' }}>
                          {caseStudy.testimonial.author}
                        </span>
                        <br />
                        <span style={{ color: '#64748B', fontSize: '0.9rem' }}>
                          {caseStudy.testimonial.role}
                        </span>
                      </cite>
                    </footer>
                  </blockquote>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <aside className="cs-detail-sidebar" style={{ position: 'sticky', top: 100, alignSelf: 'start' }}>
              {/* Technologies */}
              <div
                style={{
                  background: '#F8FAFC',
                  padding: 24,
                  borderRadius: 12,
                  marginBottom: 24,
                }}
              >
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', marginBottom: 12 }}>
                  Technologies Used
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {caseStudy.technologies.map(tech => (
                    <span
                      key={tech}
                      style={{
                        padding: '6px 12px',
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: 6,
                        fontSize: '0.8rem',
                        color: '#475569',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)',
                  padding: 24,
                  borderRadius: 12,
                  color: '#FFFFFF',
                  textAlign: 'center',
                }}
              >
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>
                  Want Similar Results?
                </h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: 16 }}>
                  Let's discuss your specific challenges.
                </p>
                <Link
                  to="/contact?utm_source=case_study&utm_medium=sidebar"
                  onClick={() => trackCTAClick('case_study_sidebar', caseStudy.slug)}
                  style={{
                    display: 'block',
                    background: '#FFFFFF',
                    color: '#7C3AED',
                    padding: '12px 20px',
                    borderRadius: 8,
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                  }}
                >
                  Book a Consultation
                </Link>
              </div>
            </aside>
          </div>

          {/* Related Case Studies */}
          {relatedStudies.length > 0 && (
            <section style={{ marginTop: 80 }}>
              <h2
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#0F172A',
                  marginBottom: 32,
                  textAlign: 'center',
                }}
              >
                More Success Stories
              </h2>
              <div
                className="cs-related-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: 24,
                  maxWidth: 900,
                  margin: '0 auto',
                }}
              >
                {relatedStudies.map(study => (
                  <CaseStudyCard key={study.id} caseStudy={study} />
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
}
