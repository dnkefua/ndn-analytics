import { Link } from 'react-router-dom';
import SEO from '../seo/SEO';

const STEPS: Array<{
  step: string;
  title: string;
  duration: string;
  body: string;
  outputs: string[];
}> = [
  {
    step: '01',
    title: 'Discovery',
    duration: '1–2 weeks',
    body:
      'A working session — not a sales pitch — to scope the problem, the data, and what success looks like. We map the workflow, identify where AI or blockchain can move the needle, and surface the assumptions everyone is making but not saying out loud.',
    outputs: [
      'A one-page problem statement signed off by your team',
      'A data and systems audit (what exists, what is missing)',
      'A short list of candidate use cases ranked by impact and feasibility',
    ],
  },
  {
    step: '02',
    title: 'Design',
    duration: '2–3 weeks',
    body:
      'A reference architecture, stack choice, and timeline you can take to your team. We decide what to build, what to buy, what to integrate, and what to defer. The design also names what we are not doing — scope discipline is how projects ship.',
    outputs: [
      'Reference architecture diagram and stack rationale',
      'Cost model for build, hosting, and ongoing operations',
      'Phased delivery plan with measurable milestones',
      'Risk register with mitigations',
    ],
  },
  {
    step: '03',
    title: 'Build',
    duration: '4–12 weeks',
    body:
      'Direct founder involvement on the build — no account-management layer between you and the engineers. We ship in weekly increments to a staging environment your team can use, so feedback loops stay tight and surprises stay small.',
    outputs: [
      'Working software deployed to staging every week',
      'Automated test coverage on critical paths',
      'Documentation written as we build, not after',
      'Read access for your engineering team from day one',
    ],
  },
  {
    step: '04',
    title: 'Deploy',
    duration: '1–2 weeks',
    body:
      'Cloud-native deployment on GCP or Ethereum, integrated with your existing stack. We handle the migration, the cutover, and the first weeks of production hand-holding. Your team learns the system by operating it with us, not by reading a runbook after we leave.',
    outputs: [
      'Production deployment with monitoring and alerting',
      'Runbook for common incidents, written by the engineers who built it',
      'Handover training for your engineering and ops teams',
      'A defined support SLA for the first 90 days',
    ],
  },
  {
    step: '05',
    title: 'Support',
    duration: 'Ongoing (optional)',
    body:
      'Ongoing model retraining, contract upgrades, and SLA-backed monitoring. We keep the system honest as your data drifts and your business changes. Some clients hand the system off entirely after the first quarter; others keep us on as a fractional team.',
    outputs: [
      'Quarterly model retraining and performance review',
      'Smart contract upgrade audits where applicable',
      'Defined response times for incident severities',
      'A roadmap review each quarter — keep building, hand off, or sunset',
    ],
  },
];

function SectionHeader({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 56 }}>
      <div style={{
        fontFamily: "'JetBrains Mono Variable', 'JetBrains Mono', monospace",
        fontSize: '0.65rem',
        letterSpacing: '0.2em',
        color: 'var(--brand-cyan)',
        textTransform: 'uppercase',
        marginBottom: 12,
      }}>
        {kicker}
      </div>
      <h1 style={{
        fontFamily: "'Syne Variable', 'Syne', sans-serif",
        fontSize: 'clamp(2rem, 5vw, 3rem)',
        fontWeight: 900,
        color: 'var(--text-primary)',
        lineHeight: 1.1,
        marginBottom: 16,
      }}>
        {title}
      </h1>
      {sub && (
        <p style={{
          fontSize: '1.05rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          maxWidth: 680,
        }}>
          {sub}
        </p>
      )}
    </div>
  );
}

export default function ProcessPage() {
  return (
    <>
      <SEO
        title="How We Work — NDN Analytics Process"
        description="Our four-step process for building production-ready AI and blockchain products: Discovery, Design, Build, Deploy — with optional ongoing Support. Founder-led, no account-management layer."
        keywords="AI development process, blockchain implementation, AI consulting methodology, NDN Analytics how we work"
        canonicalPath="/process"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Process', path: '/process' },
        ]}
      />

      <section style={{ minHeight: '100vh', padding: '120px 0 100px' }}>
        <div className="container" style={{ maxWidth: 880, margin: '0 auto' }}>

          <SectionHeader
            kicker="Process"
            title="How we work"
            sub="Five steps from first conversation to production. Each step has a defined output you can take to your team — not a slide deck, but the actual artefact. We size every engagement so the next step is always reversible."
          />

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 48, marginBottom: 80 }}>
            {STEPS.map(({ step, title, duration, body, outputs }) => (
              <div
                key={step}
                style={{
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: 32,
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 16,
                  marginBottom: 14,
                  flexWrap: 'wrap',
                }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono Variable', 'JetBrains Mono', monospace",
                    fontSize: '0.75rem',
                    color: 'var(--brand-cyan)',
                    letterSpacing: '0.15em',
                  }}>
                    {step}
                  </span>
                  <h2 style={{
                    fontFamily: "'Syne Variable', 'Syne', sans-serif",
                    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}>
                    {title}
                  </h2>
                  <span style={{
                    fontFamily: "'JetBrains Mono Variable', 'JetBrains Mono', monospace",
                    fontSize: '0.72rem',
                    color: 'var(--text-tertiary)',
                    letterSpacing: '0.12em',
                  }}>
                    {duration}
                  </span>
                </div>
                <p style={{
                  fontSize: '0.98rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.8,
                  marginBottom: 20,
                  maxWidth: 720,
                }}>
                  {body}
                </p>
                <div style={{
                  background: 'rgba(6,182,212,0.04)',
                  border: '1px solid rgba(6,182,212,0.15)',
                  borderRadius: 10,
                  padding: '18px 22px',
                }}>
                  <div style={{
                    fontFamily: "'JetBrains Mono Variable', 'JetBrains Mono', monospace",
                    fontSize: '0.65rem',
                    letterSpacing: '0.15em',
                    color: 'var(--text-tertiary)',
                    textTransform: 'uppercase',
                    marginBottom: 10,
                  }}>
                    What you get
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {outputs.map((item, i) => (
                      <li key={i} style={{
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.7,
                        marginBottom: 4,
                      }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: 48,
            textAlign: 'center',
          }}>
            <h2 style={{
              fontFamily: "'Syne Variable', 'Syne', sans-serif",
              fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 14,
            }}>
              Start with a Discovery call
            </h2>
            <p style={{
              fontSize: '0.98rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: 28,
              maxWidth: 560,
              margin: '0 auto 28px',
            }}>
              A 45-minute working session to scope your problem and see whether we are a fit. No slides, no sales pitch.
            </p>
            <Link
              to="/contact?utm_source=process&utm_medium=cta&utm_campaign=discovery_call"
              className="btn btn-primary"
            >
              Book a Discovery Call →
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}
