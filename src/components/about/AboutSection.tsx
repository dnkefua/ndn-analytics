import { useEffect, useRef } from 'react';
import SEO from '../seo/SEO';
import FAQSchema from '../seo/FAQSchema';
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
    description: 'Security and compliance are built in from the start — GDPR-ready data handling, HIPAA-aware healthcare architecture, and audit-friendly design patterns across every product.',
    color: 'var(--brand-blue)',
  },
  {
    icon: '◉',
    title: 'Built to Scale',
    description: 'Architected on GCP and Ethereum from day one — infrastructure that grows from early deployment to production load without rewrites.',
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
        description="NDN Analytics is a technology company building AI and blockchain products on Google Cloud Platform and Ethereum. Founded by an experienced developer with expertise across North American and Middle Eastern markets."
        keywords="NDN Analytics, AI products, blockchain solutions, Google Cloud, Ethereum, founder-led technology company"
        canonicalPath="/about"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ]}
      />
      <FAQSchema faqs={[
        {
          question: 'What is NDN Analytics?',
          answer: 'NDN Analytics is a technology company that builds AI and blockchain products on Google Cloud Platform and Ethereum. Founded and led by an experienced developer, we build focused products — not broad consulting packages — across demand forecasting, healthcare AI, supply chain traceability, smart contract payments, community finance, diaspora networking, and more.',
        },
        {
          question: 'What products does NDN Analytics offer?',
          answer: 'NDN Analytics offers 14 products spanning demand forecasting, healthcare AI, route optimization, churn prevention, supply chain traceability, smart contract payments, credential verification, real estate tokenization, community finance, diaspora networking, IPFS storage infrastructure, and cognitive assessment.',
        },
        {
          question: 'How does NDN Analytics integrate with existing systems?',
          answer: 'Our products are designed to integrate with existing infrastructure through REST APIs and standard data formats. They are built to work alongside ERP systems, healthcare data standards (HL7/FHIR), and common cloud data platforms — without requiring wholesale replacement of existing systems.',
        },
      ]} />
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
              NDN Analytics is a technology company founded by an experienced developer with deep expertise across AI and blockchain engineering. We build focused, well-architected products — not broad consulting packages — on Google Cloud Platform and Ethereum, so organizations of any size can access enterprise-grade intelligence without enterprise-sized procurement cycles.
            </p>
            <p className="about-para reveal stagger-3">
              Fourteen products. Two technology stacks. From demand forecasting and healthcare AI to decentralized payments, community savings circles, and diaspora networking — each one designed from working code and domain knowledge, not slide decks.
            </p>
            <div className="about-compliance reveal stagger-4">
              {['GDPR-Ready', 'HIPAA-Aware', 'Security-First', 'Audit-Friendly'].map(c => (
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

        {/* Leadership Section */}
        <div className="leadership-section">
          <div className="section-tag reveal">Leadership</div>
          <h2 className="section-title reveal stagger-1" style={{ marginBottom: 48 }}>
            Guided by<br />
            <span className="text-gradient">Vision & Expertise</span>
          </h2>
          <div className="leadership-grid reveal stagger-2">
            <div className="founder-card">
              <img
                src="/nkefua-desmond.jpg"
                alt="Nkefua Desmond, Founder & CEO"
                className="founder-image"
              />
              <h3 className="founder-name">Nkefua Desmond</h3>
              <p className="founder-title">Founder & CEO</p>
              <p className="founder-bio">
                Cameroonian-born developer with a Masters from East Central University (Ada, Oklahoma) and hands-on experience across US, Canadian, and Gulf markets. NDN Analytics Inc. is registered in Tulsa, Oklahoma; Nkefua builds from Dubai. Solo founder and engineer on every product — from the GCP AI stack to Ethereum smart contracts to the live IPFS infrastructure at NDN IPFS Chain.
              </p>
              <a
                href="https://www.linkedin.com/in/desmond-nkefua-data-analyst/?skipRedirect=true"
                target="_blank"
                rel="noopener noreferrer"
                className="founder-linkedin"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn Profile
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
