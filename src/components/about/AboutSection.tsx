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
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ]}
      />
      <FAQSchema faqs={[
        {
          question: 'What is NDN Analytics?',
          answer: 'NDN Analytics is an enterprise AI and blockchain intelligence platform that converges Google Cloud AI with Ethereum blockchain technology to deliver predictive, automated, and verifiable intelligence solutions at scale.',
        },
        {
          question: 'What products does NDN Analytics offer?',
          answer: 'NDN Analytics offers 10 enterprise products spanning demand forecasting, healthcare AI, route optimization, churn prevention, supply chain traceability, smart contract payments, credential verification, real estate tokenization, community finance, and cognitive intelligence.',
        },
        {
          question: 'How does NDN Analytics integrate with existing systems?',
          answer: 'Our products integrate natively with enterprise systems including SAP, Salesforce, Snowflake, Epic, Cerner, Oracle Health, and major CRM/CSM platforms through REST APIs and HL7/FHIR standards.',
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
                Cameroonian-born data analyst and AI architect with advanced expertise spanning North America and the Gulf. Masters degree from East Central University (Ada, Oklahoma) combined with deep experience across US, Canadian, and Middle Eastern markets. Driving NDN Analytics' vision to democratize enterprise intelligence across AI and blockchain ecosystems.
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
