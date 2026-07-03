import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { trackFormSubmit } from '../../lib/analytics';
import { createLead, attributeAnonymousEngagements } from '../../lib/leads';

interface Props {
  source?: 'footer' | 'blog';
}

export default function NewsletterSignup({ source = 'footer' }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'subscribed' | 'error'>('idle');

  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('sending');

    try {
      // Save lead to Firestore
      const leadSource = source === 'blog' ? 'newsletter_blog' : 'newsletter_footer';
      const lead = await createLead({
        email,
        source: leadSource,
        tags: ['newsletter', source],
      });

      // Attribute anonymous engagements
      if (lead?.id) {
        await attributeAnonymousEngagements(lead.id);
      }

      // Send notification via EmailJS if configured
      if (serviceId && templateId) {
        await emailjs.send(serviceId, templateId, { user_email: email }, publicKey);
      }

      setStatus('subscribed');
      setEmail('');
      trackFormSubmit('newsletter');
    } catch (err) {
      console.error('Newsletter signup failed', err);
      setStatus('error');
    }
  };

  if (status === 'subscribed') {
    return (
      <div style={{ padding: 24, background: 'rgba(6,182,212,0.08)', borderRadius: 12, border: '1px solid rgba(6,182,212,0.2)', textAlign: 'center' }}>
        <p style={{ color: 'var(--brand-cyan)', fontFamily: "'JetBrains Mono Variable', monospace", fontSize: '0.85rem' }}>You're subscribed! Check your inbox for confirmation.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <input
        type="email"
        required
        placeholder="you@enterprise.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ flex: 1, minWidth: 200, padding: '10px 16px', background: 'rgba(10,22,40,0.8)', border: '1px solid var(--border-subtle)', borderRadius: 8, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono Variable', monospace", fontSize: '0.85rem', outline: 'none' }}
      />
      <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }} disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending...' : 'Subscribe'}
      </button>
      {status === 'error' && (
        <div style={{ color: 'var(--danger)', width: '100%', marginTop: 6, fontSize: '0.85rem' }}>Something went wrong — please try again later.</div>
      )}
    </form>
  );
}
