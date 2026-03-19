import { useEffect, useRef } from 'react';
import './SolutionsSection.css';

const SOLUTIONS = [
  {
    industry: 'Healthcare',
    icon: '⚕',
    description: 'Predict patient outcomes, prevent readmissions, and optimize clinical workflows with HIPAA-compliant AI.',
    products: ['NDN Care Predict'],
    color: 'var(--brand-cyan)',
  },
  {
    industry: 'Retail',
    icon: '◈',
    description: 'Transform demand forecasting and inventory management with AI that learns from millions of SKUs.',
    products: ['NDN Demand IQ'],
    color: 'var(--brand-blue)',
  },
  {
    industry: 'Logistics',
    icon: '◉',
    description: 'Optimize every last mile with real-time AI routing and fleet intelligence that cuts costs dynamically.',
    products: ['NDN Route AI', 'NDN TraceChain'],
    color: 'var(--brand-cyan)',
  },
  {
    industry: 'Real Estate',
    icon: '⬡',
    description: 'Tokenize assets, enable fractional ownership, and automate transactions with blockchain infrastructure.',
    products: ['NDN PropLedger'],
    color: 'var(--brand-blue)',
  },
  {
    industry: 'Luxury & Pharma',
    icon: '◎',
    description: 'Cryptographically authenticate every product from origin to consumer. Zero counterfeiting tolerance.',
    products: ['NDN TraceChain', 'NDN CredVault'],
    color: 'var(--brand-purple)',
  },
  {
    industry: 'Community Finance',
    icon: '★',
    description: 'Digitize traditional savings cooperatives with decentralized smart contract governance and transparency.',
    products: ['Njangi'],
    color: 'var(--brand-gold)',
  },
];

export default function SolutionsSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.target.classList.toggle('visible', e.isIntersecting)),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section solutions-section" ref={ref}>
      <div className="container">
        <div className="section-tag reveal">Solutions</div>
        <h2 className="section-title reveal stagger-1">
          Built for Every<br />
          <span className="text-gradient">Critical Vertical</span>
        </h2>
        <p className="solutions-subtitle reveal stagger-2">
          Industry-tailored intelligence platforms designed for the specific challenges of enterprise sectors.
        </p>

        <div className="solutions-grid">
          {SOLUTIONS.map((s, i) => (
            <div className={`solution-card reveal stagger-${(i % 3) + 1}`} key={s.industry}
              style={{ '--accent': s.color } as React.CSSProperties}>
              <div className="solution-icon">{s.icon}</div>
              <h3 className="solution-industry">{s.industry}</h3>
              <p className="solution-desc">{s.description}</p>
              <div className="solution-products">
                {s.products.map(p => (
                  <span key={p} className="solution-product-tag">{p}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
