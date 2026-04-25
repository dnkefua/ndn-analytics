import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../seo/SEO';
import OrganizationSchema from '../seo/OrganizationSchema';
import FAQSchema from '../seo/FAQSchema';
import { trackCTAClick } from '../../lib/analytics';
import './Hero.css';

const HOMEPAGE_FAQS = [
  {
    question: 'What services does NDN Analytics provide?',
    answer: 'NDN Analytics builds AI products and blockchain solutions. Our AI products run on Google Cloud Platform and cover demand forecasting (NDN Demand IQ), healthcare AI (NDN HealthPredict), and inventory optimization. Our blockchain products run on Ethereum and cover supply chain traceability (NDN TraceChain), automated B2B payments (NDN PayStream), and smart contract development.',
  },
  {
    question: 'What industries does NDN Analytics serve?',
    answer: 'NDN Analytics targets retail and e-commerce, healthcare and pharmaceuticals, supply chain and logistics, financial services, community finance, and diaspora networks. Each product is purpose-built for its domain — demand forecasting for retail, patient outcome modeling for healthcare, immutable provenance for supply chains, and smart contract automation for payments.',
  },
  {
    question: 'What results can I expect from NDN Analytics AI products?',
    answer: 'Our products are architected to address the highest-cost inefficiencies in each domain — demand forecasting to reduce waste and stockouts, traceability to compress audit cycles, and smart contract automation to eliminate manual reconciliation. Outcomes depend on your current stack; we scope every engagement against your specific baseline rather than generic benchmarks.',
  },
  {
    question: 'What technologies does NDN Analytics use?',
    answer: 'We build on Google Cloud Platform (Vertex AI, BigQuery, Cloud Functions, Firestore) for AI and machine learning, and on Ethereum (Solidity, Web3.js, Hardhat) for blockchain. Our stack also includes TensorFlow, PyTorch, serverless architecture, microservices, and API-first design patterns.',
  },
  {
    question: 'How does NDN Demand IQ work?',
    answer: 'NDN Demand IQ is an AI-powered demand forecasting product that analyzes historical sales data, market trends, seasonality, and external factors to predict future demand. It integrates with existing ERP and inventory systems, delivering actionable replenishment signals that help retailers reduce excess stock and minimize stockouts. The model retrains on your own data over time, improving precision continuously.',
  },
  {
    question: 'What is NDN TraceChain and how does it improve supply chain?',
    answer: 'NDN TraceChain is an Ethereum blockchain-based supply chain traceability product that creates an immutable record of every product movement from origin to consumer. It enables end-to-end transparency, supports regulatory compliance requirements, and provides real-time visibility into supply chain operations — replacing paper trails with verifiable on-chain events.',
  },
  {
    question: 'Does NDN Analytics provide custom AI development?',
    answer: 'Yes. We offer custom AI development including fine-tuning models for specific business needs, building tailored machine learning pipelines, and integrating AI into existing workflows. Our NDN FineTune product specializes in custom model development and deployment on GCP.',
  },
  {
    question: 'How can I get started with NDN Analytics?',
    answer: 'Contact us at https://www.ndnanalytics.com/contact to schedule a consultation. We offer discovery sessions to understand your business challenge and identify the right product or custom engagement. From there we scope, architect, and build — with direct founder involvement at every stage.',
  },
];

const STATS = [
  { value: 14, label: 'Products', suffix: '' },
  { value: 2,  label: 'Blockchain Networks', suffix: '' },
  { value: 99.9, label: 'Uptime Target', suffix: '%' },
];

const FEATURED_PRODUCTS = [
  {
    id: 'ndn-001',
    icon: '◈',
    name: 'NDN Demand IQ',
    tagline: 'Predict demand before it happens.',
    badge: 'Google Cloud',
    color: '#06B6D4',
  },
  {
    id: 'ndn-005',
    icon: '⬡',
    name: 'NDN TraceChain',
    tagline: 'Every product. Every step. On-chain.',
    badge: 'Ethereum',
    color: '#4F46E5',
  },
  {
    id: 'ndn-006',
    icon: '◈',
    name: 'NDN PayStream',
    tagline: 'Payments that execute themselves.',
    badge: 'Ethereum',
    color: '#4F46E5',
  },
  {
    id: 'ndn-014',
    icon: 'D',
    name: 'TheDiaspora App',
    tagline: 'Connect the diaspora. Build trusted opportunity.',
    badge: 'Diaspora',
    color: '#F59E0B',
  },
];

const PRODUCT_SPOTLIGHTS = [
  {
    id: 'ndn-001',
    linkPath: '/products/ndn-001',
    product: 'NDN Demand IQ',
    headline: 'AI Demand Forecasting',
    metric: 'Retail & supply chain intelligence',
    description: 'ML-driven predictions that reduce overstock, cut write-offs, and surface replenishment signals before stockouts happen.',
  },
  {
    id: 'ndn-005',
    linkPath: '/products/ndn-005',
    product: 'NDN TraceChain',
    headline: 'On-Chain Supply Chain Traceability',
    metric: 'Immutable provenance on Ethereum',
    description: 'Every product movement recorded as a verifiable on-chain event — from origin to consumer, with full audit trail.',
  },
];


function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  const runAnimation = useCallback(() => {
    if (started.current) return;
    started.current = true;
    const duration = 1400;
    const start = performance.now();
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(parseFloat((eased * target).toFixed(1)));
      if (t < 1) requestAnimationFrame(animate);
      else setVal(target);
    };
    requestAnimationFrame(animate);
  }, [target]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If already visible in viewport (above the fold), start immediately
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      runAnimation();
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) runAnimation();
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, runAnimation]);

  return <span ref={ref} aria-label={`${target}${suffix}`}>{target % 1 === 0 ? Math.round(val) : val.toFixed(1)}{suffix}</span>;
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = heroRef.current?.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.target.classList.toggle('visible', e.isIntersecting)),
      { threshold: 0.1 }
    );
    els?.forEach(el => observer.observe(el));
    setTimeout(() => els?.forEach(el => el.classList.add('visible')), 100);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <SEO
        title="NDN Analytics"
        description="NDN Analytics builds AI products and delivers enterprise AI services on Google Cloud Platform. Our blockchain solutions on Ethereum bring transparency, security, and speed to your operations."
        keywords="AI products, AI services, Google Cloud Platform, GCP, Ethereum, blockchain, enterprise AI, machine learning, smart contracts"
        canonicalPath="/"
      />
      <OrganizationSchema />
      <FAQSchema faqs={HOMEPAGE_FAQS} />
      <section className="hero-section" ref={heroRef}>
      <div className="animated-gradient" aria-hidden="true" />
      <div className="container hero-inner">
        <div className="hero-eyebrow reveal">
          <span className="hero-eyebrow-dot" />
          AI Products & Blockchain Solutions
        </div>

        <h1 className="hero-title">
          <span className="hero-title-line1 reveal stagger-1">Build Smarter.</span>
          <br />
          <span className="hero-title-line2 reveal stagger-2 text-gradient">Scale Faster.</span>
        </h1>

        <p className="hero-subtitle reveal stagger-3">
          We build focused <strong>AI products</strong> and <strong>blockchain solutions</strong> on Google Cloud Platform and Ethereum —
          purpose-built for retail, healthcare, supply chain, community finance, and diaspora networks.
        </p>

        <div className="hero-ctas reveal stagger-4">
          <Link
            to="/products"
            className="btn btn-primary"
            onClick={() => trackCTAClick('explore_products', 'hero')}
          >
            Explore Our Products →
          </Link>
          <Link
            to="/contact"
            className="btn btn-ghost"
            onClick={() => trackCTAClick('book_demo', 'hero')}
          >
            Get Started
          </Link>
        </div>

        <div className="hero-stats reveal stagger-5">
          {STATS.map(s => (
            <div className="hero-stat" key={s.label}>
              <div className="hero-stat-value">
                <CountUp target={s.value} suffix={s.suffix} />
              </div>
              <div className="hero-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Featured Products */}
        <div className="reveal stagger-6" style={{ marginTop: 64 }}>
          <div style={{
            textAlign: 'center',
            marginBottom: 28,
          }}>
            <div style={{
              fontSize: '0.7rem',
              fontFamily: "'JetBrains Mono Variable', monospace",
              color: 'var(--brand-cyan)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}>
              Featured Products
            </div>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20,
          }}>
            {FEATURED_PRODUCTS.map(fp => (
              <Link
                key={fp.id}
                to={`/products/${fp.id}`}
                style={{
                  background: 'rgba(7, 24, 41, 0.85)',
                  border: '1px solid rgba(6, 182, 212, 0.12)',
                  borderRadius: 14,
                  padding: '24px 20px',
                  backdropFilter: 'blur(8px)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                  textDecoration: 'none',
                  display: 'block',
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = fp.color; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.12)'; e.currentTarget.style.transform = 'none'; }}
                onClick={() => trackCTAClick(`featured_${fp.id}`, 'hero')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: '1.3rem' }}>{fp.icon}</span>
                  <span style={{
                    fontSize: '0.65rem',
                    fontFamily: "'JetBrains Mono Variable', monospace",
                    color: fp.color,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    background: `${fp.color}15`,
                    padding: '3px 8px',
                    borderRadius: 6,
                  }}>
                    {fp.badge}
                  </span>
                </div>
                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  fontFamily: "'Syne Variable', sans-serif",
                  color: 'var(--text-primary)',
                  marginBottom: 4,
                }}>
                  {fp.name}
                </div>
                <div style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                }}>
                  {fp.tagline}
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Link
              to="/products"
              style={{
                fontSize: '0.82rem',
                color: 'var(--brand-cyan)',
                textDecoration: 'none',
                fontFamily: "'JetBrains Mono Variable', monospace",
                letterSpacing: '0.05em',
              }}
              onClick={() => trackCTAClick('view_all_products', 'hero')}
            >
              View All 14 Products →
            </Link>
          </div>
        </div>

        {/* Product Spotlights */}
        <div className="hero-testimonials reveal stagger-6" style={{
          marginTop: 64,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
        }}>
          {PRODUCT_SPOTLIGHTS.map(ps => (
            <Link
              to={ps.linkPath}
              key={ps.id}
              style={{
                background: 'rgba(7, 24, 41, 0.85)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                borderRadius: 16,
                padding: 28,
                backdropFilter: 'blur(8px)',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
                textDecoration: 'none',
                display: 'block',
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--brand-cyan)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.25)'; e.currentTarget.style.transform = 'none'; }}
              onClick={() => trackCTAClick(`spotlight_${ps.id}`, 'hero')}
            >
              <div style={{
                fontSize: '0.7rem',
                fontFamily: "'JetBrains Mono Variable', monospace",
                color: 'var(--brand-cyan)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}>
                Product &middot; {ps.product}
              </div>
              <div style={{
                fontSize: '1.3rem',
                fontWeight: 700,
                fontFamily: "'Syne Variable', sans-serif",
                color: 'var(--text-primary)',
                marginBottom: 6,
              }}>
                {ps.headline}
              </div>
              <div style={{
                fontSize: '0.95rem',
                color: 'var(--brand-cyan)',
                fontWeight: 600,
                marginBottom: 10,
              }}>
                {ps.metric}
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: 'var(--text-tertiary)',
                lineHeight: 1.5,
              }}>
                {ps.description}
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link
            to="/products"
            style={{
              fontSize: '0.85rem',
              color: 'var(--brand-cyan)',
              textDecoration: 'none',
              fontFamily: "'JetBrains Mono Variable', monospace",
              letterSpacing: '0.05em',
            }}
            onClick={() => trackCTAClick('view_all_products_spotlight', 'hero')}
          >
            View All Products →
          </Link>
        </div>

        {/* About the Company */}
        <div className="reveal stagger-7" style={{ marginTop: 80, maxWidth: 900, marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{
            background: 'rgba(7, 24, 41, 0.6)',
            border: '1px solid rgba(6, 182, 212, 0.1)',
            borderRadius: 16,
            padding: '40px 32px',
          }}>
            <h2 style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              fontFamily: "'Syne Variable', sans-serif",
              color: 'var(--text-primary)',
              marginBottom: 20,
              textAlign: 'center',
            }}>
              Expert-Built AI and Blockchain Products
            </h2>

            <div style={{
              fontSize: '0.92rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.8,
            }}>
              <p style={{ marginBottom: 16 }}>
                <strong>NDN Analytics</strong> is a technology company founded by an experienced developer with a track record across North American and Middle Eastern markets. We build focused, well-engineered products — not broad consulting packages — across <strong>Google Cloud Platform</strong> and <strong>Ethereum</strong>, so organizations of any size can access the same enterprise-grade intelligence that large enterprises pay consultants to build from scratch.
              </p>

              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: 600,
                color: 'var(--brand-cyan)',
                marginBottom: 12,
                marginTop: 24,
              }}>
                AI Products on Google Cloud Platform
              </h3>
              <p style={{ marginBottom: 16 }}>
                Our AI products are built on Google Cloud's Vertex AI, BigQuery, and machine learning infrastructure. <strong>NDN Demand IQ</strong> uses ensemble forecasting to predict product demand at the SKU and store level, giving retailers the signal they need before stockouts happen — not after. <strong>NDN HealthPredict</strong> models patient risk factors to flag readmission candidates before discharge. <strong>NDN RetailSync</strong> synchronizes inventory data across sales channels in real time. Each product is architected to integrate with existing ERP and data infrastructure — no rip-and-replace required.
              </p>

              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: 600,
                color: 'var(--brand-cyan)',
                marginBottom: 12,
                marginTop: 24,
              }}>
                Blockchain Products on Ethereum
              </h3>
              <p style={{ marginBottom: 16 }}>
                Our blockchain products bring transparency and automation to operations that still run on paper trails and manual reconciliation. <strong>NDN TraceChain</strong> records every product movement as an immutable on-chain event, creating an audit-ready provenance record from origin to consumer. <strong>NDN PayStream</strong> automates B2B settlements through smart contract escrow — payments execute when conditions are met, without intermediaries. Our Ethereum work spans ERC-20 tokens, DeFi protocols, and secure smart contract development with a security-first design pattern.
              </p>

              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: 600,
                color: 'var(--brand-cyan)',
                marginBottom: 12,
                marginTop: 24,
              }}>
                Built to Scale. Designed to Last.
              </h3>
              <p style={{ marginBottom: 16 }}>
                Beyond the flagship products, NDN Analytics builds for the edges of the market that larger vendors overlook. <strong>NDN Njangi</strong> brings decentralized savings circle infrastructure to communities that have used informal cooperative finance for generations. <strong>TheDiaspora App</strong> gives global communities a trusted digital home for identity, discovery, culture, and opportunity. <strong>NDN NeuroQuest</strong> delivers cognitive assessment tools designed for clinical and educational settings. <strong>NDN Interpreter</strong> applies computer vision to real-time sign language translation. The full stack — <strong>GCP</strong>, <strong>Ethereum</strong>, <strong>IPFS</strong>, serverless architecture, microservices, and API-first design — is chosen for durability and interoperability, not trend-chasing.
              </p>

              <p style={{ marginTop: 24 }}>
                The company is early-stage and founder-led, which means direct technical accountability on every engagement. There is no account management layer between you and the engineer building your product. <a href="/contact" style={{ color: 'var(--brand-cyan)', textDecoration: 'none' }}>Start with a discovery call</a> — scope, architecture, and timeline in one session.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-scroll-hint">
        <div className="scroll-line" />
        <span>SCROLL</span>
      </div>
    </section>
    </>
  );
}
