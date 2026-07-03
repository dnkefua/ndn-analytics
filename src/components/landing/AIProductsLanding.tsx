import ServiceLandingPage from './ServiceLandingPage';
import type { ServiceLandingConfig } from './ServiceLandingPage';

const CONFIG: ServiceLandingConfig = {
  slug: 'ai-products',
  eyebrow: 'AI Products',
  h1: 'Custom AI Products,',
  h1Highlight: 'Built for Your Business.',
  subhead:
    'NDN Analytics designs, builds, and deploys focused AI products on Google Cloud — from demand forecasting and patient risk scoring to last-mile routing and SaaS churn prevention. Production AI without the consulting overhead.',
  seoTitle: 'Custom AI Software Development Company',
  seoDescription:
    'Custom AI software development on Google Cloud. NDN Analytics builds focused AI products for retail demand forecasting, healthcare readmission risk, last-mile routing, and SaaS churn prevention.',
  seoKeywords:
    'custom AI software development company, AI product development, machine learning consulting, AI on Google Cloud, Vertex AI development, enterprise AI products, AI workflow automation',
  serviceName: 'AI Product Development',
  serviceType: 'Custom AI software development',
  productIds: ['ndn-001', 'ndn-002', 'ndn-003', 'ndn-004', 'ndn-010', 'ndn-011', 'ndn-012'],
  deliverables: [
    {
      title: 'Production model + deployment',
      body: 'A trained model deployed on Vertex AI or Cloud Run, with retraining pipelines, evaluation hooks, and a serverless inference endpoint your stack can call.',
    },
    {
      title: 'Working integration with your data',
      body: 'BigQuery / Firestore / Postgres connectors, ETL where needed, and a feature pipeline calibrated on your historical data — not a generic demo.',
    },
    {
      title: 'Monitoring and guardrails',
      body: 'Drift monitoring, prediction logging, fallback rules, and spend guardrails so the model behaves predictably in production, not just in training.',
    },
    {
      title: 'Direct founder-engineer access',
      body: 'No account-management layer. The engineer architecting your build is the one in the working sessions, fixing the bugs, and on the post-deploy support call.',
    },
  ],
  industries: ['Retail', 'Healthcare', 'Logistics', 'SaaS / B2B Software', 'Real Estate', 'Financial Services'],
  faqs: [
    {
      question: 'Do you build new AI products from scratch, or just deploy off-the-shelf models?',
      answer:
        'Both. Most engagements blend the two: we use foundation models (open-source LLMs, time-series transformers, vision backbones) as a base, then fine-tune or compose them around your data and your specific problem. Pure off-the-shelf rarely beats a focused fine-tune on your own historical data.',
    },
    {
      question: 'How long does a typical AI product build take?',
      answer:
        'A focused MVP build is usually 6–12 weeks from kickoff to a deployed endpoint your team can call in production. A larger multi-team rollout — with EHR/ERP integration, compliance work, and multiple training pipelines — is typically 3–6 months. We give you a realistic timeline in the discovery call.',
    },
    {
      question: 'What does an AI Readiness Assessment include?',
      answer:
        'A working session that produces a problem framing (what you are actually trying to predict or automate), a data audit (what signals you have vs. need), a reference architecture, a phased roadmap, and a realistic ROI projection. The output is something you can take to your exec team for a build/no-build decision.',
    },
    {
      question: 'Do you work with companies outside the US?',
      answer:
        'Yes. We work with companies globally. The build runs over async + scheduled working sessions; the deployment lives wherever your data needs it to (US, EU, or other GCP regions for residency requirements).',
    },
  ],
};

export default function AIProductsLanding() {
  return <ServiceLandingPage config={CONFIG} />;
}
