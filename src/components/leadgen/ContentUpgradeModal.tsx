import { useState } from 'react';
import { useExitIntent } from './useExitIntent';
import { createLead, attributeAnonymousEngagements } from '../../lib/leads';
import { trackFormSubmit } from '../../lib/analytics';

interface Props {
  title?: string;
  description?: string;
  downloadId?: string;
  productInterests?: string[];
}

export default function ContentUpgradeModal({
  title = 'Wait! Before you go...',
  description = 'Get our free guide to enterprise AI implementation delivered to your inbox.',
  downloadId = 'general-guide',
  productInterests = [],
}: Props) {
  const { showModal, dismissModal } = useExitIntent();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  if (!showModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('sending');

    try {
      const lead = await createLead({
        email,
        source: 'exit_intent',
        productInterests,
        tags: ['exit_intent', `download_${downloadId}`],
      });

      if (lead?.id) {
        await attributeAnonymousEngagements(lead.id);
      }

      setStatus('success');
      trackFormSubmit('exit_intent');

      setTimeout(() => {
        dismissModal();
      }, 2000);
    } catch {
      setStatus('error');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.3s ease',
      }}
      onClick={e => {
        if (e.target === e.currentTarget) dismissModal();
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        style={{
          position: 'relative',
          maxWidth: 480,
          width: '100%',
          background: 'linear-gradient(135deg, rgba(10,22,40,0.98), rgba(6,182,212,0.08))',
          border: '1px solid rgba(6,182,212,0.3)',
          borderRadius: 16,
          padding: 40,
          animation: 'slideUp 0.4s ease',
        }}
      >
        <button
          onClick={dismissModal}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            color: 'var(--text-tertiary)',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: 4,
            lineHeight: 1,
          }}
          aria-label="Close"
        >
          ×
        </button>

        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono Variable', monospace",
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              color: 'var(--brand-cyan)',
              marginBottom: 12,
              textTransform: 'uppercase',
            }}
          >
            Free Resource
          </div>

          <h2
            style={{
              fontFamily: "'Syne Variable', sans-serif",
              fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginBottom: 12,
              lineHeight: 1.3,
            }}
          >
            {title}
          </h2>

          <p
            style={{
              fontSize: '0.95rem',
              color: 'var(--text-secondary)',
              marginBottom: 24,
              lineHeight: 1.6,
            }}
          >
            {description}
          </p>

          {status === 'success' ? (
            <div
              style={{
                padding: 20,
                background: 'rgba(6,182,212,0.1)',
                borderRadius: 8,
                border: '1px solid rgba(6,182,212,0.3)',
              }}
            >
              <p style={{ color: 'var(--brand-cyan)', fontWeight: 600 }}>
                Check your inbox! Your download is on its way.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  padding: '14px 18px',
                  background: 'rgba(10,22,40,0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 8,
                  color: 'var(--text-primary)',
                  fontFamily: "'JetBrains Mono Variable', monospace",
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(6,182,212,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border-subtle)')}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={status === 'sending'}
                style={{ padding: '14px 24px', fontSize: '0.95rem' }}
              >
                {status === 'sending' ? 'Sending...' : 'Get Free Download →'}
              </button>
              {status === 'error' && (
                <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: 8 }}>
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          )}

          <p
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-tertiary)',
              marginTop: 16,
            }}
          >
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
