import { Link } from 'react-router-dom';
import SEO from '../seo/SEO';
import { trackCTAClick, trackDemoBooking } from '../../lib/analytics';

const TIERS = [
  {
    name: 'AI Readiness Assessment',
    price: '$499',
    period: 'one-time',
    description: 'Perfect starting point to evaluate AI/blockchain opportunities for your business.',
    features: [
      '2-hour discovery workshop',
      'Current state analysis',
      'AI/Blockchain opportunity mapping',
      'Implementation roadmap',
      'ROI projection report',
      '30-day email support',
    ],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Starter',
    price: '$2,500',
    period: '/month',
    description: 'For teams deploying their first AI or blockchain solution.',
    features: [
      '1 product license',
      'Up to 50,000 API calls/month',
      'Email + chat support',
      'Standard SLA (99.5%)',
      'Analytics dashboard',
      'Single-region deployment',
    ],
    cta: 'Start Free Trial',
    highlight: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For organizations deploying intelligence at scale.',
    features: [
      'Unlimited product licenses',
      'Unlimited API calls',
      'Dedicated account manager',
      'Premium SLA (99.99%)',
      'Advanced analytics & reporting',
      'Multi-region deployment',
      'Custom integrations (SAP, Salesforce)',
      'On-premise or hybrid cloud option',
    ],
    cta: 'Contact Sales',
    highlight: true,
  },
  {
    name: 'Platform Partner',
    price: 'Revenue Share',
    period: '',
    description: 'For ISVs and system integrators building on NDN.',
    features: [
      'White-label product access',
      'Developer API & SDK access',
      'Co-marketing opportunities',
      'Revenue sharing model',
      'Technical onboarding support',
      'Priority feature requests',
    ],
    cta: 'Partner With Us',
    highlight: false,
  },
];

export default function PricingSection() {
  return (
    <>
      <SEO
        title="Pricing"
        description="Flexible enterprise pricing for NDN Analytics AI and blockchain intelligence platforms. Custom plans for startups, enterprises, and partners."
        keywords="NDN Analytics pricing, enterprise AI pricing, blockchain platform cost, custom pricing"
        canonicalPath="/pricing"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Pricing', path: '/pricing' },
        ]}
      />
      <section className="section" style={{ minHeight: '100vh', paddingTop: 120, paddingBottom: 80 }}>
        <div className="container">
          <div className="section-tag">Pricing</div>
          <h2 className="section-title" style={{ marginBottom: 16 }}>
            Plans That<br />
            <span className="text-gradient">Scale With You</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 600, marginBottom: 64, lineHeight: 1.7 }}>
            Every engagement is tailored. Start with a discovery call and we'll build a plan that matches your scale, timeline, and compliance requirements.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 32,
            alignItems: 'start',
          }}>
            {TIERS.map(tier => (
              <div key={tier.name} style={{
                background: tier.highlight
                  ? 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(59,130,246,0.08))'
                  : '#FFFFFF',
                border: tier.highlight
                  ? '2px solid #7C3AED'
                  : '1px solid #E2E8F0',
                borderRadius: 16,
                padding: 36,
                position: 'relative',
                transition: 'transform 0.3s, box-shadow 0.3s',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'none'; }}>
                {tier.highlight && (
                  <div style={{
                    position: 'absolute',
                    top: -14,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#7C3AED',
                    color: '#FFFFFF',
                    padding: '4px 16px',
                    borderRadius: 20,
                    fontSize: '0.7rem',
                    fontFamily: "'JetBrains Mono Variable', monospace",
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}>
                    Most Popular
                  </div>
                )}
                <h3 style={{
                  fontFamily: "'Syne Variable', sans-serif",
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  marginBottom: 8,
                  color: '#0F172A',
                }}>
                  {tier.name}
                </h3>
                <div style={{
                  marginBottom: 8,
                  fontFamily: "'JetBrains Mono Variable', monospace",
                }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{tier.price}</span>
                  {tier.period && <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{tier.period}</span>}
                </div>
                <p style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  marginBottom: 28,
                  lineHeight: 1.6,
                }}>
                  {tier.description}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 32 }}>
                  {tier.features.map(f => (
                    <li key={f} style={{
                      fontSize: '0.85rem',
                      color: '#475569',
                      marginBottom: 12,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                    }}>
                      <span style={{ color: '#7C3AED', flexShrink: 0, marginTop: 2 }}>&#10003;</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className={tier.highlight ? 'btn btn-primary' : 'btn btn-ghost'}
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => {
                    trackCTAClick(`pricing_${tier.name.toLowerCase().replace(/\s/g, '_')}`, 'pricing_page');
                    trackDemoBooking(`pricing_${tier.name.toLowerCase().replace(/\s/g, '_')}`);
                  }}
                >
                  {tier.cta} &rarr;
                </Link>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 80,
            padding: 48,
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: 16,
            textAlign: 'center',
          }}>
            <h3 style={{ fontFamily: "'Syne Variable', sans-serif", fontSize: '1.5rem', fontWeight: 700, marginBottom: 12, color: '#0F172A' }}>
              Need a custom solution?
            </h3>
            <p style={{ color: '#64748B', marginBottom: 28, maxWidth: 500, margin: '0 auto 28px', lineHeight: 1.7 }}>
              Every enterprise has unique requirements. Let's discuss your stack, scale, and compliance needs.
            </p>
            <Link
              to="/contact"
              className="btn btn-primary"
              onClick={() => trackCTAClick('custom_solution', 'pricing_page')}
            >
              Talk to Our Team &rarr;
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
