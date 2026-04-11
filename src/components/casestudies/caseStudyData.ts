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
    subtitle: 'How NDN Demand IQ reduced stockouts by 45% and improved forecast accuracy by 32%',
    client: {
      name: 'Regional Grocery Chain',
      industry: 'Retail / Grocery',
      size: '150+ stores, $2B annual revenue',
    },
    challenge: 'The client struggled with inconsistent demand forecasting across their 150+ store locations. Manual forecasting led to frequent stockouts of popular items and excess inventory of slow-moving products, resulting in $12M annual losses from waste and missed sales.',
    solution: 'We deployed NDN Demand IQ, our AI-powered demand forecasting platform built on Google Cloud Platform. The system analyzes historical sales data, seasonal patterns, local events, weather data, and competitor pricing to generate SKU-level forecasts with 95%+ accuracy.',
    results: [
      {
        metric: 'Forecast Accuracy',
        value: '+32%',
        description: 'Improvement in demand prediction accuracy',
      },
      {
        metric: 'Stockout Reduction',
        value: '45%',
        description: 'Fewer out-of-stock incidents',
      },
      {
        metric: 'Waste Reduction',
        value: '$4.2M',
        description: 'Annual savings from reduced inventory waste',
      },
      {
        metric: 'ROI Timeline',
        value: '90 days',
        description: 'Time to positive return on investment',
      },
    ],
    testimonial: {
      quote: 'We went from gut-feel ordering to data-driven precision. Our store managers now trust the system completely, and our customers find what they need on the shelves.',
      author: 'VP of Operations',
      role: 'Regional Grocery Chain',
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
    subtitle: 'How NDN TraceChain helped a pharmaceutical distributor achieve 100% compliance',
    client: {
      name: 'National Pharmaceutical Distributor',
      industry: 'Healthcare / Pharmaceuticals',
      size: '500+ suppliers, $5B annual volume',
    },
    challenge: 'New FDA regulations required complete chain-of-custody documentation for all pharmaceutical products. The client\'s legacy systems couldn\'t provide the immutable audit trail required, risking $50M+ in compliance penalties and potential loss of distribution licenses.',
    solution: 'We implemented NDN TraceChain, our Ethereum-based supply chain traceability platform. Every product movement is recorded on-chain with tamper-proof timestamps, creating an immutable record from manufacturer to pharmacy.',
    results: [
      {
        metric: 'Compliance Rate',
        value: '100%',
        description: 'Full regulatory compliance achieved',
      },
      {
        metric: 'Audit Time',
        value: '-85%',
        description: 'Reduction in compliance audit duration',
      },
      {
        metric: 'Dispute Resolution',
        value: '4 hours',
        description: 'Average time to resolve supply chain disputes (vs 2 weeks)',
      },
      {
        metric: 'Cost Savings',
        value: '$2.1M',
        description: 'Annual savings from automated compliance',
      },
    ],
    testimonial: {
      quote: 'The blockchain audit trail gives us complete confidence in our supply chain. When regulators ask questions, we have immutable proof in seconds.',
      author: 'Chief Compliance Officer',
      role: 'National Pharmaceutical Distributor',
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
    title: 'AI Predicts and Prevents Hospital Readmissions',
    subtitle: 'How NDN Care Predict reduced 30-day readmissions by 28% for a regional health system',
    client: {
      name: 'Regional Health System',
      industry: 'Healthcare',
      size: '12 hospitals, 2M+ patient encounters/year',
    },
    challenge: 'The health system faced CMS penalties exceeding $8M annually due to high 30-day readmission rates. Traditional risk scoring missed many high-risk patients, and care coordinators were overwhelmed with manual chart reviews.',
    solution: 'We deployed NDN Care Predict across all 12 hospitals. The AI model analyzes 200+ patient factors in real-time—clinical data, social determinants, medication adherence patterns—to identify patients at risk before discharge.',
    results: [
      {
        metric: 'Readmission Reduction',
        value: '28%',
        description: 'Decrease in 30-day readmissions',
      },
      {
        metric: 'Penalty Avoidance',
        value: '$5.2M',
        description: 'Annual CMS penalty reduction',
      },
      {
        metric: 'Risk Identification',
        value: '94%',
        description: 'Accuracy in predicting high-risk patients',
      },
      {
        metric: 'Staff Efficiency',
        value: '3x',
        description: 'More patients reviewed per care coordinator',
      },
    ],
    testimonial: {
      quote: 'The AI identifies patients our traditional tools miss. We can now intervene proactively instead of reacting after a readmission occurs.',
      author: 'Chief Medical Officer',
      role: 'Regional Health System',
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
