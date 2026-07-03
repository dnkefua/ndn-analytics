import { Link } from 'react-router-dom';
import SEO from '../seo/SEO';

export default function NotFound() {
  return (
    <>
      <SEO
        title="404 — Page Not Found"
        description="The page you're looking for doesn't exist. Explore NDN Analytics products, solutions, and resources."
        canonicalPath="/404"
      />
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
      }}>
        <div style={{ maxWidth: 520 }}>
          <div style={{
            fontFamily: "'JetBrains Mono Variable', monospace",
            fontSize: '6rem',
            fontWeight: 800,
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
            marginBottom: 16,
          }}>
            404
          </div>
          <h1 style={{
            fontFamily: "'Syne Variable', sans-serif",
            fontSize: '1.8rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 12,
          }}>
            Page Not Found
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            lineHeight: 1.7,
            marginBottom: 36,
          }}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn-primary">Back to Home</Link>
            <Link to="/products" className="btn btn-ghost">Explore Products</Link>
            <Link to="/contact" className="btn btn-ghost">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
