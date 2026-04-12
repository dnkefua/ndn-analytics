import SEO from '../seo/SEO';

const LAST_UPDATED = 'June 2025';

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} style={{ marginBottom: 56 }}>
      <h2 style={{
        fontFamily: "'Syne Variable', 'Syne', sans-serif",
        fontSize: 'clamp(1.15rem, 2vw, 1.4rem)',
        fontWeight: 700,
        color: 'var(--brand-cyan)',
        marginBottom: 16,
        paddingBottom: 10,
        borderBottom: '1px solid var(--border-subtle)',
      }}>{title}</h2>
      {children}
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: '0.92rem',
      color: 'var(--text-secondary)',
      lineHeight: 1.85,
      marginBottom: 14,
    }}>{children}</p>
  );
}

function Ul({ items }: { items: React.ReactNode[] }) {
  return (
    <ul style={{ paddingLeft: 20, marginBottom: 14 }}>
      {items.map((item, i) => (
        <li key={i} style={{
          fontSize: '0.92rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.85,
          marginBottom: 6,
        }}>{item}</li>
      ))}
    </ul>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{
      fontFamily: "'Syne Variable', 'Syne', sans-serif",
      fontSize: '0.95rem',
      fontWeight: 700,
      color: 'var(--text-primary)',
      marginBottom: 8,
      marginTop: 20,
    }}>{children}</h3>
  );
}

export default function PrivacyPolicy() {
  return (
    <>
      <SEO
        title="Privacy Policy — NDN Analytics"
        description="NDN Analytics privacy policy covering data collection, third-party services (Google Analytics, Firebase, Stripe, Anthropic), GDPR rights, and contact information."
        keywords="NDN Analytics privacy policy, GDPR, data collection, cookies"
        canonicalPath="/privacy"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Privacy Policy', path: '/privacy' },
        ]}
      />

      <section style={{ minHeight: '100vh', padding: '120px 0 100px' }}>
        <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ marginBottom: 56 }}>
            <div style={{
              fontFamily: "'JetBrains Mono Variable', 'JetBrains Mono', monospace",
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              color: 'var(--brand-cyan)',
              textTransform: 'uppercase',
              marginBottom: 12,
            }}>
              Legal
            </div>
            <h1 style={{
              fontFamily: "'Syne Variable', 'Syne', sans-serif",
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 900,
              color: 'var(--text-primary)',
              lineHeight: 1.1,
              marginBottom: 16,
            }}>
              Privacy Policy
            </h1>
            <p style={{
              fontSize: '0.85rem',
              color: 'var(--text-tertiary)',
              fontFamily: "'JetBrains Mono Variable', 'JetBrains Mono', monospace",
            }}>
              Last updated: {LAST_UPDATED}
            </p>
          </div>

          {/* Table of Contents */}
          <div style={{
            background: 'rgba(6,182,212,0.04)',
            border: '1px solid rgba(6,182,212,0.15)',
            borderRadius: 12,
            padding: '24px 28px',
            marginBottom: 56,
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono Variable', 'JetBrains Mono', monospace",
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              marginBottom: 14,
            }}>
              Contents
            </div>
            {[
              ['#overview', '1. Overview'],
              ['#data-collected', '2. Data We Collect'],
              ['#how-we-use', '3. How We Use Your Data'],
              ['#third-parties', '4. Third-Party Services'],
              ['#cookies', '5. Cookies & Tracking'],
              ['#gdpr', '6. Your GDPR Rights'],
              ['#retention', '7. Data Retention'],
              ['#children', '8. Children\'s Privacy'],
              ['#changes', '9. Changes to This Policy'],
              ['#contact', '10. Contact Us'],
            ].map(([href, label]) => (
              <div key={href} style={{ marginBottom: 6 }}>
                <a
                  href={href}
                  style={{
                    fontSize: '0.88rem',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseOver={e => (e.currentTarget.style.color = 'var(--brand-cyan)')}
                  onMouseOut={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  {label}
                </a>
              </div>
            ))}
          </div>

          {/* Sections */}

          <Section id="overview" title="1. Overview">
            <P>
              NDN Analytics, Inc. ("NDN Analytics", "we", "us", or "our") operates
              the website at <strong>ndnanalytics.com</strong> and the related AI and blockchain
              analytics services described herein. This Privacy Policy explains how we collect,
              use, store, disclose, and protect your personal information when you visit our site
              or use our services.
            </P>
            <P>
              By using our website, you agree to the collection and use of information as described
              in this policy. If you do not agree, please discontinue use of the site.
            </P>
          </Section>

          <Section id="data-collected" title="2. Data We Collect">
            <SubHeading>Information you provide directly</SubHeading>
            <Ul items={[
              'Name and email address submitted via contact forms or newsletter signup.',
              'Payment information (billing name, email) submitted during checkout. Card details are processed directly by Stripe and are never stored on our servers.',
              'Messages and queries you send to our ARIA AI assistant (stored to improve service quality and for abuse prevention).',
            ]} />

            <SubHeading>Information collected automatically</SubHeading>
            <Ul items={[
              'IP address, browser type, operating system, and referring URL.',
              'Pages visited, time on site, and click events via Google Analytics 4.',
              'Affiliate referral codes embedded in URLs (stored anonymously to attribute traffic sources).',
              'Cookies and similar tracking technologies (see Section 5).',
            ]} />

            <SubHeading>Data stored in our systems (Firestore)</SubHeading>
            <Ul items={[
              <><strong>leads</strong> — name, email, company, message from contact form submissions.</>,
              <><strong>ariaConversations</strong> — session ID, messages exchanged with the ARIA AI assistant, timestamps.</>,
              <><strong>purchases</strong> — Stripe session ID, product purchased, buyer email, purchase timestamp. No card numbers are stored.</>,
              <><strong>affiliateClicks</strong> — referral code, timestamp, anonymized source metadata.</>,
              <><strong>emailQueue</strong> — outbound email jobs (email address, template, metadata). Processed and purged automatically.</>,
            ]} />
          </Section>

          <Section id="how-we-use" title="3. How We Use Your Data">
            <Ul items={[
              'To respond to contact form inquiries and support requests.',
              'To fulfil purchases and send transactional confirmation emails.',
              'To operate the ARIA AI assistant and improve its responses.',
              'To send the NDN Intelligence monthly newsletter (only if you have subscribed; unsubscribe at any time via the link in each email).',
              'To analyse site traffic, measure marketing campaign performance, and improve our services.',
              'To attribute traffic from affiliate and partner referral links.',
              'To detect and prevent fraud, abuse, and security threats.',
              'To comply with legal obligations.',
            ]} />
            <P>
              We do not sell, rent, or trade your personal information to third parties for
              their marketing purposes.
            </P>
          </Section>

          <Section id="third-parties" title="4. Third-Party Services">
            <P>
              We use the following third-party providers. Each operates under its own privacy
              policy and data processing agreements:
            </P>

            <SubHeading>Google Analytics 4 (Google LLC)</SubHeading>
            <P>
              We use GA4 (measurement ID: G-BJ3NFEX2NW) to collect anonymised usage data.
              Google may transfer data to servers in the United States. You can opt out by
              installing the{' '}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--brand-cyan)', textDecoration: 'none' }}
              >
                Google Analytics Opt-out Browser Add-on
              </a>.
              Privacy policy:{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--brand-cyan)', textDecoration: 'none' }}
              >
                policies.google.com/privacy
              </a>
            </P>

            <SubHeading>Firebase / Google Cloud (Google LLC)</SubHeading>
            <P>
              Our backend infrastructure, database (Firestore), and hosting run on
              Firebase and Google Cloud Platform. Data is stored in Google-managed data
              centres. Google Cloud complies with GDPR and holds ISO 27001 / SOC 2 certifications.
            </P>

            <SubHeading>Stripe (Stripe, Inc.)</SubHeading>
            <P>
              Payments are processed by Stripe. When you complete a purchase, you enter
              your card details directly on Stripe-hosted fields — NDN Analytics never
              sees or stores raw card data. Stripe is PCI DSS Level 1 compliant.
              Privacy policy:{' '}
              <a
                href="https://stripe.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--brand-cyan)', textDecoration: 'none' }}
              >
                stripe.com/privacy
              </a>
            </P>

            <SubHeading>Resend (Resend, Inc.)</SubHeading>
            <P>
              Transactional emails (purchase confirmations, contact replies) are delivered
              via Resend. Your email address is transmitted to Resend solely to deliver
              these messages. Privacy policy:{' '}
              <a
                href="https://resend.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--brand-cyan)', textDecoration: 'none' }}
              >
                resend.com/legal/privacy-policy
              </a>
            </P>

            <SubHeading>EmailJS</SubHeading>
            <P>
              The contact form uses EmailJS to route submissions to our inbox. Your name,
              email, and message are transmitted to EmailJS for delivery. No data is retained
              by EmailJS beyond delivery. Privacy policy:{' '}
              <a
                href="https://www.emailjs.com/legal/privacy-policy/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--brand-cyan)', textDecoration: 'none' }}
              >
                emailjs.com/legal/privacy-policy
              </a>
            </P>

            <SubHeading>Anthropic (ARIA AI Assistant)</SubHeading>
            <P>
              Our ARIA assistant is powered by Anthropic's Claude API. Queries you send to
              ARIA are forwarded to Anthropic's API for processing. Anthropic does not use
              API inputs to train models by default. Sessions are also stored in Firestore
              for quality assurance and abuse prevention. Privacy policy:{' '}
              <a
                href="https://www.anthropic.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--brand-cyan)', textDecoration: 'none' }}
              >
                anthropic.com/privacy
              </a>
            </P>
          </Section>

          <Section id="cookies" title="5. Cookies & Tracking">
            <P>
              We use cookies and similar technologies to operate the site and understand
              how visitors use it.
            </P>
            <Ul items={[
              <><strong>Essential cookies</strong> — Required for the site to function (e.g., routing, session preservation). Cannot be disabled.</>,
              <><strong>Analytics cookies</strong> — Set by Google Analytics 4 to measure traffic and usage patterns. You can opt out via your browser or the GA opt-out add-on.</>,
              <><strong>Affiliate cookies</strong> — Short-lived cookies and URL parameters to attribute referral traffic.</>,
            ]} />
            <P>
              Most browsers allow you to control cookies through their settings. Disabling
              analytics cookies will not affect your ability to use the site but will limit
              our ability to measure and improve it.
            </P>
          </Section>

          <Section id="gdpr" title="6. Your GDPR Rights">
            <P>
              If you are located in the European Economic Area (EEA), United Kingdom, or
              Switzerland, you have the following rights under the GDPR:
            </P>
            <Ul items={[
              <><strong>Right of Access</strong> — Request a copy of the personal data we hold about you.</>,
              <><strong>Right to Rectification</strong> — Ask us to correct inaccurate or incomplete data.</>,
              <><strong>Right to Erasure</strong> — Request deletion of your personal data, subject to legal retention obligations.</>,
              <><strong>Right to Restriction</strong> — Ask us to restrict processing in certain circumstances.</>,
              <><strong>Right to Data Portability</strong> — Receive your data in a structured, machine-readable format.</>,
              <><strong>Right to Object</strong> — Object to processing based on legitimate interests (including direct marketing).</>,
              <><strong>Right to Withdraw Consent</strong> — Where processing is based on consent, withdraw it at any time without affecting prior processing.</>,
            ]} />
            <P>
              To exercise any of these rights, contact us at{' '}
              <a
                href="mailto:nkefua@ndnanalytics.com"
                style={{ color: 'var(--brand-cyan)', textDecoration: 'none' }}
              >
                nkefua@ndnanalytics.com
              </a>. We will respond within 30 days. You also have the right to lodge a
              complaint with your local data protection authority.
            </P>
            <P>
              Our lawful bases for processing personal data are: <em>contract performance</em> (purchases),{' '}
              <em>legitimate interests</em> (analytics, fraud prevention), and{' '}
              <em>consent</em> (newsletter subscription).
            </P>
          </Section>

          <Section id="retention" title="7. Data Retention">
            <Ul items={[
              'Contact form submissions (leads): retained for up to 2 years for follow-up purposes.',
              'ARIA conversation sessions: retained for up to 12 months, then purged.',
              'Purchase records: retained for 7 years to comply with financial and tax regulations.',
              'Analytics data: governed by Google Analytics\'s own retention settings (default 14 months).',
              'Email queue jobs: purged automatically upon successful delivery.',
            ]} />
            <P>
              You may request earlier deletion by contacting us (see Section 10), subject
              to legal retention obligations.
            </P>
          </Section>

          <Section id="children" title="8. Children's Privacy">
            <P>
              Our services are not directed at children under 13 years of age. We do not
              knowingly collect personal information from children. If you believe a child
              has provided us with personal data, contact us immediately at{' '}
              <a
                href="mailto:nkefua@ndnanalytics.com"
                style={{ color: 'var(--brand-cyan)', textDecoration: 'none' }}
              >
                nkefua@ndnanalytics.com
              </a>{' '}
              and we will delete the data promptly.
            </P>
          </Section>

          <Section id="changes" title="9. Changes to This Policy">
            <P>
              We may update this Privacy Policy periodically. When we do, we will revise
              the "Last updated" date at the top of this page. For material changes, we
              will notify registered users by email. Continued use of the site after any
              changes constitutes acceptance of the updated policy.
            </P>
          </Section>

          <Section id="contact" title="10. Contact Us">
            <P>
              For privacy-related questions, data requests, or complaints, contact:
            </P>
            <div style={{
              background: 'rgba(6,182,212,0.04)',
              border: '1px solid rgba(6,182,212,0.15)',
              borderRadius: 10,
              padding: '20px 24px',
              fontFamily: "'JetBrains Mono Variable', 'JetBrains Mono', monospace",
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
              lineHeight: 2,
            }}>
              <div><strong style={{ color: 'var(--text-primary)' }}>NDN Analytics, Inc.</strong></div>
              <div>Data Privacy Officer</div>
              <div>
                <a
                  href="mailto:nkefua@ndnanalytics.com"
                  style={{ color: 'var(--brand-cyan)', textDecoration: 'none' }}
                >
                  nkefua@ndnanalytics.com
                </a>
              </div>
              <div style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                Response time: within 30 business days
              </div>
            </div>
          </Section>

        </div>
      </section>
    </>
  );
}
