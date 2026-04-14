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
    answer: 'NDN Analytics provides enterprise AI services and blockchain solutions. We build AI products on Google Cloud Platform including demand forecasting (NDN Demand IQ), healthcare AI (NDN HealthPredict), and inventory optimization. Our blockchain solutions on Ethereum include supply chain traceability (NDN TraceChain), automated B2B payments (NDN PayStream), and smart contract development.',
  },
  {
    question: 'What industries does NDN Analytics serve?',
    answer: 'NDN Analytics serves retail and e-commerce, healthcare and pharmaceuticals, supply chain and logistics, financial services, and manufacturing industries. We specialize in demand forecasting for retail, patient outcome prediction for healthcare, end-to-end traceability for supply chains, and smart contract automation for financial services.',
  },
  {
    question: 'What results can I expect from NDN Analytics AI products?',
    answer: 'Our clients typically see 40-45% reduction in operational costs, 45% reduction in stockouts for retail, 100% FDA compliance for pharmaceutical supply chains, and $4.2M+ in annual savings. We maintain a 99.9% uptime SLA across all enterprise deployments with 24/7 support.',
  },
  {
    question: 'What technologies does NDN Analytics use?',
    answer: 'We leverage Google Cloud Platform (Vertex AI, BigQuery, Cloud Functions, Firestore) for AI and machine learning solutions. For blockchain, we develop on Ethereum using Solidity, Web3.js, Hardhat, and DeFi protocols. Our tech stack includes TensorFlow, PyTorch, serverless architecture, microservices, and API-first design patterns.',
  },
  {
    question: 'How does NDN Demand IQ work?',
    answer: 'NDN Demand IQ is an AI-powered demand forecasting solution that analyzes historical sales data, market trends, seasonality, and external factors to predict future demand with high accuracy. It integrates seamlessly with existing ERP and inventory systems, providing actionable insights that help retailers optimize stock levels, reduce stockouts by up to 45%, and cut carrying costs by 40%.',
  },
  {
    question: 'What is NDN TraceChain and how does it improve supply chain?',
    answer: 'NDN TraceChain is an Ethereum blockchain-based supply chain traceability solution that creates an immutable record of every product movement from origin to consumer. It enables 100% transparency, ensures regulatory compliance (including FDA requirements), reduces audit times by 85%, and provides real-time visibility into supply chain operations.',
  },
  {
    question: 'Does NDN Analytics provide custom AI development?',
    answer: 'Yes, NDN Analytics offers custom AI development services including fine-tuning existing models for specific business needs, building custom machine learning solutions, integrating AI into existing workflows, and providing end-to-end implementation from strategy to deployment. Our NDN FineTune service specializes in custom AI model development and deployment.',
  },
  {
    question: 'How can I get started with NDN Analytics?',
    answer: 'Getting started is easy. Contact us through our website at https://www.ndnanalytics.com/contact to schedule a consultation. We offer free discovery sessions to understand your business challenges and recommend the right AI or blockchain solution. Our team will guide you through the entire process from initial assessment to implementation and ongoing optimization.',
  },
];

const STATS = [
  { value: 99.9, label: 'Uptime SLA', suffix: '%' },
  { value: 2,  label: 'Blockchain Networks', suffix: '' },
  { value: 24, label: 'Hour Support', suffix: '/7' },
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
];

const CASE_STUDY_HIGHLIGHTS = [
  {
    slug: 'regional-grocery-demand-forecasting',
    product: 'NDN Demand IQ',
    headline: '45% Stockout Reduction',
    metric: '$4.2M annual savings',
    client: 'Regional Grocery Chain — 150+ stores',
  },
  {
    slug: 'pharma-supply-chain-traceability',
    product: 'NDN TraceChain',
    headline: '100% FDA Compliance',
    metric: '85% faster audits',
    client: 'National Pharma Distributor — $5.3B volume',
  },
];

const TESTIMONIALS = [
  {
    quote: "NDN's AI forecasting cut our operational costs by 40%. The GCP integration was seamless and the results were immediate.",
    name: "Sarah Chen",
    role: "VP Operations",
    company: "TechScale Inc",
  },
  {
    quote: "NDN's Ethereum smart contract escrow system gave us automated, trustless B2B settlements. Game-changer for our global marketplace.",
    name: "Dr. James Okafor",
    role: "CTO",
    company: "PayFlow Global",
  },
  {
    quote: "The Ethereum smart contracts NDN built automate 80% of our compliance workflows. Outstanding engineering team.",
    name: "Maria Rodriguez",
    role: "CFO",
    company: "FinSecure Corp",
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
          We build cutting-edge <strong>AI products</strong> and deliver <strong>enterprise AI services</strong> powered by Google Cloud Platform.
          Our blockchain solutions on <strong>Ethereum</strong> bring transparency, security, and speed to your operations.
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
              View All 11 Products →
            </Link>
          </div>
        </div>

        {/* Case Studies */}
        <div className="hero-testimonials reveal stagger-6" style={{
          marginTop: 64,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
        }}>
          {CASE_STUDY_HIGHLIGHTS.map(cs => (
            <Link
              to={`/case-studies/${cs.slug}`}
              key={cs.slug}
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
              onClick={() => trackCTAClick(`case_study_${cs.slug}`, 'hero')}
            >
              <div style={{
                fontSize: '0.7rem',
                fontFamily: "'JetBrains Mono Variable', monospace",
                color: 'var(--brand-cyan)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}>
                Case Study &middot; {cs.product}
              </div>
              <div style={{
                fontSize: '1.3rem',
                fontWeight: 700,
                fontFamily: "'Syne Variable', sans-serif",
                color: 'var(--text-primary)',
                marginBottom: 6,
              }}>
                {cs.headline}
              </div>
              <div style={{
                fontSize: '0.95rem',
                color: 'var(--brand-cyan)',
                fontWeight: 600,
                marginBottom: 10,
              }}>
                {cs.metric}
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: 'var(--text-tertiary)',
              }}>
                {cs.client}
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link
            to="/case-studies"
            style={{
              fontSize: '0.85rem',
              color: 'var(--brand-cyan)',
              textDecoration: 'none',
              fontFamily: "'JetBrains Mono Variable', monospace",
              letterSpacing: '0.05em',
            }}
            onClick={() => trackCTAClick('view_all_case_studies', 'hero')}
          >
            View All Case Studies →
          </Link>
        </div>

        <div className="hero-testimonials reveal stagger-7" style={{
          marginTop: 48,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
        }}>
          {TESTIMONIALS.map(t => (
            <div key={t.company} style={{
              background: 'rgba(7, 24, 41, 0.85)',
              border: '1px solid rgba(6, 182, 212, 0.15)',
              borderRadius: 16,
              padding: 24,
              backdropFilter: 'blur(8px)',
              transition: 'transform 0.2s ease, border-color 0.2s ease',
            }}>
              <p style={{
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                marginBottom: 16,
                fontStyle: 'italic',
              }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Syne Variable', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: '#fff',
                }}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{t.role}, {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SEO Content Section - 500+ Words for AI Crawlers */}
        <div className="reveal stagger-8" style={{ marginTop: 80, maxWidth: 900, marginLeft: 'auto', marginRight: 'auto' }}>
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
              Enterprise AI and Blockchain Solutions
            </h2>
            
            <div style={{
              fontSize: '0.92rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.8,
            }}>
              <p style={{ marginBottom: 16 }}>
                <strong>NDN Analytics</strong> is a leading technology company specializing in enterprise AI services and blockchain solutions. We help organizations across retail, healthcare, supply chain, and financial services build smarter systems and scale their operations faster. Our expert team combines deep expertise in <strong>Google Cloud Platform</strong> technologies with cutting-edge <strong>Ethereum blockchain</strong> development to deliver transformative results.
              </p>
              
              <h3 style={{ 
                fontSize: '1.1rem', 
                fontWeight: 600, 
                color: 'var(--brand-cyan)',
                marginBottom: 12,
                marginTop: 24,
              }}>
                AI-Powered Enterprise Solutions
              </h3>
              <p style={{ marginBottom: 16 }}>
                Our AI products leverage Google Cloud's Vertex AI, BigQuery, and machine learning capabilities to solve complex business challenges. <strong>NDN Demand IQ</strong> uses advanced forecasting algorithms to predict product demand with remarkable accuracy, helping retailers reduce stockouts by up to 45% and cut operational costs by 40%. In healthcare, our <strong>NDN HealthPredict</strong> platform analyzes patient data to prevent hospital readmissions, improving outcomes while reducing costs. We also offer <strong>NDN RetailSync</strong> for real-time inventory management across multiple sales channels, ensuring optimal stock levels and customer satisfaction.
              </p>
              
              <h3 style={{ 
                fontSize: '1.1rem', 
                fontWeight: 600, 
                color: 'var(--brand-cyan)',
                marginBottom: 12,
                marginTop: 24,
              }}>
                Blockchain Development on Ethereum
              </h3>
              <p style={{ marginBottom: 16 }}>
                Our blockchain solutions bring transparency, security, and automation to enterprise operations. <strong>NDN TraceChain</strong> provides end-to-end supply chain traceability, enabling companies to track products from origin to consumer with immutable blockchain records. For pharmaceutical and healthcare companies, our solutions ensure <strong>100% FDA compliance</strong> and reduce audit times by 85%. <strong>NDN PayStream</strong> automates B2B payment processing using smart contracts, eliminating manual reconciliation and ensuring trustless escrow for high-value transactions. Our Ethereum expertise includes ERC-20 token development, DeFi protocols, and secure smart contract auditing.
              </p>
              
              <h3 style={{ 
                fontSize: '1.1rem', 
                fontWeight: 600, 
                color: 'var(--brand-cyan)',
                marginBottom: 12,
                marginTop: 24,
              }}>
                Proven Results and Client Success
              </h3>
              <p style={{ marginBottom: 16 }}>
                We deliver measurable business outcomes. Our clients report average cost savings of <strong>$4.2 million annually</strong>, with supply chain efficiency improvements of up to 85%. We maintain a <strong>99.9% uptime SLA</strong> across all enterprise deployments, backed by 24/7 support from our dedicated success teams. Our case studies demonstrate real-world impact: a regional grocery chain with 150+ stores reduced stockouts by 45%, while a national pharmaceutical distributor with $5.3 billion in volume achieved complete FDA compliance and dramatically faster audit processes.
              </p>
              
              <h3 style={{ 
                fontSize: '1.1rem', 
                fontWeight: 600, 
                color: 'var(--brand-cyan)',
                marginBottom: 12,
                marginTop: 24,
              }}>
                Comprehensive Technology Stack
              </h3>
              <p style={{ marginBottom: 16 }}>
                We work with modern technology stacks including <strong>Google Cloud Platform</strong> (Vertex AI, Cloud Functions, Firestore, BigQuery), <strong>Ethereum blockchain</strong> (Solidity, Hardhat, Web3.js), and various AI/ML frameworks (TensorFlow, PyTorch). Our team specializes in serverless architecture, microservices, and API-first design patterns. We also develop specialized platforms like <strong>NDN Njangi</strong> for decentralized savings circles, <strong>NDN NeuroQuest</strong> for cognitive assessment, and <strong>NDN Interpreter</strong> for real-time sign language translation using computer vision.
              </p>
              
              <p style={{ marginTop: 24 }}>
                Contact NDN Analytics today to learn how our AI and blockchain solutions can transform your enterprise operations. We offer end-to-end implementation services from strategy and architecture to deployment and ongoing optimization, ensuring your technology investments deliver maximum return.
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
