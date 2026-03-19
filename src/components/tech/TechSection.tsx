import { useEffect, useRef } from 'react';
import './TechSection.css';

const GCLOUD_STACK = [
  { name: 'Vertex AI', description: 'Custom ML model training & deployment' },
  { name: 'BigQuery ML', description: 'In-database machine learning at scale' },
  { name: 'Cloud Run', description: 'Serverless container execution' },
  { name: 'Pub/Sub', description: 'Real-time event streaming infrastructure' },
  { name: 'Dataflow', description: 'Unified batch and stream processing' },
  { name: 'Cloud Spanner', description: 'Globally distributed relational database' },
  { name: 'Looker', description: 'Enterprise business intelligence platform' },
  { name: 'Cloud Armor', description: 'DDoS protection & WAF security layer' },
];

const ETH_STACK = [
  { name: 'Solidity', description: 'Smart contract development language' },
  { name: 'Hardhat', description: 'Ethereum development environment' },
  { name: 'IPFS', description: 'Decentralized content-addressed storage' },
  { name: 'The Graph', description: 'Decentralized blockchain data indexing' },
  { name: 'OpenZeppelin', description: 'Audited smart contract libraries' },
  { name: 'Chainlink', description: 'Decentralized oracle network' },
  { name: 'Ethers.js', description: 'Ethereum JavaScript interaction library' },
  { name: 'Polygon', description: 'Layer 2 scaling & low-cost transactions' },
];

export default function TechSection() {
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
    <section className="section tech-section" ref={ref}>
      <div className="container">
        <div className="section-tag reveal">Technology</div>
        <h2 className="section-title reveal stagger-1">
          Dual-Stack<br />
          <span className="text-gradient">Architecture</span>
        </h2>
        <p className="tech-subtitle reveal stagger-2">
          Best-in-class tooling from both worlds — Google's AI supremacy meets Ethereum's cryptographic trust.
        </p>

        <div className="tech-columns">
          <div className="tech-column reveal stagger-2">
            <div className="tech-col-header" style={{ color: 'var(--brand-cyan)' }}>
              <span className="tech-col-icon">☁</span>
              Google Cloud AI
            </div>
            {GCLOUD_STACK.map(item => (
              <div className="tech-item" key={item.name}>
                <span className="tech-dot" style={{ background: 'var(--brand-cyan)', boxShadow: '0 0 6px var(--brand-cyan)' }} />
                <div>
                  <div className="tech-item-name">{item.name}</div>
                  <div className="tech-item-desc">{item.description}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="tech-divider reveal stagger-3" />

          <div className="tech-column reveal stagger-4">
            <div className="tech-col-header" style={{ color: 'var(--brand-blue-light)' }}>
              <span className="tech-col-icon">⬡</span>
              Ethereum Stack
            </div>
            {ETH_STACK.map(item => (
              <div className="tech-item" key={item.name}>
                <span className="tech-dot" style={{ background: 'var(--brand-blue-light)', boxShadow: '0 0 6px var(--brand-blue-light)' }} />
                <div>
                  <div className="tech-item-name">{item.name}</div>
                  <div className="tech-item-desc">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
