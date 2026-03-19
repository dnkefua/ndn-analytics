import { useEffect, useRef, useState } from 'react';
import { PRODUCTS } from '../products/productData';
import './ContactSection.css';

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', product: '', message: '' });

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.target.classList.toggle('visible', e.isIntersecting)),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="section contact-section" ref={ref}>
      <div className="container">
        <div className="contact-layout">
          <div className="contact-info">
            <div className="section-tag reveal">Contact</div>
            <h2 className="section-title reveal stagger-1">
              Start Your<br />
              <span className="text-gradient">Intelligence Journey</span>
            </h2>
            <p className="contact-desc reveal stagger-2">
              Ready to deploy AI and blockchain intelligence at enterprise scale? Our team is ready to build your solution.
            </p>
            <div className="contact-details reveal stagger-3">
              <div className="contact-detail">
                <span className="contact-detail-label">Response Time</span>
                <span className="contact-detail-value">Within 24 hours</span>
              </div>
              <div className="contact-detail">
                <span className="contact-detail-label">Availability</span>
                <span className="contact-detail-value">24/7 Enterprise SLA</span>
              </div>
              <div className="contact-detail">
                <span className="contact-detail-label">Integration Partners</span>
                <span className="contact-detail-value">SAP · Salesforce · Snowflake · AWS</span>
              </div>
            </div>
          </div>

          <div className="contact-form-wrap reveal stagger-2">
            {submitted ? (
              <div className="contact-success">
                <div style={{ fontSize: '2rem', marginBottom: 16, color: 'var(--brand-cyan)' }}>✓</div>
                <h3>Message Received</h3>
                <p>Our team will respond within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    placeholder="jane@enterprise.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Product Interest</label>
                  <select
                    className="form-input form-select"
                    value={form.product}
                    onChange={e => setForm({ ...form, product: e.target.value })}
                  >
                    <option value="">Select a product...</option>
                    {PRODUCTS.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                    <option value="general">General Inquiry</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea
                    required
                    className="form-input form-textarea"
                    placeholder="Tell us about your use case and scale..."
                    rows={5}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Send Message →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
