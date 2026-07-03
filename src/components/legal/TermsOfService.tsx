import SEO from '../seo/SEO';

const LAST_UPDATED = 'May 2026';

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

export default function TermsOfService() {
  return (
    <>
      <SEO
        title="Terms of Service — NDN Analytics"
        description="NDN Analytics terms of service governing use of the website, AI products, blockchain solutions, ARIA assistant, paid services, and newsletter subscriptions."
        keywords="NDN Analytics terms of service, legal, acceptable use, AI disclaimer"
        canonicalPath="/terms"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Terms of Service', path: '/terms' },
        ]}
      />

      <section style={{ minHeight: '100vh', padding: '120px 0 100px' }}>
        <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>

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
              Terms of Service
            </h1>
            <p style={{
              fontSize: '0.85rem',
              color: 'var(--text-tertiary)',
              fontFamily: "'JetBrains Mono Variable', 'JetBrains Mono', monospace",
            }}>
              Last updated: {LAST_UPDATED}
            </p>
          </div>

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
              ['#acceptance', '1. Acceptance of Terms'],
              ['#service', '2. Description of Service'],
              ['#accounts', '3. User Accounts'],
              ['#acceptable-use', '4. Acceptable Use'],
              ['#ip', '5. Intellectual Property'],
              ['#payments', '6. Payments, Subscriptions & Refunds'],
              ['#ai', '7. AI Services & ARIA Assistant'],
              ['#newsletter', '8. Newsletter Subscriptions'],
              ['#third-party', '9. Third-Party Services & Links'],
              ['#warranties', '10. Disclaimer of Warranties'],
              ['#liability', '11. Limitation of Liability'],
              ['#indemnification', '12. Indemnification'],
              ['#termination', '13. Termination'],
              ['#governing-law', '14. Governing Law'],
              ['#changes', '15. Changes to These Terms'],
              ['#contact', '16. Contact Us'],
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

          <Section id="acceptance" title="1. Acceptance of Terms">
            <P>
              These Terms of Service ("Terms") govern your access to and use of the website
              at <strong>ndnanalytics.com</strong> and any related products, software,
              services, and content (collectively, the "Service") operated by NDN Analytics,
              Inc. ("NDN Analytics", "we", "us", or "our").
            </P>
            <P>
              By accessing or using the Service, you agree to be bound by these Terms and our{' '}
              <a href="/privacy" style={{ color: 'var(--brand-cyan)', textDecoration: 'none' }}>
                Privacy Policy
              </a>. If you do not agree to these Terms, do not access or use the Service.
            </P>
            <P>
              You must be at least 18 years old, or the age of majority in your jurisdiction,
              to use the Service. If you are using the Service on behalf of an organisation,
              you represent that you have authority to bind that organisation to these Terms.
            </P>
          </Section>

          <Section id="service" title="2. Description of Service">
            <P>
              NDN Analytics provides enterprise AI products, blockchain solutions, advisory
              services, the ARIA AI assistant, editorial content, and related digital
              services. Features, pricing, and availability may change at any time without
              notice.
            </P>
            <P>
              Some parts of the Service are free; others require payment. Specific terms for
              paid services, including subscription periods and fees, are presented at the
              point of purchase and are incorporated by reference into these Terms.
            </P>
          </Section>

          <Section id="accounts" title="3. User Accounts">
            <P>
              Certain features may require you to create an account or provide an email
              address (for example, contact form submissions, newsletter subscriptions, or
              purchases). You agree to:
            </P>
            <Ul items={[
              'Provide accurate, current, and complete information.',
              'Maintain the confidentiality of any credentials and not share them with third parties.',
              'Notify us immediately of any unauthorised use of your account.',
              'Be responsible for all activities that occur under your account.',
            ]} />
            <P>
              We reserve the right to suspend or terminate accounts that violate these Terms,
              engage in fraud, or pose a security risk.
            </P>
          </Section>

          <Section id="acceptable-use" title="4. Acceptable Use">
            <P>
              You agree not to use the Service to:
            </P>
            <Ul items={[
              'Violate any applicable law, regulation, or third-party right.',
              'Infringe, misappropriate, or violate any intellectual property right.',
              'Transmit malware, viruses, or any code designed to interfere with the Service.',
              'Engage in unauthorised scraping, data harvesting, or automated access not expressly permitted.',
              'Probe, scan, or test the vulnerability of the Service or attempt to bypass access controls.',
              'Impersonate any person or misrepresent your affiliation with any person or organisation.',
              'Use the Service to generate or distribute spam, harassment, hate speech, or material that is unlawful, defamatory, or harmful.',
              'Resell, sublicense, or otherwise commercially exploit the Service without our written consent.',
              'Use the ARIA assistant or any AI feature to generate content that violates applicable law or third-party rights.',
            ]} />
            <P>
              We reserve the right to investigate suspected violations and to suspend or
              terminate access, with or without notice, in our reasonable discretion.
            </P>
          </Section>

          <Section id="ip" title="5. Intellectual Property">
            <P>
              The Service, including all text, graphics, code, logos, trademarks, articles,
              blog posts, whitepapers, product documentation, and software, is owned by
              NDN Analytics or its licensors and is protected by copyright, trademark, and
              other intellectual-property laws.
            </P>
            <P>
              We grant you a limited, non-exclusive, non-transferable, revocable licence to
              access and use the Service for your personal or internal business purposes,
              subject to these Terms. No other rights are granted, whether by implication,
              estoppel, or otherwise.
            </P>
            <P>
              You may quote brief excerpts from our editorial content with attribution and a
              link back to the original page. Republication of full articles, programmatic
              scraping for training of machine-learning models, and commercial redistribution
              require our prior written permission.
            </P>
            <P>
              "NDN Analytics", the NDN Analytics logo, and product names (including but not
              limited to NDN Demand IQ, NDN Care Predict, NDN Route AI, NDN Churn Guard,
              NDN TraceChain, NDN PayStream, NDN CredVault, NDN PropLedger, Njangi,
              NeuroQuest, NDN Interpreter, and NDN Model Studio) are trademarks of NDN
              Analytics. You may not use these marks without our prior written consent.
            </P>
          </Section>

          <Section id="payments" title="6. Payments, Subscriptions & Refunds">
            <P>
              Paid services are billed in advance via Stripe. By providing payment
              information, you authorise us to charge the applicable fees, taxes, and any
              recurring charges to your payment method.
            </P>
            <Ul items={[
              'Prices are in US dollars unless otherwise stated and exclude applicable taxes, which are added at checkout where required.',
              'Subscription services renew automatically at the end of each billing period unless cancelled before the renewal date.',
              'You may cancel a subscription at any time via your account or by contacting us; cancellation takes effect at the end of the current billing period.',
              'One-time purchases (such as advisory engagements, downloadable assets, or training credits) are generally non-refundable once delivered, except as required by law.',
              'Refund requests for subscription services may be considered on a case-by-case basis if submitted within 14 days of the initial charge.',
            ]} />
            <P>
              We may change pricing at any time. Price changes for subscriptions take effect
              at the next renewal and will be communicated at least 30 days in advance.
            </P>
          </Section>

          <Section id="ai" title="7. AI Services & ARIA Assistant">
            <P>
              The Service includes AI-powered features, including the ARIA assistant and
              automated content generation tools, which rely on large-language-model
              providers such as Anthropic.
            </P>
            <P>
              <strong>AI outputs are provided "as is" for informational purposes only.</strong>{' '}
              They may be incomplete, inaccurate, out of date, or unsuitable for your specific
              circumstances. You are solely responsible for evaluating AI outputs before
              relying on them, and for any decisions made based on those outputs.
            </P>
            <P>
              AI outputs do not constitute legal, financial, medical, tax, immigration, or
              other professional advice. For any consequential decision, consult a qualified
              professional in the relevant field.
            </P>
            <P>
              Conversations with ARIA may be stored to improve service quality and prevent
              abuse, as described in our Privacy Policy. Do not submit sensitive personal
              data, confidential business information, or regulated data (such as personal
              health information) to AI features unless we have a written agreement
              authorising such use.
            </P>
          </Section>

          <Section id="newsletter" title="8. Newsletter Subscriptions">
            <P>
              By subscribing to the NDN Intelligence newsletter or any other editorial list,
              you consent to receiving periodic emails from us about our products, content,
              and offers. You may unsubscribe at any time via the link in any email or by
              contacting us. Unsubscribing from marketing emails does not affect transactional
              emails (such as purchase receipts) you are entitled to receive.
            </P>
          </Section>

          <Section id="third-party" title="9. Third-Party Services & Links">
            <P>
              The Service may contain links to third-party websites, products, or services
              that are not owned or controlled by NDN Analytics. We are not responsible for
              the content, policies, or practices of any third-party site or service. You
              access third-party content at your own risk and subject to the third party's
              terms.
            </P>
            <P>
              We integrate with third-party providers (including Google, Firebase, Stripe,
              Resend, EmailJS, and Anthropic) to deliver the Service. Your use of those
              providers is also governed by their respective terms and privacy policies.
            </P>
          </Section>

          <Section id="warranties" title="10. Disclaimer of Warranties">
            <P>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY
              KIND, EXPRESS OR IMPLIED, INCLUDING, WITHOUT LIMITATION, IMPLIED WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR
              UNINTERRUPTED OR ERROR-FREE OPERATION.
            </P>
            <P>
              We do not warrant that the Service, AI outputs, or any content will be
              accurate, complete, reliable, secure, current, or free of viruses or other
              harmful components. Some jurisdictions do not allow the exclusion of implied
              warranties; in such jurisdictions, the foregoing exclusions may not apply to
              you.
            </P>
          </Section>

          <Section id="liability" title="11. Limitation of Liability">
            <P>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, NDN ANALYTICS AND ITS OFFICERS,
              DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT,
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST
              PROFITS, LOST DATA, LOST GOODWILL, OR BUSINESS INTERRUPTION, ARISING OUT OF OR
              RELATING TO YOUR USE OF THE SERVICE, EVEN IF WE HAVE BEEN ADVISED OF THE
              POSSIBILITY OF SUCH DAMAGES.
            </P>
            <P>
              OUR AGGREGATE LIABILITY FOR ANY CLAIM ARISING OUT OF OR RELATING TO THE
              SERVICE SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNTS YOU PAID TO US IN THE
              TWELVE MONTHS PRECEDING THE CLAIM OR (B) ONE HUNDRED US DOLLARS (USD $100).
            </P>
            <P>
              These limitations apply regardless of the legal theory on which the claim is
              based, including contract, tort, negligence, strict liability, or otherwise.
              Some jurisdictions do not allow the limitation of liability for certain
              damages; in such jurisdictions, our liability is limited to the maximum extent
              permitted by law.
            </P>
          </Section>

          <Section id="indemnification" title="12. Indemnification">
            <P>
              You agree to defend, indemnify, and hold harmless NDN Analytics and its
              officers, directors, employees, and agents from and against any claims,
              liabilities, damages, losses, and expenses (including reasonable legal fees)
              arising out of or related to (a) your use of the Service, (b) your violation
              of these Terms, (c) your violation of any law or third-party right, or
              (d) content you submit through the Service.
            </P>
          </Section>

          <Section id="termination" title="13. Termination">
            <P>
              We may suspend or terminate your access to all or part of the Service at any
              time, with or without notice, for conduct that we reasonably believe violates
              these Terms or is otherwise harmful to other users, third parties, or our
              business.
            </P>
            <P>
              Upon termination, your right to use the Service ceases immediately. Provisions
              that by their nature should survive termination (including intellectual
              property, disclaimers, limitation of liability, indemnification, and governing
              law) shall survive.
            </P>
          </Section>

          <Section id="governing-law" title="14. Governing Law">
            <P>
              These Terms are governed by and construed in accordance with the laws of the
              State of Oklahoma, United States, without regard to its conflict-of-laws
              principles. You agree to submit to the exclusive jurisdiction of the state
              and federal courts located in Tulsa County, Oklahoma for the resolution of any
              dispute arising out of or relating to these Terms or the Service, except that
              we may seek injunctive or equitable relief in any court of competent
              jurisdiction.
            </P>
          </Section>

          <Section id="changes" title="15. Changes to These Terms">
            <P>
              We may update these Terms from time to time. When we do, we will revise the
              "Last updated" date at the top of this page. For material changes, we will
              notify registered users by email or by a prominent notice on the Service prior
              to the change taking effect. Continued use of the Service after any changes
              become effective constitutes acceptance of the revised Terms.
            </P>
          </Section>

          <Section id="contact" title="16. Contact Us">
            <P>
              For questions about these Terms, please contact:
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
              <div>5406 E 23rd St</div>
              <div>Tulsa, Oklahoma 74114</div>
              <div>United States</div>
              <div style={{ marginTop: 8 }}>
                <a
                  href="mailto:nkefua@ndnanalytics.com"
                  style={{ color: 'var(--brand-cyan)', textDecoration: 'none' }}
                >
                  nkefua@ndnanalytics.com
                </a>
              </div>
            </div>
          </Section>

        </div>
      </section>
    </>
  );
}
