import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'subscribed'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('subscribed');
    setEmail('');
  };

  if (status === 'subscribed') {
    return (
      <div style={{ padding: 24, background: 'rgba(6,182,212,0.08)', borderRadius: 12, border: '1px solid rgba(6,182,212,0.2)', textAlign: 'center' }}>
        <p style={{ color: 'var(--brand-cyan)', fontFamily: "'JetBrains Mono Variable', monospace", fontSize: '0.85rem' }}>✓ You're subscribed! Check your inbox for confirmation.</p>
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
      <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>Subscribe</button>
    </form>
  );
}
