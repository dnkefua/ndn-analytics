import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../seo/SEO';
import { createLead, attributeAnonymousEngagements } from '../../lib/leads';
import { trackFormSubmit, trackCTAClick } from '../../lib/analytics';

/* ─── Early Access Signup ─────────────────────────────────────────────────── */
function EarlyAccessForm() {
  const [form, setForm] = useState({ name: '', email: '', role: '', useCase: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    trackFormSubmit('fine_tuning_early_access');
    try {
      const lead = await createLead({
        name: form.name,
        email: form.email,
        source: 'fine_tuning_teaser',
        tags: ['early_access', 'fine_tuning', form.role].filter(Boolean),
        productInterests: ['model_studio'],
      });
      if (lead?.id) await attributeAnonymousEngagements(lead.id);
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <div style={{
        padding: '40px 32px',
        background: 'rgba(6,182,212,0.06)',
        border: '1px solid rgba(6,182,212,0.25)',
        borderRadius: 16,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>✓</div>
        <h3 style={{
          fontFamily: "'Syne Variable', sans-serif",
          fontSize: '1.4rem',
          fontWeight: 700,
          color: 'var(--brand-cyan)',
          marginBottom: 10,
        }}>
          You're on the list.
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.7 }}>
          We'll reach out to <strong style={{ color: 'var(--text-primary)' }}>{form.email}</strong> as soon
          as your early access slot opens. Expect it before anyone else.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={labelStyle}>Your Name</label>
          <input
            required
            type="text"
            placeholder="Jane Doe"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Work Email</label>
          <input
            required
            type="email"
            placeholder="jane@company.com"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            style={inputStyle}
          />
        </div>
      </div>
      <div>
        <label style={labelStyle}>Your Role</label>
        <select
          required
          value={form.role}
          onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
          style={{ ...inputStyle, appearance: 'none' }}
        >
          <option value="">Select your role…</option>
          <option value="ml_engineer">ML / AI Engineer</option>
          <option value="data_scientist">Data Scientist</option>
          <option value="cto">CTO / VP Engineering</option>
          <option value="product">Product Manager</option>
          <option value="researcher">Researcher</option>
          <option value="founder">Founder / CEO</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label style={labelStyle}>What model would you fine-tune first? (optional)</label>
        <textarea
          rows={3}
          placeholder="e.g. Llama 3 on our support ticket dataset to power a customer service agent…"
          value={form.useCase}
          onChange={e => setForm(f => ({ ...f, useCase: e.target.value }))}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>
      {status === 'error' && (
        <p style={{ color: '#F87171', fontSize: '0.82rem' }}>
          Something went wrong — please try again or email nkefua@ndnanalytics.com.
        </p>
      )}
      <button
        type="submit"
        className="btn btn-primary"
        style={{ justifyContent: 'center', fontSize: '1rem', padding: '14px 32px' }}
        disabled={status === 'sending'}
        onClick={() => trackCTAClick('fine_tuning_signup', 'teaser_form')}
      >
        {status === 'sending' ? 'Reserving your spot…' : 'Request Early Access →'}
      </button>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textAlign: 'center', margin: 0 }}>
        No credit card. No commitment. We'll contact you when your slot opens.
      </p>
    </form>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: "'JetBrains Mono Variable', monospace",
  fontSize: '0.68rem',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: 'var(--text-tertiary)',
  marginBottom: 7,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  background: 'rgba(7,24,41,0.85)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 8,
  color: 'var(--text-primary)',
  fontFamily: "'Inter Variable', Inter, sans-serif",
  fontSize: '0.92rem',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
};

/* ─── Gap Card ────────────────────────────────────────────────────────────── */
function GapCard({ icon, heading, body }: { icon: string; heading: string; body: string }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 12,
      padding: '28px 24px',
      transition: 'border-color 0.25s',
    }}>
      <div style={{ fontSize: '1.8rem', marginBottom: 12 }}>{icon}</div>
      <h3 style={{
        fontFamily: "'Syne Variable', sans-serif",
        fontSize: '1.05rem',
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: 10,
      }}>{heading}</h3>
      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>{body}</p>
    </div>
  );
}

/* ─── How It Works Step ──────────────────────────────────────────────────── */
function Step({ n, icon, heading, body, accent }: { n: number; icon: string; heading: string; body: string; accent: string }) {
  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
      <div style={{
        flexShrink: 0,
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: `${accent}18`,
        border: `1.5px solid ${accent}40`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.3rem',
      }}>{icon}</div>
      <div style={{ paddingTop: 4 }}>
        <div style={{
          fontFamily: "'JetBrains Mono Variable', monospace",
          fontSize: '0.62rem',
          letterSpacing: '0.15em',
          color: accent,
          textTransform: 'uppercase',
          marginBottom: 4,
        }}>Step {n}</div>
        <h3 style={{
          fontFamily: "'Syne Variable', sans-serif",
          fontSize: '1.1rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 6,
        }}>{heading}</h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>{body}</p>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function FineTuningTeaser() {
  return (
    <>
      <SEO
        title="NDN Model Studio — Fine-Tune Any Hugging Face Model on Vertex AI"
        description="Train any open-source model from Hugging Face on Google Cloud Vertex AI, then deploy to Firebase or download. No DevOps required. Join the early access waitlist."
        keywords="fine tuning, Hugging Face, Vertex AI, Google Cloud, Firebase deploy, LLM fine tuning, custom AI model, NDN Analytics"
        canonicalPath="/fine-tuning"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Products', path: '/products' },
          { name: 'NDN Model Studio', path: '/fine-tuning' },
        ]}
      />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section style={{ minHeight: '100vh', paddingTop: 140, paddingBottom: 80, position: 'relative', display: 'flex', alignItems: 'center' }}>
        {/* Accent glow */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 700,
          height: 400,
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6,182,212,0.13) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 800 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: 'rgba(6,182,212,0.08)',
              border: '1px solid rgba(6,182,212,0.2)',
              borderRadius: 100,
              padding: '6px 16px',
              marginBottom: 32,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--brand-cyan)', display: 'inline-block', animation: 'softPulse 2s infinite' }} />
              <span style={{
                fontFamily: "'JetBrains Mono Variable', monospace",
                fontSize: '0.68rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--brand-cyan)',
              }}>Coming Soon — Early Access Open</span>
            </div>

            <h1 style={{
              fontFamily: "'Syne Variable', sans-serif",
              fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
              fontWeight: 900,
              lineHeight: 1.05,
              color: 'var(--text-primary)',
              marginBottom: 28,
            }}>
              NDN{' '}
              <span style={{
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Model Studio
              </span>
            </h1>

            <p style={{
              fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.8,
              maxWidth: 680,
              marginBottom: 20,
            }}>
              Fine-tune <strong style={{ color: 'var(--text-primary)' }}>any model from Hugging Face</strong> using
              Google's enterprise-grade <strong style={{ color: 'var(--text-primary)' }}>Vertex AI</strong> — then
              deploy it instantly to <strong style={{ color: 'var(--text-primary)' }}>Firebase</strong> or
              download it as a portable artifact. No DevOps. No PhD required.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 56 }}>
              {[
                '🤗 Hugging Face Hub',
                '☁ Google Vertex AI',
                '🔥 Firebase Deploy',
                '⬇ GGUF / ONNX Export',
              ].map(tag => (
                <span key={tag} style={{
                  fontFamily: "'JetBrains Mono Variable', monospace",
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 6,
                  padding: '6px 14px',
                  letterSpacing: '0.06em',
                }}>{tag}</span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <a href="#early-access" className="btn btn-primary" style={{ fontSize: '1rem', padding: '14px 32px' }}
                onClick={() => trackCTAClick('early_access_hero', 'fine_tuning_teaser')}>
                Get Early Access →
              </a>
              <a href="#how-it-works" className="btn btn-ghost" style={{ fontSize: '1rem', padding: '14px 32px' }}>
                See How It Works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE MARKET GAP ───────────────────────────────────────────────── */}
      <section style={{ padding: '96px 0', background: 'rgba(3,15,32,0.7)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{
            fontFamily: "'JetBrains Mono Variable', monospace",
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--brand-cyan)',
            marginBottom: 16,
          }}>The Problem</div>
          <h2 style={{
            fontFamily: "'Syne Variable', sans-serif",
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 900,
            color: 'var(--text-primary)',
            marginBottom: 20,
            maxWidth: 700,
          }}>
            Fine-tuning is broken for everyone who isn't Google.
          </h2>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.08rem',
            lineHeight: 1.85,
            maxWidth: 740,
            marginBottom: 64,
          }}>
            80% of enterprise AI value comes from <em>customized</em> models — not generic ones.
            But the tooling to get there sits behind steep infrastructure bills, scattered YAML configs,
            CUDA driver hell, and vendor lock-in. Teams with million-dollar budgets ship custom models.
            Everyone else ships prompts and hopes for the best.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20,
            marginBottom: 0,
          }}>
            <GapCard
              icon="💸"
              heading="Cloud bills you can't predict"
              body="Running a fine-tune job on raw Vertex AI requires custom training pipelines, quota increases, and a DevOps team just to track spend. A single mistake costs thousands before you realize it."
            />
            <GapCard
              icon="🧩"
              heading="No unified workflow"
              body="Today: download model from Hugging Face, manually convert, push to a GCS bucket, write a custom training script, pray the job completes, figure out serving. That's 4–6 days for an ML engineer."
            />
            <GapCard
              icon="🔒"
              heading="Deployment is a second project"
              body="Getting a trained model into production means spinning up a prediction endpoint, writing inference wrappers, managing versions, and monitoring — all before users see a single response."
            />
            <GapCard
              icon="📦"
              heading="Open source isn't enterprise-ready"
              body="Tools like Axolotl or LLaMA-Factory are powerful — but they require local GPU rigs or raw cloud VMs with days of setup. There's no managed, enterprise-secure alternative."
            />
          </div>
        </div>
      </section>

      {/* ── WHY NOW ──────────────────────────────────────────────────────── */}
      <section style={{ padding: '96px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            <div>
              <div style={{
                fontFamily: "'JetBrains Mono Variable', monospace",
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--brand-cyan)',
                marginBottom: 16,
              }}>Why Now</div>
              <h2 style={{
                fontFamily: "'Syne Variable', sans-serif",
                fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
                fontWeight: 900,
                color: 'var(--text-primary)',
                marginBottom: 24,
                lineHeight: 1.15,
              }}>
                The model proliferation moment is here.
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, marginBottom: 20, fontSize: '0.95rem' }}>
                Hugging Face now hosts over <strong style={{ color: 'var(--text-primary)' }}>900,000 models</strong>.
                Meta, Mistral, Google, and the open-source community ship breakthrough models weekly.
                The barrier to a custom AI is no longer <em>what model to use</em> — it's
                <em> how do I train and ship it fast</em>.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, marginBottom: 20, fontSize: '0.95rem' }}>
                Google's Vertex AI is the most powerful managed ML platform on the planet —
                but it's designed for ML engineers, not product teams. NDN Model Studio puts
                Vertex AI behind an interface any team member can actually use.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '0.95rem' }}>
                Firebase's serverless deployment means your newly trained model can be live in
                production — auto-scaling, zero cold start management — in under two minutes from
                training completion. No Kubernetes. No SRE ticket.
              </p>
            </div>

            {/* stats panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { value: '900K+', label: 'Models on Hugging Face Hub', accent: '#06B6D4' },
                { value: '73%',   label: 'of enterprises plan custom LLM deployment in 2025', accent: '#3B82F6' },
                { value: '4–6×',  label: 'faster iteration vs self-managed GPU clusters', accent: '#8B5CF6' },
                { value: '~$0',   label: 'cold-start latency with Firebase Functions v2', accent: '#06B6D4' },
              ].map(s => (
                <div key={s.label} style={{
                  background: 'var(--bg-surface)',
                  border: `1px solid ${s.accent}25`,
                  borderLeft: `3px solid ${s.accent}`,
                  borderRadius: 12,
                  padding: '20px 24px',
                  display: 'flex',
                  gap: 20,
                  alignItems: 'center',
                }}>
                  <div style={{
                    fontFamily: "'Syne Variable', sans-serif",
                    fontSize: '1.9rem',
                    fontWeight: 900,
                    color: s.accent,
                    flexShrink: 0,
                    lineHeight: 1,
                  }}>{s.value}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: '96px 0', background: 'rgba(3,15,32,0.7)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{
            fontFamily: "'JetBrains Mono Variable', monospace",
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--brand-cyan)',
            marginBottom: 16,
          }}>How It Works</div>
          <h2 style={{
            fontFamily: "'Syne Variable', sans-serif",
            fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
            fontWeight: 900,
            color: 'var(--text-primary)',
            marginBottom: 16,
          }}>From dataset to deployed model in four steps.</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.75, maxWidth: 620, marginBottom: 64 }}>
            No YAML files. No CUDA environments. No infra expertise required — just your data and a goal.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40 }}>
            <Step
              n={1}
              icon="🤗"
              heading="Pick any model from Hugging Face"
              body="Search 900,000+ open-source models — Llama 3, Mistral, Phi-3, Gemma, Qwen, Falcon, and more. Paste the model ID or browse by task. NDN Model Studio handles the download and conversion automatically."
              accent="#06B6D4"
            />
            <Step
              n={2}
              icon="📊"
              heading="Upload your training dataset"
              body="Drag-and-drop JSONL, CSV, or connect a BigQuery table. Configure your fine-tuning parameters — epochs, learning rate, LoRA rank — with intelligent defaults that work for most use cases."
              accent="#3B82F6"
            />
            <Step
              n={3}
              icon="⚡"
              heading="Train on Google Vertex AI"
              body="We provision a managed Vertex AI training job — you watch a live progress dashboard. Enterprise-grade GPU clusters, automatic checkpointing, VRAM-aware batch sizing, and spend guardrails built in."
              accent="#8B5CF6"
            />
            <Step
              n={4}
              icon="🚀"
              heading="Deploy to Firebase or export"
              body="One click to deploy as a serverless Firebase Function endpoint — auto-scaling, zero cold-start config. Or export as GGUF, ONNX, or SafeTensors for your own infrastructure. You own the weights."
              accent="#06B6D4"
            />
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ─────────────────────────────────────────────────── */}
      <section style={{ padding: '96px 0' }}>
        <div className="container">
          <div style={{
            fontFamily: "'JetBrains Mono Variable', monospace",
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--brand-cyan)',
            marginBottom: 16,
          }}>Who It's For</div>
          <h2 style={{
            fontFamily: "'Syne Variable', sans-serif",
            fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
            fontWeight: 900,
            color: 'var(--text-primary)',
            marginBottom: 56,
          }}>Built for builders, not just ML engineers.</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {[
              {
                icon: '🏢',
                role: 'Enterprise Teams',
                body: 'Customise a foundation model on your proprietary data — contracts, support tickets, internal docs — with data never leaving Google Cloud.',
                accent: '#06B6D4',
              },
              {
                icon: '🔬',
                role: 'Researchers',
                body: 'Run reproducible fine-tuning experiments on Vertex AI at scale without managing clusters. Export results in standard formats.',
                accent: '#3B82F6',
              },
              {
                icon: '🚀',
                role: 'Startups',
                body: 'Ship a differentiated AI product — a custom model trained on your vertical data — without hiring an ML platform team.',
                accent: '#8B5CF6',
              },
              {
                icon: '👩‍💻',
                role: 'Developers',
                body: 'API-first access. Train via UI or programmatically. Webhook on completion. Integrate into your CI/CD pipeline. Your model, your infrastructure.',
                accent: '#06B6D4',
              },
            ].map(item => (
              <div key={item.role} style={{
                background: 'var(--bg-surface)',
                border: `1px solid ${item.accent}20`,
                borderTop: `2px solid ${item.accent}`,
                borderRadius: 12,
                padding: '28px 24px',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 14 }}>{item.icon}</div>
                <h3 style={{
                  fontFamily: "'Syne Variable', sans-serif",
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 10,
                }}>{item.role}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EARLY ACCESS FORM ─────────────────────────────────────────────── */}
      <section id="early-access" style={{
        padding: '96px 0 120px',
        background: 'rgba(3,15,32,0.7)',
        borderTop: '1px solid var(--border-subtle)',
      }}>
        <div className="container" style={{ maxWidth: 720, margin: '0 auto' }}>
          {/* Icon */}
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(6,182,212,0.1)',
            border: '1px solid rgba(6,182,212,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            marginBottom: 28,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>🧠</div>

          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{
              fontFamily: "'JetBrains Mono Variable', monospace",
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--brand-cyan)',
              marginBottom: 16,
            }}>Early Access</div>
            <h2 style={{
              fontFamily: "'Syne Variable', sans-serif",
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 900,
              color: 'var(--text-primary)',
              marginBottom: 16,
              lineHeight: 1.1,
            }}>Be the first to train with NDN Model Studio.</h2>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '1rem',
              lineHeight: 1.8,
              maxWidth: 560,
              margin: '0 auto',
            }}>
              We're onboarding a limited cohort of early users. You'll get direct access to the team,
              priority support, and founding-member pricing when we launch.
            </p>
          </div>

          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 20,
            padding: '44px 40px',
          }}>
            <EarlyAccessForm />
          </div>

          {/* Trust badges */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 24,
            marginTop: 40,
          }}>
            {[
              '☁ Powered by Google Vertex AI',
              '🔥 Deployed on Firebase',
              '🤗 Hugging Face native',
              '🔒 SOC 2 compliant infra',
            ].map(badge => (
              <span key={badge} style={{
                fontFamily: "'JetBrains Mono Variable', monospace",
                fontSize: '0.72rem',
                color: 'var(--text-tertiary)',
                letterSpacing: '0.08em',
              }}>{badge}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM NAV ───────────────────────────────────────────────────── */}
      <div style={{ padding: '32px 0', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
        <Link to="/products" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
          ← Back to all products
        </Link>
      </div>
    </>
  );
}
