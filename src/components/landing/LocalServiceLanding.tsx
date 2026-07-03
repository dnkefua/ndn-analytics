import { Helmet } from 'react-helmet-async';
import { Link, Navigate, useLocation } from 'react-router-dom';
import SEO from '../seo/SEO';
import { PRODUCTS } from '../products/productData';

const BASE_URL = 'https://www.ndnanalytics.com';

interface LocalServiceConfig {
  slug: string;
  city: string;
  region: string;
  country: string;
  marketLabel: string;
  serviceName: string;
  serviceType: string;
  h1: string;
  highlight: string;
  title: string;
  description: string;
  keywords: string;
  intro: string[];
  services: string[];
  industries: string[];
  productIds: string[];
  proofPoints: string[];
  faqs: { question: string; answer: string }[];
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
}

const SHARED_AI_SERVICES = [
  'AI agents for internal operations',
  'Workflow automation and approval routing',
  'Document intake and data extraction',
  'CRM, ERP, support desk, and reporting integrations',
  'Predictive dashboards and decision-support systems',
  'RAG knowledge assistants for teams',
];

const SHARED_BLOCKCHAIN_SERVICES = [
  'Smart contract architecture and Solidity development',
  'Supply chain traceability and provenance records',
  'Credential verification and document proof layers',
  'B2B payment automation and escrow workflows',
  'Private EVM, Ethereum, and Layer 2 deployment planning',
  'API, indexer, and enterprise integration layers',
];

const TULSA_ADDRESS = {
  streetAddress: '5406 E 23rd St',
  addressLocality: 'Tulsa',
  addressRegion: 'OK',
  postalCode: '74114',
  addressCountry: 'US',
};

const LOCAL_SERVICE_PAGES: LocalServiceConfig[] = [
  {
    slug: 'ai-automation-tulsa',
    city: 'Tulsa',
    region: 'Oklahoma',
    country: 'United States',
    marketLabel: 'Tulsa, Oklahoma',
    serviceName: 'AI Automation',
    serviceType: 'AI automation and workflow automation',
    h1: 'AI Automation Company in Tulsa,',
    highlight: 'Oklahoma',
    title: 'AI Automation Company in Tulsa, Oklahoma',
    description: 'NDN Analytics builds AI automation systems, AI agents, custom workflows, and internal tools for Tulsa businesses that want to reduce manual work and improve operational decision-making.',
    keywords: 'AI automation company Tulsa, AI automation Tulsa, workflow automation Tulsa, AI agents Tulsa, Oklahoma AI automation company',
    intro: [
      'NDN Analytics helps Tulsa businesses turn repetitive work into reliable AI-powered systems. We build automation for operations, reporting, customer support, sales workflows, logistics, healthcare, and professional services.',
      'The goal is not a flashy demo. The goal is a production workflow that connects to the tools your team already uses, logs what happened, and gives people control where judgment matters.',
    ],
    services: SHARED_AI_SERVICES,
    industries: ['Healthcare operations', 'Logistics', 'Retail', 'Professional services', 'Education', 'Real estate', 'B2B software'],
    productIds: ['ndn-001', 'ndn-003', 'ndn-004', 'ndn-012'],
    proofPoints: ['Founder-led technical strategy', 'Google Cloud and data pipeline experience', 'Productized AI systems, not generic chatbot wrappers', 'Tulsa address and Oklahoma service coverage'],
    address: TULSA_ADDRESS,
    faqs: [
      {
        question: 'What AI automation services does NDN Analytics provide in Tulsa?',
        answer: 'We build AI agents, workflow automation, document processing, reporting automation, CRM/ERP integrations, predictive dashboards, and custom AI apps for Tulsa and Oklahoma teams.',
      },
      {
        question: 'Can you work with existing tools?',
        answer: 'Yes. We design automation around existing systems such as CRMs, ERPs, spreadsheets, support tools, databases, and cloud platforms so teams do not need to rip out their current workflow.',
      },
      {
        question: 'How do Tulsa companies start with AI automation?',
        answer: 'Start with an AI automation audit. We map repetitive workflows, estimate hours saved, score integration complexity, and choose the first workflow with the cleanest ROI.',
      },
    ],
  },
  {
    slug: 'ai-consulting-tulsa',
    city: 'Tulsa',
    region: 'Oklahoma',
    country: 'United States',
    marketLabel: 'Tulsa, Oklahoma',
    serviceName: 'AI Consulting',
    serviceType: 'Enterprise AI consulting',
    h1: 'AI Consulting in Tulsa,',
    highlight: 'Built for Execution',
    title: 'AI Consulting in Tulsa, Oklahoma',
    description: 'NDN Analytics provides AI consulting for Tulsa companies that need practical AI roadmaps, automation audits, data readiness reviews, and production AI implementation.',
    keywords: 'AI consulting Tulsa, AI consultant Tulsa, AI strategy Oklahoma, enterprise AI consulting Tulsa',
    intro: [
      'NDN Analytics helps Tulsa leaders identify the AI use cases that can actually ship, integrate, and pay back.',
      'We focus on data readiness, workflow economics, model risk, integration surfaces, and the operating plan needed to move from idea to production.',
    ],
    services: ['AI readiness assessments', 'Automation opportunity mapping', 'Data and integration audits', 'AI agent architecture', 'Vendor and platform selection', 'Implementation roadmaps'],
    industries: ['Healthcare', 'Energy and industrial operations', 'Logistics', 'Retail', 'Professional services', 'Education'],
    productIds: ['ndn-001', 'ndn-002', 'ndn-003', 'ndn-012'],
    proofPoints: ['Practical implementation bias', 'Clear ROI scoring', 'AI and blockchain product experience', 'Local Tulsa/Oklahoma positioning'],
    address: TULSA_ADDRESS,
    faqs: [
      {
        question: 'What does an AI consulting engagement include?',
        answer: 'A typical engagement includes discovery, workflow mapping, data readiness review, technical architecture, ROI scoring, implementation backlog, and a recommended build sequence.',
      },
      {
        question: 'Do you only advise or also build?',
        answer: 'NDN Analytics advises and builds. The consulting work is designed to become a practical implementation plan, not a slide deck that sits unused.',
      },
      {
        question: 'Can you support Oklahoma companies outside Tulsa?',
        answer: 'Yes. NDN Analytics serves Tulsa, Oklahoma City, and Oklahoma-based teams remotely and through scheduled working sessions.',
      },
    ],
  },
  {
    slug: 'ai-app-development-tulsa',
    city: 'Tulsa',
    region: 'Oklahoma',
    country: 'United States',
    marketLabel: 'Tulsa, Oklahoma',
    serviceName: 'AI App Development',
    serviceType: 'Custom AI app and product development',
    h1: 'AI App Development in Tulsa,',
    highlight: 'from Prototype to Production',
    title: 'AI App Development Company in Tulsa',
    description: 'NDN Analytics designs and builds custom AI apps, internal tools, dashboards, AI agents, and production-ready AI products for Tulsa and Oklahoma businesses.',
    keywords: 'AI app development Tulsa, custom AI apps Tulsa, AI product development Oklahoma, AI software company Tulsa',
    intro: [
      'NDN Analytics builds custom AI apps for Tulsa companies that need more than a prompt interface.',
      'We design the data layer, workflows, model calls, human review screens, analytics, and deployment path needed for an AI app that teams can use every day.',
    ],
    services: ['AI product strategy', 'MVP and prototype builds', 'AI app UX and workflow design', 'Model integration and RAG', 'Admin dashboards', 'Production deployment and monitoring'],
    industries: ['Healthcare', 'Education', 'Retail', 'Logistics', 'Professional services', 'Community platforms'],
    productIds: ['ndn-010', 'ndn-012', 'ndn-014', 'ndn-016'],
    proofPoints: ['Full-stack product build capability', 'AI-first architecture', 'Mobile and web deployment experience', 'Founder-led product strategy'],
    address: TULSA_ADDRESS,
    faqs: [
      {
        question: 'What kind of AI apps can NDN Analytics build?',
        answer: 'We build AI dashboards, internal agents, workflow apps, AI education tools, healthcare support apps, customer portals, RAG systems, and mobile-ready AI products.',
      },
      {
        question: 'Can you build both web and mobile AI apps?',
        answer: 'Yes. We can build web apps, mobile-first experiences, and app-store-ready wrappers when the business case requires mobile distribution.',
      },
      {
        question: 'How long does an AI app prototype take?',
        answer: 'A scoped prototype can often be built in 2 to 6 weeks depending on data access, integrations, and complexity.',
      },
    ],
  },
  {
    slug: 'blockchain-development-tulsa',
    city: 'Tulsa',
    region: 'Oklahoma',
    country: 'United States',
    marketLabel: 'Tulsa, Oklahoma',
    serviceName: 'Blockchain Development',
    serviceType: 'Blockchain and Web3 development',
    h1: 'Blockchain Development in Tulsa,',
    highlight: 'for Real Business Systems',
    title: 'Blockchain Development Company in Tulsa',
    description: 'NDN Analytics builds blockchain systems, smart contracts, provenance platforms, credential verification, and business automation workflows for Tulsa and Oklahoma organizations.',
    keywords: 'blockchain development Tulsa, Web3 development Tulsa, blockchain company Oklahoma, Ethereum development Tulsa',
    intro: [
      'NDN Analytics builds blockchain systems where shared truth, auditability, and multi-party trust matter.',
      'For Tulsa and Oklahoma organizations, that can mean supply chain provenance, credential verification, automated settlement, document proof, or private EVM workflows.',
    ],
    services: SHARED_BLOCKCHAIN_SERVICES,
    industries: ['Supply chain', 'Pharmaceuticals', 'Education', 'Real estate', 'Community finance', 'Professional services'],
    productIds: ['ndn-005', 'ndn-006', 'ndn-007', 'ndn-008', 'ndn-013'],
    proofPoints: ['Ethereum and EVM architecture', 'Business integration focus', 'Security-first smart contract patterns', 'AI plus blockchain capability'],
    address: TULSA_ADDRESS,
    faqs: [
      {
        question: 'What blockchain services do you provide in Tulsa?',
        answer: 'We build smart contracts, provenance platforms, credential verification systems, payment automation, tokenization workflows, and API layers for enterprise blockchain use cases.',
      },
      {
        question: 'Do you build on public or private blockchains?',
        answer: 'We design for the use case. Many enterprise systems use private EVM or permissioned deployment, while public Ethereum or Layer 2 networks fit open verification and settlement use cases.',
      },
      {
        question: 'Do Tulsa companies need blockchain?',
        answer: 'Only when the business problem involves multiple parties, disputed records, audit needs, provenance, settlement, or tamper-evident proof. We will say no when a normal database is the better option.',
      },
    ],
  },
  {
    slug: 'smart-contract-development-tulsa',
    city: 'Tulsa',
    region: 'Oklahoma',
    country: 'United States',
    marketLabel: 'Tulsa, Oklahoma',
    serviceName: 'Smart Contract Development',
    serviceType: 'Smart contract development',
    h1: 'Smart Contract Development in Tulsa,',
    highlight: 'Security First',
    title: 'Smart Contract Development in Tulsa',
    description: 'NDN Analytics develops Solidity smart contracts, escrow workflows, tokenization logic, verification systems, and secure EVM integrations for Tulsa and Oklahoma teams.',
    keywords: 'smart contract development Tulsa, Solidity developer Tulsa, Ethereum developer Oklahoma, smart contracts Oklahoma',
    intro: [
      'NDN Analytics designs smart contracts for real operational workflows, not speculative gimmicks.',
      'We focus on access control, upgrade strategy, tests, audit readiness, and the off-chain services needed to make a smart contract useful to the business.',
    ],
    services: ['Solidity smart contracts', 'Escrow and payment workflows', 'Tokenization architecture', 'Credential verification contracts', 'Testing and audit preparation', 'API and dashboard integrations'],
    industries: ['B2B payments', 'Real estate', 'Education', 'Supply chain', 'Community finance'],
    productIds: ['ndn-006', 'ndn-007', 'ndn-008', 'ndn-013'],
    proofPoints: ['Security-first Solidity patterns', 'Integration beyond the contract', 'Clear mainnet and Layer 2 deployment planning', 'Enterprise documentation'],
    address: TULSA_ADDRESS,
    faqs: [
      {
        question: 'Do you audit smart contracts?',
        answer: 'We write test suites and prepare contracts for audit. For contracts handling real value, we recommend an independent third-party audit before production deployment.',
      },
      {
        question: 'Can smart contracts connect to normal business systems?',
        answer: 'Yes. We build API, indexer, and webhook layers so CRMs, ERPs, dashboards, and finance systems can read contract events and trigger workflows.',
      },
      {
        question: 'Which chain should we use?',
        answer: 'We usually evaluate Ethereum, Base, Arbitrum, Polygon, and private EVM deployments based on security, cost, speed, and compliance requirements.',
      },
    ],
  },
  {
    slug: 'ai-automation-oklahoma',
    city: 'Tulsa',
    region: 'Oklahoma',
    country: 'United States',
    marketLabel: 'Oklahoma',
    serviceName: 'AI Automation',
    serviceType: 'AI automation and workflow automation',
    h1: 'AI Automation Company for',
    highlight: 'Oklahoma Businesses',
    title: 'AI Automation Company in Oklahoma',
    description: 'NDN Analytics helps Oklahoma organizations automate operations with AI agents, custom workflows, predictive dashboards, and production-grade business systems.',
    keywords: 'AI automation Oklahoma, AI automation company Oklahoma, workflow automation Oklahoma, AI agents Oklahoma',
    intro: [
      'NDN Analytics serves Oklahoma businesses that want practical AI automation tied to measurable operational outcomes.',
      'From Tulsa to Oklahoma City and beyond, we help teams remove repetitive work, improve reporting, and build AI systems that connect to existing business tools.',
    ],
    services: SHARED_AI_SERVICES,
    industries: ['Healthcare', 'Energy and industrial operations', 'Retail', 'Logistics', 'Education', 'Professional services'],
    productIds: ['ndn-001', 'ndn-002', 'ndn-003', 'ndn-004', 'ndn-012'],
    proofPoints: ['Oklahoma service coverage', 'Production AI systems', 'Automation ROI audits', 'AI plus blockchain product depth'],
    address: TULSA_ADDRESS,
    faqs: [
      {
        question: 'Does NDN Analytics serve all of Oklahoma?',
        answer: 'Yes. NDN Analytics serves Oklahoma companies through remote implementation, scheduled working sessions, and Tulsa-based local presence.',
      },
      {
        question: 'What is the first step for Oklahoma AI automation?',
        answer: 'The first step is a workflow audit that ranks automation opportunities by hours saved, integration complexity, risk, and implementation cost.',
      },
      {
        question: 'Can you build custom AI products?',
        answer: 'Yes. NDN Analytics can move from AI strategy and automation audit into custom app, agent, and dashboard development.',
      },
    ],
  },
  {
    slug: 'blockchain-development-oklahoma',
    city: 'Tulsa',
    region: 'Oklahoma',
    country: 'United States',
    marketLabel: 'Oklahoma',
    serviceName: 'Blockchain Development',
    serviceType: 'Blockchain and smart contract development',
    h1: 'Blockchain Development for',
    highlight: 'Oklahoma Organizations',
    title: 'Blockchain Development Company in Oklahoma',
    description: 'NDN Analytics builds blockchain, smart contract, provenance, credential verification, and document proof systems for Oklahoma organizations.',
    keywords: 'blockchain development Oklahoma, smart contract development Oklahoma, Web3 development Oklahoma, Ethereum developer Oklahoma',
    intro: [
      'NDN Analytics helps Oklahoma organizations use blockchain where trust, proof, and multi-party records create measurable value.',
      'We build the contracts, APIs, dashboards, and integration layer needed to connect blockchain infrastructure to business operations.',
    ],
    services: SHARED_BLOCKCHAIN_SERVICES,
    industries: ['Supply chain', 'Education', 'Real estate', 'Healthcare compliance', 'Community finance', 'B2B services'],
    productIds: ['ndn-005', 'ndn-006', 'ndn-007', 'ndn-008', 'ndn-013'],
    proofPoints: ['Ethereum and private EVM options', 'Security-first design', 'Enterprise integration planning', 'Oklahoma service coverage'],
    address: TULSA_ADDRESS,
    faqs: [
      {
        question: 'What blockchain use cases fit Oklahoma organizations?',
        answer: 'Practical use cases include supply chain traceability, credential verification, document proof, automated payments, real estate tokenization, and audit-friendly recordkeeping.',
      },
      {
        question: 'Can blockchain be private?',
        answer: 'Yes. Many enterprise blockchain deployments use private or permissioned networks where access is controlled and sensitive data stays off-chain.',
      },
      {
        question: 'Can NDN Analytics build smart contracts too?',
        answer: 'Yes. NDN Analytics designs and develops smart contracts as part of broader blockchain systems.',
      },
    ],
  },
  {
    slug: 'ai-consulting-oklahoma',
    city: 'Tulsa',
    region: 'Oklahoma',
    country: 'United States',
    marketLabel: 'Oklahoma',
    serviceName: 'AI Consulting',
    serviceType: 'AI strategy and implementation consulting',
    h1: 'AI Consulting for',
    highlight: 'Oklahoma Businesses',
    title: 'AI Consulting Company in Oklahoma',
    description: 'NDN Analytics provides AI consulting, AI readiness assessments, automation roadmaps, and implementation planning for Oklahoma organizations.',
    keywords: 'AI consulting Oklahoma, AI consultant Oklahoma, AI strategy Oklahoma, AI implementation Oklahoma',
    intro: [
      'NDN Analytics helps Oklahoma leaders choose practical AI use cases, prepare data, design implementation plans, and avoid expensive AI theater.',
      'We focus on systems that can ship: AI automation, predictive analytics, AI agents, custom apps, and integration with business operations.',
    ],
    services: ['AI readiness assessments', 'Use case prioritization', 'Automation audits', 'Data readiness reviews', 'Implementation architecture', 'Build roadmap and ROI estimates'],
    industries: ['Healthcare', 'Retail', 'Logistics', 'Energy and industrial operations', 'Professional services'],
    productIds: ['ndn-001', 'ndn-002', 'ndn-003', 'ndn-012'],
    proofPoints: ['Practical build strategy', 'AI and blockchain expertise', 'Oklahoma service coverage', 'Clear implementation backlog'],
    address: TULSA_ADDRESS,
    faqs: [
      {
        question: 'What does AI consulting include?',
        answer: 'AI consulting includes use case discovery, data readiness, workflow mapping, implementation architecture, risk review, and a roadmap for production deployment.',
      },
      {
        question: 'Can you help if we do not have clean data?',
        answer: 'Yes. Data readiness is often the first AI project. We assess sources, quality, access, security, and governance before recommending automation.',
      },
      {
        question: 'Do you work with small and mid-sized businesses?',
        answer: 'Yes. NDN Analytics supports SMEs and enterprise teams, with scope sized to the operational value of the first use case.',
      },
    ],
  },
  {
    slug: 'ai-automation-company-dubai',
    city: 'Dubai',
    region: 'Dubai',
    country: 'United Arab Emirates',
    marketLabel: 'Dubai, UAE',
    serviceName: 'AI Automation',
    serviceType: 'AI automation and AI agent development',
    h1: 'AI Automation Company in Dubai,',
    highlight: 'Built for Operations',
    title: 'AI Automation Company in Dubai',
    description: 'NDN Analytics builds AI automation systems, AI agents, workflow automation, custom AI apps, and decision-support tools for Dubai and UAE businesses.',
    keywords: 'AI automation company Dubai, AI automation Dubai, AI agents Dubai, workflow automation UAE, enterprise AI automation Dubai',
    intro: [
      'NDN Analytics helps Dubai businesses turn manual workflows into production AI systems that support operations, customer service, logistics, real estate, finance, and healthcare teams.',
      'We build practical automation with governance, audit trails, and integration into the systems where work already happens.',
    ],
    services: SHARED_AI_SERVICES,
    industries: ['Real estate', 'Logistics', 'Healthcare', 'Financial services', 'Retail', 'Professional services', 'Education'],
    productIds: ['ndn-001', 'ndn-003', 'ndn-004', 'ndn-012'],
    proofPoints: ['Enterprise AI automation architecture', 'Google Cloud-ready systems', 'AI agents with guardrails', 'Remote delivery for Dubai and UAE teams'],
    faqs: [
      {
        question: 'Does NDN Analytics provide AI automation services in Dubai?',
        answer: 'Yes. NDN Analytics serves Dubai and UAE businesses through remote delivery, scheduled working sessions, and production implementation support.',
      },
      {
        question: 'What can Dubai businesses automate with AI?',
        answer: 'Strong candidates include lead routing, document processing, customer support triage, reporting, CRM updates, real estate operations, logistics planning, and finance workflows.',
      },
      {
        question: 'Do you need a Dubai office to serve UAE clients?',
        answer: 'For organic service delivery, no. For Google Maps local pack visibility, a verified UAE business presence helps. NDN Analytics can still serve Dubai clients remotely and through scheduled implementation sessions.',
      },
    ],
  },
  {
    slug: 'ai-consulting-dubai',
    city: 'Dubai',
    region: 'Dubai',
    country: 'United Arab Emirates',
    marketLabel: 'Dubai, UAE',
    serviceName: 'AI Consulting',
    serviceType: 'Enterprise AI consulting',
    h1: 'AI Consulting in Dubai,',
    highlight: 'from Strategy to Systems',
    title: 'AI Consulting Company in Dubai',
    description: 'NDN Analytics provides AI consulting for Dubai businesses, including AI readiness, automation roadmaps, AI agents, custom AI app strategy, and implementation planning.',
    keywords: 'AI consulting Dubai, AI consultant Dubai, enterprise AI consulting UAE, AI strategy Dubai',
    intro: [
      'NDN Analytics helps Dubai leaders choose AI initiatives that can be implemented, governed, and measured.',
      'We turn broad AI ambition into a clear roadmap: data readiness, workflow analysis, platform choice, risk controls, and build sequence.',
    ],
    services: ['AI readiness assessments', 'AI automation roadmaps', 'AI agent architecture', 'Data readiness and governance', 'Vendor and platform selection', 'Implementation planning'],
    industries: ['Real estate', 'Financial services', 'Healthcare', 'Logistics', 'Government-adjacent services', 'Retail', 'Education'],
    productIds: ['ndn-001', 'ndn-002', 'ndn-003', 'ndn-012'],
    proofPoints: ['Practical AI implementation bias', 'Enterprise workflow focus', 'AI plus blockchain expertise', 'Dubai and UAE market targeting'],
    faqs: [
      {
        question: 'What does AI consulting in Dubai include?',
        answer: 'It includes use case discovery, automation audits, data readiness, AI architecture, governance planning, and a roadmap for production implementation.',
      },
      {
        question: 'Can you help with AI agents?',
        answer: 'Yes. NDN Analytics designs AI agents with explicit tool access, human approval thresholds, logging, and workflow integration.',
      },
      {
        question: 'Can consulting lead into a build?',
        answer: 'Yes. NDN Analytics can continue from strategy into prototype, internal tool, automation workflow, or production AI app development.',
      },
    ],
  },
  {
    slug: 'ai-app-development-dubai',
    city: 'Dubai',
    region: 'Dubai',
    country: 'United Arab Emirates',
    marketLabel: 'Dubai, UAE',
    serviceName: 'AI App Development',
    serviceType: 'Custom AI app and product development',
    h1: 'AI App Development in Dubai,',
    highlight: 'for Production Teams',
    title: 'AI App Development Company in Dubai',
    description: 'NDN Analytics builds custom AI apps, AI agents, dashboards, internal tools, and mobile-ready AI products for Dubai and UAE businesses.',
    keywords: 'AI app development Dubai, custom AI apps Dubai, AI software company Dubai, AI product development UAE',
    intro: [
      'NDN Analytics builds AI apps for Dubai teams that need a working product, not a prototype theater demo.',
      'We design the application layer, AI workflows, data access, admin screens, analytics, and deployment path required to support real business users.',
    ],
    services: ['AI product strategy', 'Prototype and MVP development', 'RAG and model integration', 'Workflow UX design', 'Dashboards and admin tools', 'Production deployment'],
    industries: ['Real estate', 'Education', 'Healthcare', 'Logistics', 'Finance', 'Community platforms', 'Retail'],
    productIds: ['ndn-010', 'ndn-012', 'ndn-014', 'ndn-016'],
    proofPoints: ['AI-first product development', 'Mobile and web deployment experience', 'Custom system architecture', 'Product studio execution model'],
    faqs: [
      {
        question: 'What AI apps can NDN Analytics build for Dubai companies?',
        answer: 'We can build AI dashboards, agent workspaces, internal tools, customer portals, education apps, healthcare support tools, and RAG-powered business systems.',
      },
      {
        question: 'Can you build an AI app MVP first?',
        answer: 'Yes. We typically scope a focused MVP around one high-value workflow before expanding into a broader platform.',
      },
      {
        question: 'Can you support mobile app deployment?',
        answer: 'Yes. We can build mobile-first web apps and app-store-ready wrappers when distribution requires it.',
      },
    ],
  },
  {
    slug: 'blockchain-development-dubai',
    city: 'Dubai',
    region: 'Dubai',
    country: 'United Arab Emirates',
    marketLabel: 'Dubai, UAE',
    serviceName: 'Blockchain Development',
    serviceType: 'Blockchain and Web3 development',
    h1: 'Blockchain Development in Dubai,',
    highlight: 'for Trust Infrastructure',
    title: 'Blockchain Development Company in Dubai',
    description: 'NDN Analytics builds blockchain systems, smart contracts, provenance platforms, document proof, credential verification, and tokenization workflows for Dubai and UAE businesses.',
    keywords: 'blockchain development Dubai, Web3 development Dubai, blockchain company Dubai, Ethereum development UAE',
    intro: [
      'NDN Analytics helps Dubai and UAE businesses build blockchain systems where proof, transparency, settlement, and multi-party trust matter.',
      'We connect smart contracts and ledgers to useful business workflows: provenance, credentials, payments, tokenization, and verifiable records.',
    ],
    services: SHARED_BLOCKCHAIN_SERVICES,
    industries: ['Real estate', 'Supply chain', 'Financial services', 'Education', 'Healthcare compliance', 'Community finance'],
    productIds: ['ndn-005', 'ndn-006', 'ndn-007', 'ndn-008', 'ndn-013'],
    proofPoints: ['Ethereum and EVM architecture', 'Security-first contract design', 'Enterprise API integrations', 'AI plus blockchain product strategy'],
    faqs: [
      {
        question: 'What blockchain services does NDN Analytics offer in Dubai?',
        answer: 'We offer smart contract development, blockchain architecture, supply chain traceability, credential verification, tokenization workflows, document proof systems, and integration APIs.',
      },
      {
        question: 'Can you build blockchain for real estate use cases?',
        answer: 'Yes. We can design tokenization, proof-of-ownership, audit, and verification systems for real estate workflows while keeping regulatory and compliance constraints in view.',
      },
      {
        question: 'Do you build private blockchain systems?',
        answer: 'Yes. Enterprise use cases often require private EVM or permissioned architectures rather than fully public networks.',
      },
    ],
  },
  {
    slug: 'smart-contract-development-dubai',
    city: 'Dubai',
    region: 'Dubai',
    country: 'United Arab Emirates',
    marketLabel: 'Dubai, UAE',
    serviceName: 'Smart Contract Development',
    serviceType: 'Smart contract development',
    h1: 'Smart Contract Development in Dubai,',
    highlight: 'Audit-Ready by Design',
    title: 'Smart Contract Development Company in Dubai',
    description: 'NDN Analytics develops Solidity smart contracts, escrow workflows, tokenization systems, verification contracts, and EVM integrations for Dubai and UAE businesses.',
    keywords: 'smart contract development Dubai, Solidity developer Dubai, Ethereum developer Dubai, smart contracts UAE',
    intro: [
      'NDN Analytics builds smart contracts that map to business workflows: escrow, tokenization, verification, settlement, credentials, and proof systems.',
      'The contract is only part of the system. We also design tests, access control, event indexing, dashboards, and API integration so the workflow can operate in production.',
    ],
    services: ['Solidity smart contracts', 'Escrow and settlement workflows', 'Tokenization architecture', 'Credential verification contracts', 'Testing and audit preparation', 'EVM integration layers'],
    industries: ['Real estate', 'B2B payments', 'Supply chain', 'Education', 'Community finance', 'Digital documents'],
    productIds: ['ndn-006', 'ndn-007', 'ndn-008', 'ndn-013'],
    proofPoints: ['Security-first smart contract patterns', 'Ethereum and Layer 2 planning', 'Business integration beyond Web3', 'Audit-ready documentation'],
    faqs: [
      {
        question: 'Can NDN Analytics build smart contracts for Dubai companies?',
        answer: 'Yes. NDN Analytics designs and develops Solidity smart contracts and the surrounding application layer for Dubai and UAE businesses.',
      },
      {
        question: 'Do you recommend audits?',
        answer: 'Yes. For contracts handling value or sensitive workflows, independent audit is recommended before production deployment.',
      },
      {
        question: 'Can smart contracts connect to web or mobile apps?',
        answer: 'Yes. We build the frontend, API, indexer, and dashboard layers that let users interact with contract workflows without needing deep blockchain knowledge.',
      },
    ],
  },
  {
    slug: 'enterprise-ai-automation-uae',
    city: 'Dubai',
    region: 'United Arab Emirates',
    country: 'United Arab Emirates',
    marketLabel: 'UAE',
    serviceName: 'Enterprise AI Automation',
    serviceType: 'Enterprise AI automation and AI agents',
    h1: 'Enterprise AI Automation for',
    highlight: 'UAE Organizations',
    title: 'Enterprise AI Automation in the UAE',
    description: 'NDN Analytics builds enterprise AI automation, AI agents, workflow systems, and custom AI apps for UAE organizations that need governed, production-ready AI.',
    keywords: 'enterprise AI automation UAE, AI automation UAE, AI agents UAE, workflow automation UAE, AI consulting UAE',
    intro: [
      'NDN Analytics helps UAE organizations move from AI experiments to governed automation systems that support real work.',
      'We design AI agents, workflow automation, dashboards, data pipelines, and custom AI applications with operational controls and measurable ROI.',
    ],
    services: SHARED_AI_SERVICES,
    industries: ['Real estate', 'Financial services', 'Healthcare', 'Logistics', 'Retail', 'Education', 'Professional services'],
    productIds: ['ndn-001', 'ndn-002', 'ndn-003', 'ndn-004', 'ndn-012'],
    proofPoints: ['Enterprise AI architecture', 'Governed agent workflows', 'AI readiness and automation audits', 'UAE and Dubai-focused service pages'],
    faqs: [
      {
        question: 'What is enterprise AI automation?',
        answer: 'Enterprise AI automation uses AI agents, data systems, and workflow integrations to automate repeatable business processes while preserving governance, auditability, and human approval where needed.',
      },
      {
        question: 'Which UAE teams benefit most?',
        answer: 'Teams with high-volume operations, reporting, document handling, customer support, logistics, sales operations, or compliance workflows are often the best fit.',
      },
      {
        question: 'Can NDN Analytics support implementation remotely?',
        answer: 'Yes. NDN Analytics supports UAE clients through remote delivery, structured discovery, scheduled implementation sessions, and production deployment support.',
      },
    ],
  },
];

function getConfig(pathname: string) {
  const slug = pathname.replace(/^\//, '').replace(/\/$/, '');
  return LOCAL_SERVICE_PAGES.find((page) => page.slug === slug);
}

export default function LocalServiceLanding() {
  const location = useLocation();
  const config = getConfig(location.pathname);

  if (!config) {
    return <Navigate to="/products" replace />;
  }

  const canonicalUrl = `${BASE_URL}/${config.slug}`;
  const products = PRODUCTS.filter((product) => config.productIds.includes(product.id));
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${config.serviceName} - ${config.marketLabel}`,
    serviceType: config.serviceType,
    description: config.description,
    url: canonicalUrl,
    provider: {
      '@type': config.address ? 'LocalBusiness' : 'Organization',
      name: 'NDN Analytics',
      url: BASE_URL,
      ...(config.address && {
        address: {
          '@type': 'PostalAddress',
          ...config.address,
        },
      }),
    },
    areaServed: {
      '@type': 'Place',
      name: config.marketLabel,
      address: {
        '@type': 'PostalAddress',
        addressLocality: config.city,
        addressRegion: config.region,
        addressCountry: config.country,
      },
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${config.serviceName} services`,
      itemListElement: config.services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service,
        },
      })),
    },
  };

  const localBusinessSchema = config.address
    ? {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: 'NDN Analytics',
        url: BASE_URL,
        image: `${BASE_URL}/logo.jpg`,
        address: {
          '@type': 'PostalAddress',
          ...config.address,
        },
        areaServed: ['Tulsa', 'Oklahoma', 'Oklahoma City'],
        priceRange: '$$',
        sameAs: ['https://www.linkedin.com/company/ndn-analytics-inc/'],
        makesOffer: {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: config.serviceName,
          },
        },
      }
    : null;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: config.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <SEO
        title={config.title}
        description={config.description}
        keywords={config.keywords}
        canonicalPath={`/${config.slug}`}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: config.title, path: `/${config.slug}` },
        ]}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        {localBusinessSchema && <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>}
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <section className="section" style={{ minHeight: '100vh', paddingTop: 132, paddingBottom: 88 }}>
        <div className="container">
          <div className="section-tag">{config.marketLabel}</div>
          <h1 className="section-title" style={{ marginBottom: 24 }}>
            {config.h1}<br />
            <span className="text-gradient">{config.highlight}</span>
          </h1>

          <div style={{ maxWidth: 760, marginBottom: 36 }}>
            {config.intro.map((paragraph) => (
              <p key={paragraph} style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8, marginBottom: 16 }}>
                {paragraph}
              </p>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 64 }}>
            <Link to="/contact" className="btn btn-primary">Book a Discovery Call</Link>
            <Link to="/case-studies" className="btn btn-ghost">View Case Studies</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 22, marginBottom: 64 }}>
            <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 24, background: 'rgba(7, 24, 41, 0.62)' }}>
              <h2 style={{ color: 'var(--text-primary)', fontFamily: "'Syne Variable', sans-serif", fontSize: '1.15rem', marginBottom: 16 }}>
                Services
              </h2>
              {config.services.map((service) => (
                <p key={service} style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>
                  {service}
                </p>
              ))}
            </div>
            <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 24, background: 'rgba(7, 24, 41, 0.62)' }}>
              <h2 style={{ color: 'var(--text-primary)', fontFamily: "'Syne Variable', sans-serif", fontSize: '1.15rem', marginBottom: 16 }}>
                Industries
              </h2>
              {config.industries.map((industry) => (
                <p key={industry} style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>
                  {industry}
                </p>
              ))}
            </div>
            <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 24, background: 'rgba(7, 24, 41, 0.62)' }}>
              <h2 style={{ color: 'var(--text-primary)', fontFamily: "'Syne Variable', sans-serif", fontSize: '1.15rem', marginBottom: 16 }}>
                Why NDN Analytics
              </h2>
              {config.proofPoints.map((point) => (
                <p key={point} style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>
                  {point}
                </p>
              ))}
            </div>
          </div>

          {products.length > 0 && (
            <div style={{ marginBottom: 64 }}>
              <h2 style={{ color: 'var(--text-primary)', fontFamily: "'Syne Variable', sans-serif", fontSize: '1.55rem', marginBottom: 22 }}>
                Relevant NDN Products
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
                {products.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    style={{
                      border: '1px solid rgba(6,182,212,0.18)',
                      borderRadius: 12,
                      padding: 20,
                      background: 'rgba(10,22,40,0.72)',
                      textDecoration: 'none',
                      display: 'block',
                    }}
                  >
                    <div style={{ color: 'var(--brand-cyan)', fontFamily: "'JetBrains Mono Variable', monospace", fontSize: '0.68rem', marginBottom: 8 }}>
                      {product.number}
                    </div>
                    <div style={{ color: 'var(--text-primary)', fontFamily: "'Syne Variable', sans-serif", fontWeight: 700, marginBottom: 8 }}>
                      {product.name}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', lineHeight: 1.55, fontSize: '0.88rem' }}>
                      {product.tagline}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: 64 }}>
            <h2 style={{ color: 'var(--text-primary)', fontFamily: "'Syne Variable', sans-serif", fontSize: '1.55rem', marginBottom: 22 }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: 'grid', gap: 16 }}>
              {config.faqs.map((faq) => (
                <div key={faq.question} style={{ border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 22, background: 'rgba(7, 24, 41, 0.58)' }}>
                  <h3 style={{ color: 'var(--text-primary)', fontFamily: "'Syne Variable', sans-serif", fontSize: '1rem', marginBottom: 8 }}>
                    {faq.question}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 32, display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0, flex: '1 1 320px' }}>
              Ready to scope a practical {config.serviceName.toLowerCase()} initiative for {config.marketLabel}?
            </p>
            <Link to="/contact" className="btn btn-primary">Request an AI Automation Audit</Link>
          </div>
        </div>
      </section>
    </>
  );
}
