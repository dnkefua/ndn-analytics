import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './WhitePaper.css';

const WhitePaper = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="wp-wrapper" style={{ display: 'flex', flexDirection: 'column' }}>
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
        {!isClient && (
          <div style={{
            width: '100%',
            minHeight: '100%',
            background: '#020814',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#8ba5cc',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                border: '3px solid rgba(6,182,212,0.3)', 
                borderTopColor: '#06b6d4',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px'
              }} />
              Loading White Paper...
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}
        {isClient && (
          <iframe
            src="/whitepaper/index.html"
            className="wp-iframe"
            title="NDN IPFS Chain White Paper"
            style={{ background: '#020814', flex: 1 }}
          />
        )}
      </div>
    </div>
  );
};

export default WhitePaper;