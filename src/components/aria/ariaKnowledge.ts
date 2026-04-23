interface AriaRule {
  patterns: RegExp[];
  response: string;
}

const RULES: AriaRule[] = [
  {
    patterns: [/hello|hi|hey|greet|good morning|good evening/i],
    response: "Hello! I'm ARIA - NDN Analytics' AI intelligence agent. I can tell you about our 13 products, technology stack, security certifications, or help you book a demo. What would you like to know?",
  },
  {
    patterns: [/demand iq|demand forecasting|inventory|retail ai|ndn.?001/i],
    response: "**NDN Demand IQ** (NDN-001) is our retail demand forecasting platform powered by Google Cloud AI. It predicts inventory needs in real time across complex supply networks - eliminating stockouts and overstock. Key capabilities: multi-echelon optimization, seasonal pattern recognition, and supplier risk modeling.",
  },
  {
    patterns: [/care predict|hospital|readmission|healthcare ai|ndn.?002/i],
    response: "**NDN Care Predict** (NDN-002) is our healthcare AI platform for hospital readmission prevention. It identifies at-risk patients before discharge to enable proactive intervention. Fully HIPAA-compliant with EHR integration and clinical workflow automation.",
  },
  {
    patterns: [/route ai|delivery|logistics|last.?mile|fleet|ndn.?003/i],
    response: "**NDN Route AI** (NDN-003) is our last-mile delivery optimization engine. It dynamically routes fleets in real time using live traffic data, cutting delivery costs and improving SLAs. Includes carbon footprint tracking.",
  },
  {
    patterns: [/churn guard|churn|saas|retention|ndn.?004/i],
    response: "**NDN Churn Guard** (NDN-004) predicts SaaS customer churn weeks in advance using behavioral signals and health scoring - then triggers automated retention workflows to protect revenue.",
  },
  {
    patterns: [/tracechain|supply chain|provenance|anti.?counterfeit|ndn.?005/i],
    response: "**NDN TraceChain** (NDN-005) is our Ethereum-based supply chain provenance platform. Every component gets an immutable on-chain record from raw material to consumer - with cryptographic anti-counterfeiting verification.",
  },
  {
    patterns: [/paystream|smart contract|payment|settlement|ndn.?006/i],
    response: "**NDN PayStream** (NDN-006) is smart contract payment infrastructure for automated B2B settlements. Milestone-triggered, multi-currency, with real-time settlement finality on Ethereum.",
  },
  {
    patterns: [/credvault|credential|verification|diploma|certificate|ndn.?007/i],
    response: "**NDN CredVault** (NDN-007) issues and verifies credentials on Ethereum - academic degrees, professional certifications, workforce credentials. Tamper-proof, instantly shareable, employer-verifiable via API.",
  },
  {
    patterns: [/propledger|real estate|property|tokeniz|fractional|ndn.?008/i],
    response: "**NDN PropLedger** (NDN-008) tokenizes real estate assets on Ethereum - enabling fractional ownership, automated rent distributions, and transparent on-chain title registry.",
  },
  {
    patterns: [/njangi|rosca|rotating savings|community finance|savings circle|ndn.?009/i],
    response: "**Njangi** (NDN-009) is our Web3 community finance protocol that digitizes traditional African rotating savings cooperatives (ROSCAs) for the decentralized era. Features: on-chain contribution tracking, smart contract payout rotation, and community trust scoring.",
  },
  {
    patterns: [/neuroquest|cognitive|neural|personality|behavioral prediction|ndn.?010/i],
    response: "**NeuroQuest** (NDN-010) is our cognitive AI platform using neural analytics for personality profiling, decision mapping, and behavioral prediction. Powered by advanced AI models for deep psychological intelligence.",
  },
  {
    patterns: [/interpreter|sign language|accessibility|ndn.?011/i],
    response: "**NDN Interpreter** (NDN-011) is our real-time sign language AI platform for accessibility in healthcare, education, and public services with low-latency translation.",
  },
  {
    patterns: [/model studio|fine[- ]?tuning|hugging face|ndn.?012/i],
    response: "**NDN Model Studio** (NDN-012) is our no-code fine-tuning platform for training and deploying custom models on managed Google Vertex AI GPUs.",
  },
  {
    patterns: [/ipfs chain|ipfs|chain[- ]?of[- ]?custody|ndn.?013/i],
    response: "**NDN IPFS CHAIN** (NDN-013) combines IPFS content-addressed storage with Ethereum proof anchoring to deliver immutable chain-of-custody for enterprise files and records.",
  },
  {
    patterns: [/all products|list products|what products|how many products/i],
    response: "NDN Analytics has **13 products** across three stacks:\n\n**Google Cloud AI:** Demand IQ, Care Predict, Route AI, Churn Guard\n\n**Ethereum + Web3:** TraceChain, PayStream, CredVault, PropLedger, Njangi, NDN IPFS CHAIN\n\n**New Launches:** NeuroQuest, NDN Interpreter, NDN Model Studio\n\nAsk me about any product for details!",
  },
  {
    patterns: [/google cloud|gcp|vertex ai|bigquery|cloud run/i],
    response: "Our Google Cloud AI stack includes: **Vertex AI** for model training, **BigQuery ML** for in-database analytics, **Cloud Run** for serverless execution, **Pub/Sub** for event streaming, **Dataflow** for batch/stream processing, **Cloud Spanner** for global databases, and **Cloud Armor** for security.",
  },
  {
    patterns: [/ethereum|blockchain|solidity|web3|smart contract|polygon/i],
    response: "Our Ethereum stack includes: **Solidity** smart contracts, **Hardhat** dev environment, **IPFS** for decentralized storage, **The Graph** for indexing, **OpenZeppelin** audited libraries, **Chainlink** oracles, **Ethers.js**, and **Polygon** for L2 scaling.",
  },
  {
    patterns: [/security|soc 2|iso 27001|hipaa|gdpr|compliance|certif/i],
    response: "NDN Analytics maintains enterprise-grade security compliance: **SOC 2 Type II**, **ISO 27001**, **HIPAA** (for healthcare products), and **GDPR** compliance. All data encrypted at rest and in transit.",
  },
  {
    patterns: [/integrat|sap|salesforce|snowflake|aws|partner/i],
    response: "NDN Analytics integrates with major enterprise platforms: **SAP**, **Salesforce**, **Snowflake**, **AWS**, and more. Our REST APIs and webhook infrastructure support custom integrations for any enterprise stack.",
  },
  {
    patterns: [/demo|book|schedule|trial|get started/i],
    response: "Ready to see NDN Analytics in action? Head to our **Contact** page to book a personalized demo with our team. We respond within 24 hours and tailor every demo to your specific use case and industry.",
  },
  {
    patterns: [/price|pricing|cost|how much/i],
    response: "Pricing is tailored to your organization's scale and requirements. Contact our team via the **Contact** page for a custom quote - our team will get back to you within 24 hours.",
  },
  {
    patterns: [/uptime|sla|reliability|availability/i],
    response: "NDN Analytics provides a **24/7 uptime SLA** backed by Google Cloud's global infrastructure. Enterprise customers receive dedicated support channels and incident response guarantees.",
  },
];

const FALLBACK = "I didn't catch that. I can help with: our **13 products**, **technology stack**, **security compliance**, **integrations**, or **booking a demo**. What would you like to know?";

const SUGGESTIONS = [
  'Tell me about all 13 products',
  'What is NDN TraceChain?',
  'What is NDN IPFS CHAIN?',
  'Explain your tech stack',
  'Security certifications',
  'Book a demo',
];

export function getAriaResponse(input: string): string {
  for (const rule of RULES) {
    if (rule.patterns.some(p => p.test(input))) {
      return rule.response;
    }
  }
  return FALLBACK;
}

export { SUGGESTIONS };
