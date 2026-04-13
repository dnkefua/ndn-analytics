import { useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { PRODUCTS } from '../products/productData';
import SEO from '../seo/SEO';
import ContactPageSchema from '../seo/ContactPageSchema';
import { trackFormSubmit, trackDemoBooking } from '../../lib/analytics';
import { createLead, addEngagement, attributeAnonymousEngagements } from '../../lib/leads';
import './ContactSection.css';

const EJS_SERVICE  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || '';
const EJS_TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EJS_PUBLIC   = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || '';

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [form, setForm] = useState({ name: '', email: '', product: '', message: '' });

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.target.classList.toggle('visible', e.isIntersecting)),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setStatus('sending');
    trackFormSubmit('contact');

    try {
      // Save lead to Firestore first (before EmailJS)
      const productId = PRODUCTS.find(p => p.name === form.product)?.id;
      const lead = await createLead({
        email: form.email,
        name: form.name,
        source: 'contact_form',
        productInterests: productId ? [productId] : [],
        tags: ['contact_form'],
      });

      // Attribute any anonymous engagements (page views, etc.)
      if (lead?.id) {
        await attributeAnonymousEngagements(lead.id);
        await addEngagement(lead.id, 'form_submit', {
          product: form.product,
          hasMessage: Boolean(form.message),
        });
      }

      // Send email via EmailJS
      await emailjs.sendForm(EJS_SERVICE, EJS_TEMPLATE, formRef.current, { publicKey: EJS_PUBLIC });
      setStatus('success');
      setForm({ name: '', email: '', product: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const handleCalendly = () => {
    trackDemoBooking('contact_page');
    if (typeof Calendly !== 'undefined') {
      Calendly.initPopupWidget({ url: 'https://calendly.com/ndnanalytics/demo' });
    }
  };

  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with NDN Analytics. Book a demo or discuss your enterprise AI and blockchain intelligence needs with our team."
        keywords="contact NDN Analytics, enterprise AI demo, blockchain consultation, book demo"
        canonicalPath="/contact"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ]}
      />
      <ContactPageSchema />
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
                <span className="contact-detail-label">Email</span>
                <span className="contact-detail-value">nkefua@ndnanalytics.com</span>
              </div>
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
                <span className="contact-detail-value">Google Cloud · Ethereum · Solana · SAP · Salesforce · Snowflake</span>
              </div>
            </div>
            <div className="reveal stagger-4" style={{ marginTop: 24 }}>
              <button
                className="btn btn-primary"
                onClick={handleCalendly}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                &#128197; Schedule a Demo
              </button>
            </div>
          </div>

          <div className="contact-form-wrap reveal stagger-2">
            {status === 'success' ? (
              <div className="contact-success">
                <div style={{ fontSize: '2.5rem', marginBottom: 16, color: 'var(--brand-cyan)' }}>&#10003;</div>
                <h3>Message Received</h3>
                <p>Our team at nkefua@ndnanalytics.com will respond within 24 hours.</p>
                <button
                  className="btn btn-ghost"
                  style={{ marginTop: '1.5rem' }}
                  onClick={() => setStatus('idle')}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="from_name">Full Name</label>
                  <input
                    type="text"
                    id="from_name"
                    name="from_name"
                    required
                    className="form-input"
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="from_email">Email Address</label>
                  <input
                    type="email"
                    id="from_email"
                    name="from_email"
                    required
                    className="form-input"
                    placeholder="jane@enterprise.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="product_interest">Product Interest</label>
                  <select
                    id="product_interest"
                    name="product_interest"
                    className="form-input form-select"
                    value={form.product}
                    onChange={e => setForm({ ...form, product: e.target.value })}
                  >
                    <option value="">Select a product...</option>
                    {PRODUCTS.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    className="form-input form-textarea"
                    placeholder="Tell us about your use case and scale..."
                    rows={5}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                  />
                </div>

                <input type="hidden" name="to_email" value="nkefua@ndnanalytics.com" />

                {status === 'error' && (
                  <p className="form-error">Something went wrong. Please email us directly at nkefua@ndnanalytics.com</p>
                )}

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message \u2192'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
