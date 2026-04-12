// Case study data definitions
export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  client: {
    name: string;
    industry: string;
    size: string;
    logo?: string;
  };
  challenge: string;
  solution: string;
  results: {
    metric: string;
    value: string;
    description: string;
  }[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
  timeline: string;
  technologies: string[];
  relatedProducts: string[];
  featured: boolean;
  publishedAt: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs-001',
    slug: 'regional-grocery-demand-forecasting',
    title: 'AI-Powered Demand Forecasting Transforms Regional Grocery Chain',
    subtitle: 'How NDN Demand IQ reduced stockouts by 45% and improved forecast accuracy by 32% across 150+ store locations',
    client: {
      name: 'Confidential — Southeastern US Grocery Retailer',
      industry: 'Retail / Grocery',
      size: '150+ stores, $2.1B annual revenue, 8,000 SKUs',
    },
    challenge: 'The client\'s 150-store network relied on a 15-year-old inventory system that produced weekly aggregate forecasts — no SKU-level or store-level precision. Manual buyer overrides introduced inconsistency across regions, leading to $12M annual losses from perishable write-offs and an 11% stockout rate on top-50 items. Category managers spent 60% of their week on forecast correction instead of supplier strategy.',
    solution: 'We deployed NDN Demand IQ in a 12-week engagement. Phase 1 unified 3 years of POS data, promotional calendars, weather feeds, and competitor pricing into a BigQuery warehouse. Phase 2 trained gradient-boosted ensemble models per product category with weekly automated retraining. Phase 3 integrated AI-generated replenishment orders directly into the client\'s existing Oracle Retail system — no workflow changes for store teams.',
    results: [
      {
        metric: 'Forecast Accuracy',
        value: '+32%',
        description: 'MAPE improvement vs. legacy system baseline (measured over 90 days post-launch)',
      },
      {
        metric: 'Stockout Rate',
        value: '45% drop',
        description: 'Top-50 item stockouts fell from 11% to 6.1% in the first quarter',
      },
      {
        metric: 'Waste Reduction',
        value: '$4.2M',
        description: 'First-year annualised savings from reduced perishable write-offs',
      },
      {
        metric: 'Time to ROI',
        value: '9 weeks',
        description: 'Positive return on implementation investment achieved before full go-live',
      },
    ],
    testimonial: {
      quote: 'We went from gut-feel ordering to data-driven precision in under three months. What surprised us most was how little had to change for store teams — the AI worked inside the systems they already used. Our category managers now spend their time on strategy, not spreadsheets.',
      author: 'VP of Supply Chain',
      role: 'Southeastern US Grocery Retailer (150+ stores)',
    },
    timeline: '12 weeks implementation',
    technologies: ['Google Cloud Platform', 'BigQuery', 'Vertex AI', 'Cloud Functions'],
    relatedProducts: ['ndn-001'],
    featured: true,
    publishedAt: '2026-03-15',
  },
  {
    id: 'cs-002',
    slug: 'pharma-supply-chain-traceability',
    title: 'Blockchain Traceability Ensures Pharmaceutical Supply Chain Integrity',
    subtitle: 'How NDN TraceChain delivered 100% FDA DSCSA compliance and cut audit time by 85% for a national pharmaceutical distributor',
    client: {
      name: 'Confidential — National Pharmaceutical Distributor',
      industry: 'Healthcare / Pharmaceuticals',
      size: '500+ supplier relationships, $5.3B annual distribution volume',
    },
    challenge: 'FDA DSCSA Phase II enforcement (November 2024 deadline) required complete electronic chain-of-custody documentation at the package level for all prescription drugs. The client\'s legacy EDI system captured lot-level data but couldn\'t provide the unit-level serialisation trail regulators demanded. Non-compliance exposure: potential loss of $50M+ in distribution contracts and DEA licensing risk.',
    solution: 'NDN TraceChain was deployed in 16 weeks across the client\'s 3 distribution centres and integrated with 120 supplier EDI feeds. Every package movement — receipt, pick, pack, ship — is recorded as a cryptographically signed transaction on a private Ethereum network anchored to the Ethereum mainnet every 6 hours. A REST API layer exposes verification endpoints to regulators and trading partners without exposing the chain directly.',
    results: [
      {
        metric: 'Compliance Rate',
        value: '100%',
        description: 'DSCSA unit-level traceability achieved 3 weeks ahead of enforcement deadline',
      },
      {
        metric: 'Audit Duration',
        value: '–85%',
        description: 'FDA inspection response time: from 2 weeks of manual retrieval to 4 hours via API query',
      },
      {
        metric: 'Dispute Resolution',
        value: '4 hours',
        description: 'Supplier disputes resolved via on-chain audit trail (was 2 weeks average)',
      },
      {
        metric: 'Annual Savings',
        value: '$2.1M',
        description: 'Compliance labour and dispute resolution costs eliminated in year 1',
      },
    ],
    testimonial: {
      quote: 'When the FDA inspector arrived, we pulled the complete chain-of-custody for any unit in our facility in under 30 seconds. That\'s not something our legacy system could have done in 30 days. NDN TraceChain is now core infrastructure — not optional.',
      author: 'Chief Compliance Officer',
      role: 'National Pharmaceutical Distributor ($5B volume)',
    },
    timeline: '16 weeks implementation',
    technologies: ['Ethereum', 'IPFS', 'Google Cloud Platform', 'Smart Contracts'],
    relatedProducts: ['ndn-005'],
    featured: true,
    publishedAt: '2026-02-28',
  },
  {
    id: 'cs-003',
    slug: 'hospital-readmission-prevention',
    title: 'AI Predicts and Prevents Hospital Readmissions Before Patients Leave',
    subtitle: 'How NDN Care Predict reduced 30-day readmissions by 28% and avoided $5.2M in CMS penalties for a 12-hospital health system',
    client: {
      name: 'Confidential — Mid-Atlantic Regional Health System',
      industry: 'Healthcare',
      size: '12 hospitals, 2.3M patient encounters/year, 8,400 licensed beds',
    },
    challenge: 'CMS excess readmission penalties had reached $8.3M annually — one of the highest rates among regional health systems in the Mid-Atlantic. Traditional risk scoring (LACE index) was catching only 38% of patients who would actually readmit. Care coordinators were drowning in manual chart reviews with no way to prioritise which patients needed intervention before discharge. Average time from risk flag to intervention: 28 hours — often after the discharge had already been processed.',
    solution: 'NDN Care Predict was deployed via Epic FHIR APIs across all 12 hospitals in a 20-week phased rollout. The model ingests 200+ real-time signals — vital trends, lab trajectories, medication fill patterns, social determinants, and care team notes — scoring each patient every 4 hours. High-risk alerts surface directly in nursing Epic workflows with specific intervention recommendations. The model was trained on 3 years of system-specific patient data for local calibration.',
    results: [
      {
        metric: '30-day Readmissions',
        value: '–28%',
        description: 'System-wide reduction in 30-day all-cause readmissions within 6 months of go-live',
      },
      {
        metric: 'CMS Penalty Avoided',
        value: '$5.2M',
        description: 'Annual reduction in excess readmission penalty payments (year 1 actuals)',
      },
      {
        metric: 'Risk Detection Accuracy',
        value: '94%',
        description: 'Sensitivity in identifying patients who readmit (vs 38% for LACE baseline)',
      },
      {
        metric: 'Coordinator Throughput',
        value: '3× more',
        description: 'Patients reviewed per care coordinator per shift via AI-prioritised worklists',
      },
    ],
    testimonial: {
      quote: 'We\'ve tried three different readmission tools over the past decade. None of them did what NDN Care Predict does: identify the patients our clinicians would have missed, inside the EMR they already use, and tell them specifically what to do. The 28% reduction is real — we can trace it patient by patient.',
      author: 'Chief Medical Officer',
      role: 'Mid-Atlantic Regional Health System (12 hospitals)',
    },
    timeline: '20 weeks implementation',
    technologies: ['Google Cloud Platform', 'Vertex AI', 'FHIR', 'HL7'],
    relatedProducts: ['ndn-002'],
    featured: true,
    publishedAt: '2026-01-20',
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find(cs => cs.slug === slug);
}

export function getFeaturedCaseStudies(): CaseStudy[] {
  return CASE_STUDIES.filter(cs => cs.featured);
}

export function getCaseStudiesByProduct(productId: string): CaseStudy[] {
  return CASE_STUDIES.filter(cs => cs.relatedProducts.includes(productId));
}
