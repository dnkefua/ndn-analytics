import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './WhitePaper.css';

export default function WhitePaper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="wp-wrapper">
      <nav className="wp-nav">
        <Link to="/" className="wp-nav-brand">
          <div className="wp-nav-logo">NDN</div>
          <span className="wp-nav-name">Analytics</span>
        </Link>
        <div className="wp-nav-center">
          <span className="wp-nav-badge">NDP v1.0 White Paper</span>
        </div>
        <Link to="/" className="wp-nav-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Home
        </Link>
      </nav>
      <div className="wp-content">
        {!mounted && (
          <div className="wp-loading">
            <div style={{ textAlign: 'center' }}>
              <div className="wp-spinner" />
              Loading White Paper...
            </div>
          </div>
        )}
        {mounted && (
          <iframe
            src="/whitepaper/index.html"
            className="wp-iframe"
            title="NDN IPFS Chain White Paper"
          />
        )}
      </div>
    </div>
  );
}