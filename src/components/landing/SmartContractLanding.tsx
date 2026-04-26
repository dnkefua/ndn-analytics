import ServiceLandingPage from './ServiceLandingPage';
import type { ServiceLandingConfig } from './ServiceLandingPage';

const CONFIG: ServiceLandingConfig = {
  slug: 'smart-contract-development',
  eyebrow: 'Smart Contract Development',
  h1: 'Smart Contracts,',
  h1Highlight: 'Audited and Production-Ready.',
  subhead:
    'Solidity development for Ethereum and EVM chains: ERC-20 / ERC-721 / ERC-1155 tokens, escrow and milestone payments, DAOs, allowlist-gated security tokens, and cross-chain bridges — written to security-first patterns and shipped with full test coverage.',
  seoTitle: 'Smart Contract Development on Ethereum',
  seoDescription:
    'Solidity smart contract development from NDN Analytics. ERC-20 tokens, escrow contracts, DAOs, security tokens, and DeFi protocols on Ethereum and EVM L2s — security-first with full test coverage.',
  seoKeywords:
    'smart contract development, Solidity development, Ethereum smart contracts, ERC-20 development, ERC-721 NFT development, security token development, smart contract audit, Web3 development services',
  serviceName: 'Smart Contract Development',
  serviceType: 'Solidity smart contract design, development, and deployment',
  productIds: ['ndn-006', 'ndn-007', 'ndn-008', 'ndn-009'],
  deliverables: [
    {
      title: 'Solidity contracts',
      body: 'ERC-20, ERC-721, ERC-1155, escrow, vesting, multisig, governance, and custom protocol contracts — written using OpenZeppelin patterns where appropriate, custom where the use case requires it.',
    },
    {
      title: 'Full test coverage',
      body: 'Foundry or Hardhat test suites covering unit tests, integration tests, fuzz tests, and invariant tests — not just the happy path. Static analysis with Slither and Mythril before any deployment.',
    },
    {
      title: 'Audit coordination',
      body: 'We do not self-audit production contracts. We prepare the codebase for an independent third-party audit (Trail of Bits, OpenZeppelin, ConsenSys Diligence, or comparable) and coordinate the remediation cycle.',
    },
    {
      title: 'Deploy + verify on-chain',
      body: 'Mainnet, L2 (Arbitrum, Base, Optimism, Polygon), or testnet deploys with Etherscan source verification, contract addresses documented, and a runbook your team can use for upgrades and emergency pause.',
    },
  ],
  industries: ['DeFi', 'Real Estate Tokenization', 'Supply Chain', 'B2B Payments', 'NFT / Digital Collectibles', 'Community Finance', 'Gaming / Web3'],
  faqs: [
    {
      question: 'How long does a smart contract development engagement take?',
      answer:
        'A focused contract suite (e.g. an ERC-20 with vesting + governance, or an escrow protocol) is typically 3–6 weeks of build + test, then 2–4 weeks for the audit and remediation cycle. A full DeFi protocol or complex tokenization project is 3–6 months end-to-end.',
    },
    {
      question: 'Do you handle the audit, or do we need to hire a separate firm?',
      answer:
        'Audits should always be independent — we will not audit our own code. We prepare the codebase to a high audit-readiness bar (NatSpec docs, invariant test suites, threat model write-up), help you select a reputable audit firm, and own the remediation cycle. The audit itself is contracted separately with the audit firm.',
    },
    {
      question: 'Which chains do you deploy to?',
      answer:
        'Ethereum mainnet, Arbitrum, Base, Optimism, Polygon, and other EVM-compatible L2s. We default to L2s for any use case with high transaction volume — gas costs on mainnet rarely make sense for production user flows in 2026. We will deploy to a private EVM chain if your compliance posture requires it.',
    },
    {
      question: 'What about post-deploy support?',
      answer:
        'Smart contracts are not fire-and-forget software. We offer post-deploy support retainers covering monitoring (transaction anomaly alerts), upgrade execution (for upgradeable proxies), and emergency response. Most production engagements include a 3-month post-deploy support period by default.',
    },
  ],
};

export default function SmartContractLanding() {
  return <ServiceLandingPage config={CONFIG} />;
}
