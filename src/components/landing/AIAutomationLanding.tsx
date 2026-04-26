import ServiceLandingPage from './ServiceLandingPage';
import type { ServiceLandingConfig } from './ServiceLandingPage';

const CONFIG: ServiceLandingConfig = {
  slug: 'ai-automation',
  eyebrow: 'AI Automation',
  h1: 'AI Workflow Automation,',
  h1Highlight: 'That Actually Runs.',
  subhead: [
    'AI agents and intelligent workflow automation for back-office, operations, support, and revenue teams.',
    'We replace manual reconciliation, copy-paste data entry, ticket triage, and report stitching with reliable, monitored agents that integrate with the systems you already use.',
  ],
  seoTitle: 'AI Workflow Automation for SMEs and Enterprises',
  seoDescription:
    'AI workflow automation services from NDN Analytics. We build production-grade AI agents and automation pipelines that eliminate manual data entry, ticket triage, reconciliation, and reporting work — integrated with your existing stack.',
  seoKeywords:
    'AI automation, AI workflow automation for SMEs, AI agents, business process automation, intelligent automation, RPA with AI, AI document processing, AI ticket triage, agentic workflow automation',
  serviceName: 'AI Workflow Automation',
  serviceType: 'AI agent and workflow automation development',
  productIds: ['ndn-001', 'ndn-003', 'ndn-004', 'ndn-012'],
  deliverables: [
    {
      title: 'Working AI agents',
      body: 'Production agents that read your tickets, documents, emails, or events and take action — written with explicit tool schemas, retry logic, and human-in-the-loop approval where the stakes call for it.',
    },
    {
      title: 'Workflow integrations',
      body: 'Connectors to Salesforce, HubSpot, Zendesk, Intercom, Slack, Gmail, Notion, BigQuery, Postgres, S3 — wherever the work actually happens. We do not ask your team to switch tools to make automation work.',
    },
    {
      title: 'Observability and guardrails',
      body: 'Every agent action is logged, every cost is attributed, every failure is retried with backoff. You see exactly what the agent did, what it cost, and what it skipped — not a black box.',
    },
    {
      title: 'Measurable hours-saved baseline',
      body: 'We instrument the workflow before automating it, so the ROI conversation is grounded in actual hours saved per week — not a vendor-supplied case study from a different industry.',
    },
  ],
  industries: ['SaaS / B2B Software', 'Professional Services', 'Financial Services', 'E-commerce', 'Healthcare Operations', 'Legal & Compliance', 'Customer Support'],
  faqs: [
    {
      question: 'How is this different from RPA tools like UiPath or Zapier?',
      answer:
        'Traditional RPA records keystrokes and breaks the moment a UI changes. Zapier-style flows handle simple if-this-then-that triggers. AI automation handles the messy middle: reading an unstructured email, deciding which of 12 ticket categories it belongs to, drafting a context-aware reply, and only escalating the cases that need a human. We use Zapier and similar tools as glue when they fit, but the intelligence layer is custom.',
    },
    {
      question: 'What kinds of workflows are good automation candidates?',
      answer:
        'High-volume, rule-following work that still needs judgment: ticket triage and routing, invoice and contract intake, sales lead qualification, KYC document review, expense report categorization, internal report stitching from multiple data sources, and onboarding email sequences. The pattern: high frequency, costly to outsource, painful to scale linearly.',
    },
    {
      question: 'Will the AI hallucinate or make up data?',
      answer:
        'Hallucination is a design problem, not a model problem. We design agents with explicit tool schemas (the model can only call defined functions, with typed inputs and outputs), retrieval-grounded context (it cites the source document for every claim), and confidence thresholds (low-confidence outputs go to a human queue). For high-stakes workflows, we add eval harnesses that catch drift before it reaches production.',
    },
    {
      question: 'What does an AI Automation Audit cover?',
      answer:
        'A working session where we map your team\'s actual hours-per-week against specific repetitive workflows, then score each workflow for automation feasibility (data structure, decision complexity, integration surface, risk profile). The output is a ranked backlog with rough effort estimates — so you can decide which one to build first based on real ROI, not a vendor pitch.',
    },
  ],
};

export default function AIAutomationLanding() {
  return <ServiceLandingPage config={CONFIG} />;
}
