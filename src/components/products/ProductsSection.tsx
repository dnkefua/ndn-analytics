import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import {
  AUTOMATION_PRODUCTS,
  DECISION_SUPPORT_PRODUCTS,
  TRUST_PRODUCTS,
  PRODUCTS,
} from './productData';
import type { Product } from '../../types';
import SEO from '../seo/SEO';
import './ProductsSection.css';

interface CapabilityBlock {
  id: string;
  label: string;
  shortLabel: string;
  icon: string;
  color: string;
  tagline: string;
  intro: string;
  products: Product[];
  deepDives: Array<{ title: string; slug: string }>;
}

const BLOCKS: CapabilityBlock[] = [
  {
    id: 'automation',
    label: 'AI Automation & Internal Tools',
    shortLabel: 'Automation',
    icon: '◆',
    color: 'var(--brand-cyan)',
    tagline: 'AI that removes manual work from teams.',
    intro:
      'Internal copilots, classroom workspaces, vision systems, and fine-tuning platforms. Built to take repetitive work off your team and put time back into the things humans do best.',
    products: AUTOMATION_PRODUCTS,
    deepDives: [
      {
        title: 'Enterprise AI Agents: A Practical ROI Blueprint for 2026 Leaders',
        slug: 'enterprise-ai-agents-roi-blueprint',
      },
    ],
  },
  {
    id: 'decision-support',
    label: 'Decision Support & Industry AI',
    shortLabel: 'Decision Support',
    icon: '◈',
    color: 'var(--brand-blue-light)',
    tagline: 'AI that helps teams make better, faster decisions.',
    intro:
      'Demand forecasting, clinical risk scoring, last-mile optimisation, churn prediction, diagnostic support. AI products that turn data your business already collects into the next decision worth making.',
    products: DECISION_SUPPORT_PRODUCTS,
    deepDives: [
      {
        title: 'Why AI Demand Forecasting Is the #1 Retail Priority in 2026',
        slug: 'ai-demand-forecasting-retail-2026',
      },
    ],
  },
  {
    id: 'trust',
    label: 'Blockchain & Trust Technologies',
    shortLabel: 'Trust',
    icon: '⬡',
    color: 'var(--brand-gold)',
    tagline: 'Blockchain, IPFS, and community-finance protocols for trust, traceability, and compliance.',
    intro:
      'For use cases that need tamper-evident records, traceability, regulatory evidence, or community-owned finance: supply-chain provenance, smart-contract payments, credential verification, real-estate tokenisation, IPFS proof layers, and the diaspora trust networks built on top of them.',
    products: TRUST_PRODUCTS,
    deepDives: [
      {
        title: 'Blockchain-Powered Supply Chain Traceability: Beyond the Hype',
        slug: 'blockchain-supply-chain-traceability',
      },
    ],
  },
];

function CapabilitySection({ block }: { block: CapabilityBlock }) {
  return (
    <div className="capability-block" id={block.id}>
      <div className="capability-header">
        <div className="capability-kicker" style={{ color: block.color }}>
          <span>{block.icon}</span>
          <span>{block.label}</span>
        </div>
        <h3 className="capability-tagline">{block.tagline}</h3>
        <p className="capability-intro">{block.intro}</p>
      </div>

      <div className="products-grid">
        {block.products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>

      {block.deepDives.length > 0 && (
        <div className="capability-deepdives">
          <div className="capability-deepdives-label">Deep dive</div>
          <ul className="capability-deepdives-list">
            {block.deepDives.map(d => (
              <li key={d.slug}>
                <Link to={`/blog/${d.slug}`} className="capability-deepdives-link">
                  {d.title} →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function ProductsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const productCount = PRODUCTS.length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.target.classList.toggle('visible', e.isIntersecting)),
      { threshold: 0.05 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <SEO
        title="Products — AI Automation, Decision Support, Blockchain & Trust"
        description={`Explore ${productCount} NDN Analytics products organised by capability: AI automation and internal tools, decision-support and industry AI, blockchain and trust technologies. Production-ready AI and blockchain products for healthcare, retail, supply chain, education, and community finance.`}
        keywords="enterprise AI products, AI automation, decision support AI, blockchain products, supply chain traceability, healthcare AI, retail forecasting, education AI, IPFS, diaspora app"
        canonicalPath="/products"
      />
      <section className="section products-section" ref={sectionRef}>
        <div className="container">
          <div className="section-tag reveal">Products</div>
          <h1 className="section-title reveal stagger-1">
            {productCount} production-ready products,<br />
            <span className="text-gradient">three capability blocks.</span>
          </h1>
          <p className="products-subtitle reveal stagger-2">
            AI products that automate work, support decisions, and create trust — built for organisations
            that need to ship, not pilot forever.
          </p>

          {/* Jump links */}
          <nav className="capability-nav reveal stagger-3" aria-label="Product capability blocks">
            {BLOCKS.map(b => (
              <a key={b.id} href={`#${b.id}`} className="capability-nav-link" style={{ '--accent': b.color } as React.CSSProperties}>
                <span>{b.icon}</span>
                <span>{b.shortLabel}</span>
              </a>
            ))}
          </nav>

          {BLOCKS.map(block => <CapabilitySection key={block.id} block={block} />)}
        </div>
      </section>
    </>
  );
}
