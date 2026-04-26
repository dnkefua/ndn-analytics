import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SEO from '../seo/SEO';
import { PRODUCTS } from '../products/productData';
import { trackCTAClick } from '../../lib/analytics';

const BASE_URL = 'https://www.ndnanalytics.com';

export interface ServiceLandingConfig {
  slug: string;
  eyebrow: string;
  h1: string;
  h1Highlight: string;
  /** A single paragraph (string) or multiple paragraphs (string[]) — multiple render with breathing room between them. */
  subhead: string | string[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  serviceName: string;
  serviceType: string;
  productIds: string[];
  deliverables: { title: string; body: string }[];
  industries: string[];
  faqs: { question: string; answer: string }[];
}

export default function ServiceLandingPage({ config }: { config: ServiceLandingConfig }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = ref.current?.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.target.classList.toggle('visible', e.isIntersecting)),
      { threshold: 0.1 }
    );
    els?.forEach(el => observer.observe(el));
    setTimeout(() => els?.forEach(el => el.classList.add('visible')), 100);
    return () => observer.disconnect();
  }, []);

  const products = PRODUCTS.filter(p => config.productIds.includes(p.id));
  const canonicalUrl = `${BASE_URL}/${config.slug}`;

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: config.serviceName,
    serviceType: config.serviceType,
    description: config.seoDescription,
    url: canonicalUrl,
    provider: {
      '@type': 'Organization',
      name: 'NDN Analytics',
      url: BASE_URL,
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Worldwide',
    },
    audience: {
      '@type': 'Audience',
      audienceType: config.industries.join(', '),
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: config.serviceName,
      itemListElement: products.map(p => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'SoftwareApplication',
          name: p.name,
          description: p.description,
          url: `${BASE_URL}/products/${p.id}`,
        },
      })),
    },
  };

  const faqSchema = config.faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: config.faqs.map(f => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }
    : null;

  return (
    <>
      <SEO
        title={config.seoTitle}
        description={config.seoDescription}
        keywords={config.seoKeywords}
        canonicalPath={`/${config.slug}`}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: config.serviceName, path: `/${config.slug}` },
        ]}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
      </Helmet>

      <section className="hero-section" ref={ref} style={{ paddingTop: 140, paddingBottom: 80 }}>
        <div className="container">
          <div className="hero-eyebrow reveal">
            <span className="hero-eyebrow-dot" />
            {config.eyebrow}
          </div>

          <h1 className="hero-title">
            <span className="hero-title-line1 reveal stagger-1">{config.h1}</span>
            <br />
            <span className="hero-title-line2 reveal stagger-2 text-gradient">{config.h1Highlight}</span>
          </h1>

          {Array.isArray(config.subhead) ? (
            <div className="reveal stagger-3" style={{ maxWidth: 720, marginBottom: 0 }}>
              {config.subhead.map((paragraph, idx) => (
                <p
                  key={idx}
                  className="hero-subtitle"
                  style={{
                    maxWidth: '100%',
                    marginBottom: idx === config.subhead.length - 1 ? 52 : 22,
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <p className="hero-subtitle reveal stagger-3">{config.subhead}</p>
          )}

          <div className="hero-ctas reveal stagger-4">
            <Link
              to="/contact"
              className="btn btn-primary"
              onClick={() => trackCTAClick(`${config.slug}_book_call`, 'service_landing')}
            >
              Book a Discovery Call →
            </Link>
            <Link
              to="/case-studies"
              className="btn btn-ghost"
              onClick={() => trackCTAClick(`${config.slug}_case_studies`, 'service_landing')}
            >
              See Case Studies
            </Link>
          </div>

          {/* What we deliver */}
          <div className="reveal stagger-5" style={{ marginTop: 72 }}>
            <h2 style={{
              fontSize: '1.6rem',
              fontWeight: 700,
              fontFamily: "'Syne Variable', sans-serif",
              color: 'var(--text-primary)',
              marginBottom: 24,
              textAlign: 'center',
            }}>
              What you get when you work with us
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 18,
            }}>
              {config.deliverables.map(d => (
                <div key={d.title} style={{
                  background: 'rgba(7, 24, 41, 0.7)',
                  border: '1px solid rgba(6, 182, 212, 0.15)',
                  borderRadius: 14,
                  padding: '22px 20px',
                }}>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    fontFamily: "'Syne Variable', sans-serif",
                    color: 'var(--brand-cyan)',
                    marginBottom: 8,
                  }}>
                    {d.title}
                  </div>
                  <div style={{
                    fontSize: '0.88rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                  }}>
                    {d.body}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured products in this category */}
          {products.length > 0 && (
            <div className="reveal stagger-6" style={{ marginTop: 72 }}>
              <h2 style={{
                fontSize: '1.6rem',
                fontWeight: 700,
                fontFamily: "'Syne Variable', sans-serif",
                color: 'var(--text-primary)',
                marginBottom: 24,
                textAlign: 'center',
              }}>
                Products in this practice
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 18,
              }}>
                {products.map(p => (
                  <Link
                    key={p.id}
                    to={`/products/${p.id}`}
                    onClick={() => trackCTAClick(`${config.slug}_product_${p.id}`, 'service_landing')}
                    style={{
                      background: 'rgba(7, 24, 41, 0.85)',
                      border: '1px solid rgba(6, 182, 212, 0.2)',
                      borderRadius: 14,
                      padding: '22px 20px',
                      textDecoration: 'none',
                      display: 'block',
                      transition: 'transform 0.2s ease, border-color 0.2s ease',
                    }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--brand-cyan)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.2)'; e.currentTarget.style.transform = 'none'; }}
                  >
                    <div style={{
                      fontSize: '0.65rem',
                      fontFamily: "'JetBrains Mono Variable', monospace",
                      color: 'var(--brand-cyan)',
                      letterSpacing: '0.1em',
                      marginBottom: 8,
                      textTransform: 'uppercase',
                    }}>
                      {p.badge}
                    </div>
                    <div style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      fontFamily: "'Syne Variable', sans-serif",
                      color: 'var(--text-primary)',
                      marginBottom: 6,
                    }}>
                      {p.name}
                    </div>
                    <div style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.55,
                    }}>
                      {p.tagline}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Industry fit */}
          <div className="reveal stagger-7" style={{ marginTop: 72 }}>
            <h2 style={{
              fontSize: '1.6rem',
              fontWeight: 700,
              fontFamily: "'Syne Variable', sans-serif",
              color: 'var(--text-primary)',
              marginBottom: 16,
              textAlign: 'center',
            }}>
              Who this is for
            </h2>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              justifyContent: 'center',
              maxWidth: 760,
              margin: '0 auto',
            }}>
              {config.industries.map(industry => (
                <div key={industry} style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  background: 'rgba(6, 182, 212, 0.08)',
                  border: '1px solid rgba(6, 182, 212, 0.2)',
                  borderRadius: 999,
                  padding: '8px 16px',
                  fontFamily: "'JetBrains Mono Variable', monospace",
                  letterSpacing: '0.04em',
                }}>
                  {industry}
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          {config.faqs.length > 0 && (
            <div className="reveal stagger-8" style={{ marginTop: 72, maxWidth: 820, marginLeft: 'auto', marginRight: 'auto' }}>
              <h2 style={{
                fontSize: '1.6rem',
                fontWeight: 700,
                fontFamily: "'Syne Variable', sans-serif",
                color: 'var(--text-primary)',
                marginBottom: 20,
                textAlign: 'center',
              }}>
                Common questions
              </h2>
              {config.faqs.map(faq => (
                <details key={faq.question} style={{
                  background: 'rgba(7, 24, 41, 0.6)',
                  border: '1px solid rgba(6, 182, 212, 0.12)',
                  borderRadius: 12,
                  padding: '16px 20px',
                  marginBottom: 12,
                }}>
                  <summary style={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontFamily: "'Syne Variable', sans-serif",
                  }}>
                    {faq.question}
                  </summary>
                  <p style={{
                    marginTop: 12,
                    fontSize: '0.88rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.65,
                  }}>
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          )}

          {/* Final CTA */}
          <div className="reveal" style={{ marginTop: 80, textAlign: 'center' }}>
            <div style={{
              background: 'rgba(6, 182, 212, 0.04)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              borderRadius: 16,
              padding: '40px 28px',
              maxWidth: 720,
              margin: '0 auto',
            }}>
              <h2 style={{
                fontSize: '1.6rem',
                fontWeight: 700,
                fontFamily: "'Syne Variable', sans-serif",
                color: 'var(--text-primary)',
                marginBottom: 14,
              }}>
                Ready to scope a build?
              </h2>
              <p style={{
                fontSize: '0.95rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.65,
                marginBottom: 24,
              }}>
                A 30-minute discovery call gets you a problem framing, a reference architecture sketch, and a realistic timeline. No commitment.
              </p>
              <Link
                to="/contact"
                className="btn btn-primary"
                onClick={() => trackCTAClick(`${config.slug}_final_cta`, 'service_landing')}
              >
                Book a Discovery Call →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
