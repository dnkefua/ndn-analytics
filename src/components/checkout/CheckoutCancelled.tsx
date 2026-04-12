import { Link } from 'react-router-dom';
import SEO from '../seo/SEO';

export default function CheckoutCancelled() {
  return (
    <>
      <SEO
        title="Payment Cancelled"
        description="Your checkout was cancelled. Return to pricing to try again."
        canonicalPath="/checkout/cancelled"
      />
      <section style={{ minHeight: '100vh', paddingTop: 160, paddingBottom: 80, display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>

          <div style={{
            width: 72, height: 72,
            borderRadius: '50%',
            background: 'rgba(100,116,139,0.1)',
            border: '2px solid #94A3B8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem',
            margin: '0 auto 32px',
          }}>
            ×
          </div>

          <div className="section-tag">Cancelled</div>

          <h1 style={{
            fontFamily: "'Syne Variable', sans-serif",
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: 16,
            color: 'var(--text-primary)',
          }}>
            No problem — we'll be here.
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, marginBottom: 40 }}>
            Your payment was not processed. If you have questions about the AI Readiness Assessment
            before purchasing, we're happy to answer them.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/pricing" className="btn btn-primary">
              Back to pricing →
            </Link>
            <Link to="/contact" className="btn btn-ghost">
              Ask a question
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
