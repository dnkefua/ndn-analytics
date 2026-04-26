// Reference implementation scenarios — illustrate product capabilities against realistic industry challenges.
// These are not actual client engagements; they are modeled scenarios based on product architecture and domain research.
export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  isReferenceImplementation: true;
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
    isReferenceImplementation: true,
    title: 'AI Demand Forecasting for High-SKU Grocery Retail',
    subtitle: 'Reference implementation: how NDN Demand IQ addresses stockout reduction and forecast accuracy for mid-scale grocery retailers operating 100–200 locations',
    client: {
      name: 'Reference Scenario — Southeastern US Grocery Retailer',
      industry: 'Retail / Grocery',
      size: 'Scenario scale: 100–200 stores, 6,000–10,000 SKUs',
    },
    challenge: 'A mid-scale grocery retailer operating 100–200 stores relies on legacy weekly aggregate forecasts with no SKU-level or store-level precision. Manual buyer overrides introduce inconsistency across regions, contributing to perishable write-offs and stockout rates on top-moving items. Category managers spend a disproportionate share of their week correcting forecasts rather than working on supplier strategy.',
    solution: 'NDN Demand IQ is deployed in a phased engagement. Phase 1 consolidates POS data, promotional calendars, weather feeds, and competitor pricing into a BigQuery warehouse. Phase 2 trains gradient-boosted ensemble models per product category with weekly automated retraining. Phase 3 integrates AI-generated replenishment signals directly into the retailer\'s existing ERP system — no workflow changes required for store teams.',
    results: [
      {
        metric: 'Forecast Accuracy',
        value: '+32%',
        description: 'Modeled MAPE improvement vs. legacy weekly-aggregate baseline over a 90-day evaluation window',
      },
      {
        metric: 'Stockout Rate',
        value: '~45% drop',
        description: 'Modeled reduction in top-item stockouts based on improved replenishment signal precision',
      },
      {
        metric: 'Waste Reduction',
        value: 'Significant',
        description: 'Perishable write-off savings scale with store count and SKU volume; modeled from industry benchmarks',
      },
      {
        metric: 'Time to Value',
        value: '8–12 wks',
        description: 'Typical phased rollout timeline from data onboarding to live replenishment signals',
      },
    ],
    timeline: '8–12 week reference implementation',
    technologies: ['Google Cloud Platform', 'BigQuery', 'Vertex AI', 'Cloud Functions'],
    relatedProducts: ['ndn-001'],
    featured: true,
    publishedAt: '2026-04-01',
  },
  {
    id: 'cs-002',
    slug: 'pharma-supply-chain-traceability',
    isReferenceImplementation: true,
    title: 'Blockchain Traceability for Pharmaceutical Supply Chain Compliance',
    subtitle: 'Reference implementation: how NDN TraceChain addresses FDA DSCSA unit-level traceability requirements for pharmaceutical distributors',
    client: {
      name: 'Reference Scenario — National Pharmaceutical Distributor',
      industry: 'Healthcare / Pharmaceuticals',
      size: 'Scenario scale: 300–600 supplier relationships, multi-DC network',
    },
    challenge: 'FDA DSCSA Phase II enforcement requires complete electronic chain-of-custody documentation at the package level for all prescription drugs. A distributor relying on lot-level EDI data cannot provide the unit-level serialisation trail regulators demand. Non-compliance exposes distribution contracts and DEA licensing to risk. Manual retrieval processes make FDA inspection response times measured in weeks rather than hours.',
    solution: 'NDN TraceChain is deployed across distribution centres and integrated with supplier EDI feeds. Every package movement — receipt, pick, pack, ship — is recorded as a cryptographically signed transaction on a private Ethereum network anchored to mainnet on a configurable schedule. A REST API layer exposes verification endpoints to regulators and trading partners without exposing the underlying chain directly.',
    results: [
      {
        metric: 'Compliance Coverage',
        value: '100%',
        description: 'DSCSA unit-level traceability achieved across all tracked SKUs by design — completeness is a product requirement, not a target',
      },
      {
        metric: 'Audit Response Time',
        value: 'Hours vs weeks',
        description: 'FDA inspection queries answered via API in minutes; replaces multi-week manual retrieval process',
      },
      {
        metric: 'Dispute Resolution',
        value: 'Same-day',
        description: 'Supplier disputes resolvable against on-chain audit trail; no back-and-forth document requests',
      },
      {
        metric: 'Implementation Timeline',
        value: '14–18 wks',
        description: 'Typical phased rollout across distribution centres and supplier EDI integrations',
      },
    ],
    timeline: '14–18 week reference implementation',
    technologies: ['Ethereum', 'IPFS', 'Google Cloud Platform', 'Smart Contracts'],
    relatedProducts: ['ndn-005'],
    featured: true,
    publishedAt: '2026-04-01',
  },
  {
    id: 'cs-003',
    slug: 'hospital-readmission-prevention',
    isReferenceImplementation: true,
    title: 'AI Readmission Risk Scoring for Multi-Hospital Health Systems',
    subtitle: 'Reference implementation: how NDN Care Predict addresses 30-day readmission risk identification and care coordinator prioritisation',
    client: {
      name: 'Reference Scenario — Regional Multi-Hospital Health System',
      industry: 'Healthcare',
      size: 'Scenario scale: 8–15 hospitals, 1.5M–3M patient encounters/year',
    },
    challenge: 'CMS excess readmission penalties accumulate when high-risk patients are discharged without timely intervention. Traditional risk scoring tools (e.g. LACE index) capture a fraction of patients who ultimately readmit, leaving care coordinators to work through manual chart reviews with no way to prioritise. The result: many high-risk discharges happen before any intervention is possible.',
    solution: 'NDN Care Predict connects to existing EMR systems via Epic FHIR APIs and scores every inpatient every 4 hours across 200+ real-time signals — vital trends, lab trajectories, medication fill patterns, social determinants, and care team notes. High-risk alerts surface directly inside nursing and case management workflows with specific intervention recommendations. The model is calibrated on each health system\'s own historical data before go-live.',
    results: [
      {
        metric: '30-day Readmissions',
        value: 'Material reduction',
        description: 'Modeled from intervention rate improvement when high-risk patients are identified 24–48 hours earlier in the episode',
      },
      {
        metric: 'Risk Detection Sensitivity',
        value: 'High (>90%)',
        description: 'Model architecture targets >90% sensitivity — substantially higher than LACE baseline — through multi-signal real-time scoring',
      },
      {
        metric: 'Coordinator Throughput',
        value: '2–3× more',
        description: 'AI-prioritised worklists reduce time spent on manual chart review, enabling coordinators to cover more patients per shift',
      },
      {
        metric: 'Integration Timeline',
        value: '16–22 wks',
        description: 'Phased rollout via FHIR APIs; timeline scales with number of hospitals and EMR configuration complexity',
      },
    ],
    timeline: '16–22 week reference implementation',
    technologies: ['Google Cloud Platform', 'Vertex AI', 'FHIR', 'HL7'],
    relatedProducts: ['ndn-002'],
    featured: true,
    publishedAt: '2026-04-01',
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
