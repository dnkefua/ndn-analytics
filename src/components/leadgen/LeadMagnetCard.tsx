import { useState } from 'react';
import { createLead, attributeAnonymousEngagements } from '../../lib/leads';
import { trackDownload, getDownloadUrl, type LeadMagnet } from '../../lib/leadMagnets';
import { trackFormSubmit } from '../../lib/analytics';

interface Props {
  magnet: LeadMagnet;
  variant?: 'card' | 'inline' | 'modal';
}

export default function LeadMagnetCard({ magnet, variant = 'card' }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('sending');

    try {
      const lead = await createLead({
        email,
        source: 'content_upgrade',
        productInterests: magnet.relatedProducts,
        tags: ['lead_magnet', `download_${magnet.id}`],
      });

      if (lead?.id) {
        await attributeAnonymousEngagements(lead.id);
        await trackDownload(lead.id, magnet.id);
      }

      trackFormSubmit('lead_magnet');
      setStatus('success');

      // Trigger download after short delay
      setTimeout(() => {
        const url = getDownloadUrl(magnet.id);
        window.open(url, '_blank');
      }, 1000);
    } catch {
      setStatus('error');
    }
  };

  const categoryColors = {
    ai: { bg: 'rgba(124,58,237,0.1)', border: 'rgba(124,58,237,0.3)', accent: '#7C3AED' },
    blockchain: { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)', accent: '#3B82F6' },
    general: { bg: 'rgba(236,72,153,0.1)', border: 'rgba(236,72,153,0.3)', accent: '#EC4899' },
  };

  const colors = categoryColors[magnet.category];

  if (variant === 'inline') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: 16,
          background: colors.bg,
          border: `1px solid ${colors.border}`,
          borderRadius: 12,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: 1, minWidth: 200 }}>
          <p style={{ fontWeight: 600, color: '#0F172A', marginBottom: 4, fontSize: '0.95rem' }}>
            {magnet.title}
          </p>
          <p style={{ color: '#64748B', fontSize: '0.85rem' }}>{magnet.description}</p>
        </div>
        {status === 'success' ? (
          <span style={{ color: colors.accent, fontWeight: 600, fontSize: '0.9rem' }}>
            Downloading...
          </span>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
            <input
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                padding: '10px 14px',
                border: `1px solid ${colors.border}`,
                borderRadius: 8,
                fontSize: '0.85rem',
                minWidth: 180,
                background: '#FFFFFF',
              }}
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              style={{
                padding: '10px 18px',
                background: colors.accent,
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 8,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {status === 'sending' ? '...' : 'Get Free PDF'}
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: `1px solid ${colors.border}`,
        borderRadius: 16,
        padding: 28,
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      }}
    >
      <div
        style={{
          display: 'inline-block',
          padding: '4px 12px',
          background: colors.bg,
          borderRadius: 20,
          fontSize: '0.7rem',
          fontWeight: 700,
          color: colors.accent,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: 16,
        }}
      >
        Free {magnet.category === 'ai' ? 'AI' : magnet.category === 'blockchain' ? 'Blockchain' : ''} Resource
      </div>

      <h3
        style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: '#0F172A',
          marginBottom: 8,
          lineHeight: 1.3,
        }}
      >
        {magnet.title}
      </h3>

      <p
        style={{
          color: '#64748B',
          fontSize: '0.95rem',
          lineHeight: 1.6,
          marginBottom: 24,
        }}
      >
        {magnet.description}
      </p>

      {status === 'success' ? (
        <div
          style={{
            padding: 16,
            background: colors.bg,
            borderRadius: 8,
            textAlign: 'center',
          }}
        >
          <p style={{ color: colors.accent, fontWeight: 600 }}>
            Check your inbox! Download starting...
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
              padding: '14px 16px',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              fontSize: '0.95rem',
              background: '#F8FAFC',
            }}
          />
          <button
            type="submit"
            disabled={status === 'sending'}
            style={{
              padding: '14px 24px',
              background: colors.accent,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
            }}
          >
            {status === 'sending' ? 'Processing...' : 'Download Free PDF →'}
          </button>
          {status === 'error' && (
            <p style={{ color: '#EF4444', fontSize: '0.85rem' }}>Something went wrong. Try again.</p>
          )}
        </form>
      )}

      <p style={{ color: '#94A3B8', fontSize: '0.75rem', marginTop: 12, textAlign: 'center' }}>
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}
