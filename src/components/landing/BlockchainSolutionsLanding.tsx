import ServiceLandingPage from './ServiceLandingPage';
import type { ServiceLandingConfig } from './ServiceLandingPage';

const CONFIG: ServiceLandingConfig = {
  slug: 'blockchain-solutions',
  eyebrow: 'Blockchain Solutions',
  h1: 'Blockchain Solutions',
  h1Highlight: 'on Ethereum.',
  subhead:
    'Smart contracts, on-chain provenance, automated B2B settlement, credential verification, and tokenization — engineered with security-first patterns for production use, not whitepapers.',
  seoTitle: 'Blockchain Solutions on Ethereum',
  seoDescription:
    'NDN Analytics builds production blockchain solutions on Ethereum: supply chain provenance, smart contract payments, decentralized credential verification, real estate tokenization, and IPFS proof anchoring.',
  seoKeywords:
    'blockchain solutions, Ethereum development, smart contract development, Web3 development, supply chain blockchain, B2B blockchain payments, blockchain provenance, real estate tokenization',
  serviceName: 'Blockchain Solutions Development',
  serviceType: 'Ethereum and Web3 development',
  productIds: ['ndn-005', 'ndn-006', 'ndn-007', 'ndn-008', 'ndn-009', 'ndn-013'],
  deliverables: [
    {
      title: 'Audited smart contracts',
      body: 'Solidity contracts written to security-first patterns (reentrancy guards, access control, upgrade paths), with full unit + invariant test coverage and an independent audit recommendation before mainnet.',
    },
    {
      title: 'Production deployment',
      body: 'Deployment to Ethereum mainnet, an L2 (Arbitrum / Base / Optimism), or a private EVM chain — whichever fits your gas, throughput, and compliance constraints.',
    },
    {
      title: 'Off-chain integration layer',
      body: 'API gateway, indexer (subgraph or custom), and webhook surface so your existing ERP, CRM, or back-office systems can read on-chain events without your team becoming Web3 experts.',
    },
    {
      title: 'Compliance + KYC where needed',
      body: 'Allowlist gating, KYC/AML transfer restrictions, and audit-friendly logging built into the contract layer when your use case requires it (real estate, regulated finance, healthcare).',
    },
  ],
  industries: ['Supply Chain', 'Pharmaceuticals', 'Real Estate', 'B2B Payments', 'Higher Education', 'Government', 'Community Finance'],
  faqs: [
    {
      question: 'Why Ethereum vs. Solana, Polygon, or another chain?',
      answer:
        'We default to Ethereum (with L2s like Arbitrum or Base) because it has the deepest security audit ecosystem, the most mature tooling, and the strongest enterprise adoption. We will use a different chain — including Solana — if your specific use case demands lower fees or higher throughput, but we will tell you why in the discovery call.',
    },
    {
      question: 'How do you handle smart contract security?',
      answer:
        'Security is treated as the default, not the polish layer. Every contract goes through static analysis (Slither, Mythril), unit + invariant test suites with Foundry or Hardhat, and we recommend (and coordinate) an independent third-party audit before any mainnet deploy that handles real value.',
    },
    {
      question: 'Can blockchain integrate with our existing ERP / SAP / Salesforce?',
      answer:
        'Yes. Most enterprise blockchain work is 30% smart contract and 70% integration. We build the API layer and event indexer that lets your existing systems read on-chain state without your ops team needing to know what a transaction hash is.',
    },
    {
      question: 'Do we need to hold crypto to use this?',
      answer:
        'Not necessarily. Many enterprise blockchain use cases (provenance, credential verification, document anchoring) only need on-chain *state*, not on-chain *value*. We design the gas-handling layer so the user-facing experience can be a simple credit card or invoice flow.',
    },
  ],
};

export default function BlockchainSolutionsLanding() {
  return <ServiceLandingPage config={CONFIG} />;
}
