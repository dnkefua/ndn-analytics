import { useEffect, useRef } from 'react';
import SEO from '../seo/SEO';
import './AboutSection.css';

const VALUES = [
  {
    icon: '◈',
    title: 'Innovation',
    description: 'We pioneer at the intersection of AI and blockchain — building tools that redefine what enterprise technology can achieve.',
    color: 'var(--brand-cyan)',
  },
  {
    icon: '⬡',
    title: 'Security',
    description: 'SOC 2 Type II, ISO 27001, HIPAA, and GDPR compliance are not checkboxes — they are foundations of every product we build.',
    color: 'var(--brand-blue)',
  },
  {
    icon: '◉',
    title: 'Global Scale',
    description: 'Built on infrastructure that scales to millions of transactions, serving enterprises across continents without compromise.',
    color: 'var(--brand-purple)',
  },
  {
    icon: '★',
    title: 'Community',
    description: 'From corporate supply chains to African savings cooperatives — we believe intelligence should serve every community.',
    color: 'var(--brand-gold)',
  },
];

export default function AboutSection() {
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
    <>
      <SEO
        title="About NDN Analytics"
        description="NDN Analytics is an enterprise AI and blockchain intelligence company. We unite Google Cloud AI with Ethereum to build platforms that predict, automate, and verify at scale."
        keywords="NDN Analytics, enterprise AI company, blockchain intelligence, Google Cloud partner, Ethereum solutions"
        canonicalPath="/about"
      />
      <section className="section about-section" ref={ref}>
      <div className="container">
        <div className="about-layout">
          <div className="about-text">
            <div className="section-tag reveal">About NDN Analytics</div>
            <h2 className="section-title reveal stagger-1">
              Intelligence<br />
              <span className="text-gradient">Without Limits</span>
            </h2>
            <p className="about-para reveal stagger-2">
              NDN Analytics is an enterprise AI and blockchain intelligence company building the next generation of decision-making infrastructure. We unite the predictive power of Google Cloud AI with the immutable trust of Ethereum to create platforms that don't just analyze — they transform.
            </p>
            <p className="about-para reveal stagger-3">
              Across 10 products and two technology stacks, we serve industries from healthcare to community finance — believing that transformative intelligence should be accessible to every organization, regardless of size or geography.
            </p>
            <div className="about-compliance reveal stagger-4">
              {['SOC 2 Type II', 'ISO 27001', 'HIPAA', 'GDPR'].map(c => (
                <div key={c} className="compliance-badge">{c}</div>
              ))}
            </div>
          </div>

          <div className="about-values">
            {VALUES.map((v, i) => (
              <div className={`value-card reveal stagger-${i + 1}`} key={v.title}
                style={{ '--accent': v.color } as React.CSSProperties}>
                <div className="value-icon">{v.icon}</div>
                <h3 className="value-title">{v.title}</h3>
                <p className="value-desc">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
