import ServiceLandingPage from './ServiceLandingPage';
import type { ServiceLandingConfig } from './ServiceLandingPage';

const CONFIG: ServiceLandingConfig = {
  slug: 'google-cloud-ai-consulting',
  eyebrow: 'Google Cloud AI Consulting',
  h1: 'Ship AI on Google Cloud,',
  h1Highlight: 'Without the Sprawl.',
  subhead:
    'Vertex AI, BigQuery, Cloud Run, Firebase. We architect, build, and deploy AI systems on Google Cloud Platform — with FinOps guardrails, IAM done right, and an architecture your team can actually maintain after we hand it over.',
  seoTitle: 'Google Cloud AI Consulting Services',
  seoDescription:
    'Google Cloud AI consulting services from NDN Analytics. Vertex AI, BigQuery, and Cloud Run architecture, deployment, fine-tuning, and ML pipelines — built by engineers, not slide decks.',
  seoKeywords:
    'Google Cloud AI consulting, GCP AI consulting services, Vertex AI consulting, BigQuery ML consulting, Cloud Run deployment, GCP machine learning consulting, Google Cloud architecture',
  serviceName: 'Google Cloud AI Consulting',
  serviceType: 'Google Cloud Platform AI consulting and implementation',
  productIds: ['ndn-001', 'ndn-002', 'ndn-003', 'ndn-004', 'ndn-012'],
  deliverables: [
    {
      title: 'Vertex AI architecture',
      body: 'Training pipelines, model registry, and serving endpoints designed around your data flow — with retraining, evaluation, and drift detection wired in from day one, not bolted on later.',
    },
    {
      title: 'BigQuery + ML feature pipelines',
      body: 'Feature engineering on BigQuery (with Dataform or dbt), connected to Vertex AI training jobs. Your model retrains on the same canonical data your analytics team already trusts.',
    },
    {
      title: 'Serverless inference on Cloud Run',
      body: 'Autoscaling inference endpoints with near-zero cold start, configurable concurrency, and IAM-scoped access — billed per request, not per always-on instance.',
    },
    {
      title: 'FinOps + IAM guardrails',
      body: 'Budget alerts, project-level cost attribution, IAM principle-of-least-privilege, and quota guards. So the AI workload does not become the surprise line item on next quarter\'s cloud bill.',
    },
  ],
  industries: ['Retail', 'Healthcare', 'Logistics', 'SaaS', 'Manufacturing', 'Financial Services'],
  faqs: [
    {
      question: 'Are you a certified Google Cloud Partner?',
      answer:
        'We build on Google Cloud as our primary AI platform and have shipped production workloads across Vertex AI, BigQuery, Cloud Run, Firebase, and Cloud Functions. Partner certification is a procurement detail; what matters for the build is whether the engineer has actually deployed Vertex AI training pipelines under load. We have.',
    },
    {
      question: 'Can you migrate an existing model from AWS or Azure to GCP?',
      answer:
        'Yes. Migrations typically involve repackaging the training pipeline (PyTorch / TF / scikit-learn → Vertex AI custom containers), re-pointing the data layer to BigQuery or Cloud Storage, and rewriting the serving endpoint as Cloud Run or Vertex AI Endpoints. Most migrations are 4–8 weeks depending on data volume and integration surface.',
    },
    {
      question: 'How do you keep cloud costs under control?',
      answer:
        'Three things: training jobs use spot/preemptible GPUs by default with auto-resume; inference uses Cloud Run with concurrency tuned to the actual traffic profile; and every project ships with a cost dashboard, monthly budget alerts, and IAM constraints that prevent accidental high-cost service activation.',
    },
    {
      question: 'Do you handle the IAM and security setup, or just the model?',
      answer:
        'Both, because they are not separable. We set up service accounts, Workload Identity bindings, VPC Service Controls where needed, audit logging, and Secret Manager integration as part of the build — not as a follow-up engagement.',
    },
  ],
};

export default function GoogleCloudAILanding() {
  return <ServiceLandingPage config={CONFIG} />;
}
