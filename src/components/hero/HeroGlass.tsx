import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import SEO from '../seo/SEO';
import OrganizationSchema from '../seo/OrganizationSchema';
import FAQSchema from '../seo/FAQSchema';
import { trackCTAClick } from '../../lib/analytics';
import './HeroGlass.css';

const HOMEPAGE_FAQS = [
  {
    question: 'What services does NDN Analytics provide?',
    answer:
      'NDN Analytics builds AI products and blockchain solutions. Our AI products run on Google Cloud Platform and cover demand forecasting (NDN Demand IQ), healthcare readmission prevention (NDN Care Predict), last-mile delivery routing (NDN Route AI), and SaaS churn prevention (NDN Churn Guard). Our blockchain products run on Ethereum and cover supply chain traceability (NDN TraceChain), automated B2B payments (NDN PayStream), credential verification (NDN CredVault), and real estate tokenization (NDN PropLedger).',
  },
  {
    question: 'What industries does NDN Analytics serve?',
    answer:
      'NDN Analytics targets retail and e-commerce, healthcare and pharmaceuticals, supply chain and logistics, financial services, community finance, and diaspora networks.',
  },
  {
    question: 'What results can I expect from NDN Analytics AI products?',
    answer:
      'Outcomes depend on your stack; we scope every engagement against your specific baseline rather than generic benchmarks.',
  },
];

const STATS = [
  { value: 16, label: 'Products', suffix: '' },
  { value: 2, label: 'Blockchain Networks', suffix: '' },
  { value: 99.9, label: 'Uptime Target', suffix: '%' },
];

const FEATURED_PRODUCTS = [
  { id: 'ndn-001', icon: '◈', name: 'NDN Demand IQ', tagline: 'Predict demand before it happens.', badge: 'Google Cloud', color: '#06B6D4' },
  { id: 'ndn-005', icon: '⬡', name: 'NDN TraceChain', tagline: 'Every product. Every step. On-chain.', badge: 'Ethereum', color: '#8B5CF6' },
  { id: 'ndn-006', icon: '◈', name: 'NDN PayStream', tagline: 'Payments that execute themselves.', badge: 'Ethereum', color: '#3B82F6' },
  { id: 'ndn-014', icon: 'D', name: 'TheDiaspora App', tagline: 'Connect the diaspora. Build trusted opportunity.', badge: 'Diaspora', color: '#F59E0B' },
];

const PRODUCT_SPOTLIGHTS = [
  {
    id: 'ndn-001',
    linkPath: '/products/ndn-001',
    product: 'NDN Demand IQ',
    headline: 'AI Demand Forecasting',
    metric: 'Retail & supply chain intelligence',
    description:
      'ML-driven predictions that reduce overstock, cut write-offs, and surface replenishment signals before stockouts happen.',
  },
  {
    id: 'ndn-005',
    linkPath: '/products/ndn-005',
    product: 'NDN TraceChain',
    headline: 'On-Chain Supply Chain Traceability',
    metric: 'Immutable provenance on Ethereum',
    description:
      'Every product movement recorded as a verifiable on-chain event — from origin to consumer, with full audit trail.',
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

  return (
    <span ref={ref} aria-label={`${target}${suffix}`}>
      {target % 1 === 0 ? Math.round(val) : val.toFixed(1)}
      {suffix}
    </span>
  );
}

/** A glass card that tilts in 3D toward the cursor. */
function TiltGlassCard({
  children,
  className = '',
  href,
  onClick,
  glow = '#06B6D4',
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  glow?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 220, damping: 20 });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 220, damping: 20 });
  const gxPct = useTransform(mx, v => `${(v + 0.5) * 100}%`);
  const gyPct = useTransform(my, v => `${(v + 0.5) * 100}%`);
  const sheenBg = useMotionTemplate`radial-gradient(220px circle at ${gxPct} ${gyPct}, ${glow}33, transparent 60%)`;

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const inner = (
    <motion.div
      ref={ref}
      className={`glass-card ${className}`}
      style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1000 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 250, damping: 22 }}
    >
      <motion.div
        className="glass-card__sheen"
        style={{ background: sheenBg }}
      />
      <div className="glass-card__content">{children}</div>
    </motion.div>
  );

  return href ? (
    <Link to={href} className="glass-card__link" onClick={onClick}>
      {inner}
    </Link>
  ) : (
    inner
  );
}

export default function HeroGlass() {
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

      <section className="hero-glass">
        <div className="container hero-glass__inner">
          {/* Eyebrow */}
          <motion.div
            className="hero-glass__eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="hero-glass__eyebrow-dot" />
            <span className="hero-glass__eyebrow-text">AI Products &times; Blockchain Solutions</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="hero-glass__title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <span className="hero-glass__title-l1">Build Smarter.</span>
            <br />
            <span className="hero-glass__title-l2">Scale Faster.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="hero-glass__subtitle"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32 }}
          >
            We build focused <strong>AI products</strong> and <strong>blockchain solutions</strong> on Google Cloud
            Platform and Ethereum — purpose-built for retail, healthcare, supply chain, community finance, and diaspora
            networks.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="hero-glass__ctas"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            <Link
              to="/contact"
              className="btn-glass btn-glass--primary"
              onClick={() => trackCTAClick('book_discovery_call', 'hero_glass')}
            >
              <span>Book a Discovery Call</span>
              <span className="btn-glass__arrow">→</span>
            </Link>
            <Link
              to="/products"
              className="btn-glass btn-glass--ghost"
              onClick={() => trackCTAClick('explore_products', 'hero_glass')}
            >
              <span>View Our Products</span>
            </Link>
          </motion.div>

          {/* Stats — inside a single glass strip */}
          <motion.div
            className="hero-glass__stats-strip"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            {STATS.map(s => (
              <div className="hero-glass__stat" key={s.label}>
                <div className="hero-glass__stat-value">
                  <CountUp target={s.value} suffix={s.suffix} />
                </div>
                <div className="hero-glass__stat-label">{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* How We Work */}
          <section className="hero-glass__section">
            <header className="hero-glass__section-head">
              <span className="hero-glass__kicker">How We Work</span>
              <h2 className="hero-glass__section-title">
                Discovery → Architecture → Build → Deploy → Support
              </h2>
            </header>
            <div className="hero-glass__steps">
              {[
                { step: '01', title: 'Discovery', body: 'A working session to scope the problem, the data, and what success looks like.' },
                { step: '02', title: 'Architecture', body: 'A reference architecture, stack choice, and timeline you can take to your team.' },
                { step: '03', title: 'Build', body: 'Direct founder involvement on the build — no account-management layer.' },
                { step: '04', title: 'Deploy', body: 'Cloud-native deployment on GCP or Ethereum, integrated with your existing stack.' },
                { step: '05', title: 'Support', body: 'Ongoing model retraining, contract upgrades, and SLA-backed monitoring.' },
              ].map(s => (
                <TiltGlassCard key={s.step} glow="#06B6D4">
                  <div className="hero-glass__step-num">STEP {s.step}</div>
                  <div className="hero-glass__step-title">{s.title}</div>
                  <div className="hero-glass__step-body">{s.body}</div>
                </TiltGlassCard>
              ))}
            </div>
          </section>

          {/* Featured Products */}
          <section className="hero-glass__section">
            <header className="hero-glass__section-head hero-glass__section-head--center">
              <span className="hero-glass__kicker">Featured Products</span>
              <h2 className="hero-glass__section-title">Engineered for outcomes, not slideware</h2>
            </header>
            <div className="hero-glass__featured">
              {FEATURED_PRODUCTS.map(fp => (
                <TiltGlassCard
                  key={fp.id}
                  href={`/products/${fp.id}`}
                  glow={fp.color}
                  onClick={() => trackCTAClick(`featured_${fp.id}`, 'hero_glass')}
                >
                  <div className="hero-glass__featured-head">
                    <span className="hero-glass__featured-icon" style={{ color: fp.color }}>{fp.icon}</span>
                    <span className="hero-glass__featured-badge" style={{ color: fp.color, background: `${fp.color}1A`, borderColor: `${fp.color}40` }}>
                      {fp.badge}
                    </span>
                  </div>
                  <div className="hero-glass__featured-name">{fp.name}</div>
                  <div className="hero-glass__featured-tag">{fp.tagline}</div>
                </TiltGlassCard>
              ))}
            </div>
            <div className="hero-glass__cta-row">
              <Link
                to="/products"
                className="hero-glass__inline-link"
                onClick={() => trackCTAClick('view_all_products', 'hero_glass')}
              >
                View All 16 Products →
              </Link>
            </div>
          </section>

          {/* Product Spotlights */}
          <section className="hero-glass__section">
            <header className="hero-glass__section-head">
              <span className="hero-glass__kicker">Product Spotlights</span>
              <h2 className="hero-glass__section-title">Two flagships pushing the stack forward</h2>
            </header>
            <div className="hero-glass__spotlights">
              {PRODUCT_SPOTLIGHTS.map(ps => (
                <TiltGlassCard
                  key={ps.id}
                  href={ps.linkPath}
                  glow="#06B6D4"
                  onClick={() => trackCTAClick(`spotlight_${ps.id}`, 'hero_glass')}
                >
                  <div className="hero-glass__kicker hero-glass__kicker--inline">
                    Product · {ps.product}
                  </div>
                  <div className="hero-glass__spotlight-headline">{ps.headline}</div>
                  <div className="hero-glass__spotlight-metric">{ps.metric}</div>
                  <div className="hero-glass__spotlight-body">{ps.description}</div>
                </TiltGlassCard>
              ))}
            </div>
          </section>

          {/* About */}
          <section className="hero-glass__section">
            <div className="hero-glass__about">
              <h2 className="hero-glass__about-title">Expert-Built AI and Blockchain Products</h2>
              <p>
                <strong>NDN Analytics</strong> is a technology company founded by an experienced developer with a track
                record across North American and Middle Eastern markets. We build focused, well-engineered products —
                not broad consulting packages — across <strong>Google Cloud Platform</strong> and{' '}
                <strong>Ethereum</strong>, so organizations of any size can access the same enterprise-grade
                intelligence that large enterprises pay consultants to build from scratch.
              </p>

              <h3>AI Products on Google Cloud Platform</h3>
              <p>
                Our AI products are built on Google Cloud's Vertex AI, BigQuery, and machine learning infrastructure.{' '}
                <strong>NDN Demand IQ</strong> uses ensemble forecasting to predict product demand at the SKU and store
                level. <strong>NDN Care Predict</strong> models patient risk factors to flag readmission candidates
                before discharge. <strong>NDN Route AI</strong> solves last-mile vehicle routing for thousands of stops
                in seconds. <strong>NDN Churn Guard</strong> surfaces at-risk SaaS accounts 45+ days before renewal.
              </p>

              <h3>Blockchain Products on Ethereum</h3>
              <p>
                Our blockchain products bring transparency and automation to operations that still run on paper trails
                and manual reconciliation. <strong>NDN TraceChain</strong> records every product movement as an
                immutable on-chain event. <strong>NDN PayStream</strong> automates B2B settlements through smart
                contract escrow — payments execute when conditions are met, without intermediaries.
              </p>

              <p>
                The company is early-stage and founder-led, which means direct technical accountability on every
                engagement.{' '}
                <Link to="/contact" className="hero-glass__inline-link">
                  Start with a discovery call →
                </Link>
              </p>
            </div>
          </section>
        </div>

        <div className="hero-glass__scroll">
          <div className="hero-glass__scroll-line" />
          <span>SCROLL</span>
        </div>
      </section>
    </>
  );
}
