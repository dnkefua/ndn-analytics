import { Link } from 'react-router-dom';
import SEO from '../seo/SEO';
import { useEffect } from 'react';
import { trackCTAClick } from '../../lib/analytics';

export default function CheckoutSuccess() {
  useEffect(() => {
    trackCTAClick('checkout_success', 'ai_readiness_assessment');
  }, []);

  return (
    <>
      <SEO
        title="Payment Confirmed — AI Readiness Assessment"
        description="Your AI Readiness Assessment has been booked. Our team will contact you within 1 business day."
        canonicalPath="/checkout/success"
      />
      <section style={{ minHeight: '100vh', paddingTop: 160, paddingBottom: 80, display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>

          {/* Icon */}
          <div style={{
            width: 80, height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7C3AED22, #3B82F622)',
            border: '2px solid #7C3AED',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem',
            margin: '0 auto 32px',
          }}>
            ✓
          </div>

          <div className="section-tag">Confirmed</div>

          <h1 className="section-title" style={{ marginBottom: 16 }}>
            You're Booked.<br />
            <span className="text-gradient">Let's Build Your AI Roadmap.</span>
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: 48 }}>
            Your payment was successful. A member of the NDN Analytics team will reach out
            within <strong>1 business day</strong> to schedule your 2-hour discovery workshop
            and confirm all the details.
          </p>

          {/* What happens next */}
          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: 16,
            padding: 36,
            textAlign: 'left',
            marginBottom: 48,
          }}>
            <h3 style={{
              fontFamily: "'Syne Variable', sans-serif",
              fontSize: '1.1rem',
              fontWeight: 700,
              marginBottom: 24,
              color: 'var(--text-primary)',
            }}>
              What happens next
            </h3>

            {[
              { step: '01', title: 'Kickoff email', desc: 'We\'ll send a calendar invite and pre-workshop questionnaire to prepare for your session.' },
              { step: '02', title: '2-hour discovery workshop', desc: 'Deep dive into your current processes, data landscape, and AI/blockchain opportunity areas.' },
              { step: '03', title: 'Analysis & roadmap', desc: 'We produce your custom Implementation Roadmap and ROI Projection Report within 5 business days.' },
              { step: '04', title: '30-day support', desc: 'Ask us anything as you review the deliverables and plan your next steps.' },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                <div style={{
                  flexShrink: 0,
                  width: 36, height: 36,
                  borderRadius: '50%',
                  background: 'rgba(124,58,237,0.1)',
                  color: '#7C3AED',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'JetBrains Mono Variable', monospace",
                  fontSize: '0.7rem',
                  fontWeight: 700,
                }}>
                  {step}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn-ghost">
              ← Back to home
            </Link>
            <Link to="/contact" className="btn btn-primary">
              Contact us directly →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
