import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../seo/SEO';
import OrganizationSchema from '../seo/OrganizationSchema';
import { trackCTAClick } from '../../lib/analytics';
import './Hero.css';

const STATS = [
  { value: 99.9, label: 'Uptime SLA', suffix: '%' },
  { value: 2,  label: 'Blockchain Networks', suffix: '' },
  { value: 24, label: 'Hour Support', suffix: '/7' },
];

const TESTIMONIALS = [
  {
    quote: "NDN's AI forecasting cut our operational costs by 40%. The GCP integration was seamless and the results were immediate.",
    name: "Sarah Chen",
    role: "VP Operations",
    company: "TechScale Inc",
  },
  {
    quote: "Their Solana-based payment solution gave us sub-second settlements. Game-changer for our global marketplace.",
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

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
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
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{target % 1 === 0 ? Math.round(val) : val.toFixed(1)}{suffix}</span>;
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
        description="NDN Analytics builds AI products and delivers enterprise AI services on Google Cloud Platform. Our blockchain solutions on Ethereum and Solana bring transparency, security, and speed to your operations."
        keywords="AI products, AI services, Google Cloud Platform, GCP, Ethereum, Solana, blockchain, enterprise AI, machine learning"
        canonicalPath="/"
      />
      <OrganizationSchema />
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
          Our blockchain solutions on <strong>Ethereum</strong> and <strong>Solana</strong> bring transparency, security, and speed to your operations.
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

        <div className="hero-testimonials reveal stagger-6" style={{
          marginTop: 64,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
        }}>
          {TESTIMONIALS.map(t => (
            <div key={t.company} style={{
              background: '#FFFFFF',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              borderRadius: 16,
              padding: 24,
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.06)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
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
                  background: 'linear-gradient(135deg, #EC4899, #7C3AED, #3B82F6)',
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
      </div>

      <div className="hero-scroll-hint">
        <div className="scroll-line" />
        <span>SCROLL</span>
      </div>
    </section>
    </>
  );
}
