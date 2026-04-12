/**
 * Seed script: Populates the `aiProducts` Firestore collection
 *
 * Prerequisites:
 *   Must be authenticated with one of:
 *     A) gcloud ADC (recommended):  gcloud auth application-default login
 *     B) Service account key:       set GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
 *     C) Firebase CI token:         set FIREBASE_TOKEN=$(firebase login:ci)
 *
 * Run from project root:
 *   node scripts/seedAIProducts.js           (seed / upsert)
 *   node scripts/seedAIProducts.js --dry-run  (preview only)
 *   node scripts/seedAIProducts.js --clear    (delete all first, then seed)
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const isDryRun = process.argv.includes('--dry-run');
const clearFirst = process.argv.includes('--clear');

// ─── Config ───────────────────────────────────────────────────────────────────

function loadEnvProjectId() {
  try {
    const envPath = resolve(__dirname, '../.env');
    const env = readFileSync(envPath, 'utf8');
    const match = env.match(/^VITE_FIREBASE_PROJECT_ID=(.+)$/m);
    return match ? match[1].trim() : undefined;
  } catch {
    return undefined;
  }
}

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || loadEnvProjectId() || 'ndn-analytics';
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// ─── Auth ─────────────────────────────────────────────────────────────────────

function getAccessToken() {
  // Priority 1: service account JSON via GOOGLE_APPLICATION_CREDENTIALS
  const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (keyPath && existsSync(keyPath)) {
    const key = JSON.parse(readFileSync(keyPath, 'utf8'));
    // Use google-auth-library from ADC flow — fall through to gcloud
    console.log('  Using service account key from GOOGLE_APPLICATION_CREDENTIALS');
  }

  // Priority 2: gcloud ADC (most common local dev setup)
  try {
    const token = execSync('gcloud auth application-default print-access-token 2>nul', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
    if (token && token.startsWith('ya29.')) return token;
  } catch {
    // fall through
  }

  // Priority 3: gcloud user token
  try {
    const token = execSync('gcloud auth print-access-token 2>nul', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
    if (token && token.startsWith('ya29.')) return token;
  } catch {
    // fall through
  }

  throw new Error(
    'No valid credentials found.\n' +
    '  Run: gcloud auth application-default login\n' +
    '  Or:  set GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json',
  );
}

// ─── Firestore REST helpers ───────────────────────────────────────────────────

function toFirestoreValue(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  if (typeof val === 'string') return { stringValue: val };
  if (Array.isArray(val)) return { arrayValue: { values: val.map(toFirestoreValue) } };
  if (val instanceof Date) return { timestampValue: val.toISOString() };
  if (typeof val === 'object') {
    return {
      mapValue: {
        fields: Object.fromEntries(
          Object.entries(val).map(([k, v]) => [k, toFirestoreValue(v)]),
        ),
      },
    };
  }
  return { stringValue: String(val) };
}

function toFirestoreDoc(obj) {
  return {
    fields: Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, toFirestoreValue(v)]),
    ),
  };
}

async function firestoreRequest(method, path, body, token) {
  const res = await fetch(`${FIRESTORE_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  return res.json();
}

async function docExists(docId, token) {
  try {
    await firestoreRequest('GET', `/aiProducts/${docId}`, null, token);
    return true;
  } catch {
    return false;
  }
}

async function listAllDocIds(token) {
  try {
    const data = await firestoreRequest('GET', '/aiProducts?pageSize=200&mask.fieldPaths=name', null, token);
    return (data.documents || []).map(d => d.name.split('/').pop());
  } catch {
    return [];
  }
}

async function deleteDoc(docId, token) {
  await firestoreRequest('DELETE', `/aiProducts/${docId}`, null, token);
}

// ─── Product data ─────────────────────────────────────────────────────────────

/** @type {Array<Omit<import('../src/types/aiProducts.ts').AIProduct,'id'|'clickCount'|'createdAt'|'updatedAt'>>} */
const AI_PRODUCTS = [
  // ── LLM APIs ──────────────────────────────────────────────────────────────
  {
    name: 'Anthropic Claude',
    tagline: 'The AI assistant that is safe, beneficial, and honest',
    description:
      'Claude is Anthropic\'s frontier AI model — trusted by enterprises for reasoning, coding, summarization, and long-context analysis. NDN Analytics is built on Claude Haiku for real-time intelligence.',
    logoUrl: 'https://www.anthropic.com/favicon.ico',
    websiteUrl: 'https://www.anthropic.com',
    affiliateUrl: 'https://www.anthropic.com',
    affiliateProgramUrl: 'https://www.anthropic.com/partner',
    affiliateProgram: 'anthropic',
    commissionRate: 'Referral program',
    cookieDuration: 30,
    ndnServiceTieIn:
      'NDN Analytics uses Claude as the AI backbone for ARIA, our enterprise chatbot. Let us integrate Claude into your workflows.',
    category: 'llm_api',
    tags: ['llm', 'api', 'enterprise', 'reasoning', 'coding', 'safety'],
    pricing: 'paid',
    featured: true,
    sortOrder: 1,
    badge: 'Powers NDN',
    isActive: true,
  },
  {
    name: 'OpenAI',
    tagline: 'GPT-4o, o1, and the world\'s most capable AI models',
    description:
      'OpenAI provides the GPT-4o and o1 model families through a developer-friendly API. Industry-leading multimodal capabilities for text, images, audio, and code generation.',
    logoUrl: 'https://openai.com/favicon.ico',
    websiteUrl: 'https://openai.com',
    affiliateUrl: 'https://platform.openai.com/signup',
    affiliateProgram: 'openai',
    commissionRate: 'Affiliate program',
    cookieDuration: 30,
    ndnServiceTieIn:
      'NDN Analytics can benchmark GPT-4o vs Claude for your specific use case and integrate the winning model into your stack.',
    category: 'llm_api',
    tags: ['llm', 'api', 'gpt', 'multimodal', 'enterprise'],
    pricing: 'paid',
    featured: true,
    sortOrder: 2,
    badge: 'Industry Leader',
    isActive: true,
  },

  // ── Developer Tools ────────────────────────────────────────────────────────
  {
    name: 'Cursor',
    tagline: 'The AI-first code editor built on VS Code',
    description:
      'Cursor is an AI-native IDE that understands your entire codebase. Multi-line edits, codebase chat, and AI terminal commands make it the fastest way to build software with AI.',
    logoUrl: 'https://cursor.sh/favicon.ico',
    websiteUrl: 'https://cursor.sh',
    affiliateUrl: 'https://cursor.sh',
    affiliateProgram: 'direct',
    ndnServiceTieIn:
      'NDN Analytics uses Cursor internally and can train your engineering team on AI-assisted development workflows.',
    category: 'dev_tools',
    tags: ['ide', 'coding', 'ai-assistant', 'developer', 'productivity'],
    pricing: 'freemium',
    featured: true,
    sortOrder: 10,
    badge: 'Team Favourite',
    isActive: true,
  },
  {
    name: 'Linear',
    tagline: 'The issue tracker built for modern software teams',
    description:
      'Linear brings speed and clarity to software projects with AI-assisted issue creation, automatic triage, and intelligent project planning that keeps teams focused on shipping.',
    logoUrl: 'https://linear.app/favicon.ico',
    websiteUrl: 'https://linear.app',
    affiliateUrl: 'https://linear.app',
    affiliateProgram: 'linear',
    commissionRate: '20%',
    cookieDuration: 60,
    ndnServiceTieIn:
      'NDN Analytics integrates project data from Linear into custom analytics dashboards so leadership always has real-time visibility.',
    category: 'dev_tools',
    tags: ['project-management', 'issue-tracker', 'devops', 'planning'],
    pricing: 'freemium',
    featured: false,
    sortOrder: 12,
    isActive: true,
  },
  {
    name: 'Retool',
    tagline: 'Build internal tools remarkably fast',
    description:
      'Retool lets you build internal dashboards, admin panels, and data apps on top of any database or API — without building a frontend from scratch. AI-accelerated with Retool AI.',
    logoUrl: 'https://retool.com/favicon.ico',
    websiteUrl: 'https://retool.com',
    affiliateUrl: 'https://retool.com/?utm_source=ndnanalytics',
    affiliateProgramUrl: 'https://retool.com/partners',
    affiliateProgram: 'retool',
    commissionRate: '20% first year',
    cookieDuration: 90,
    ndnServiceTieIn:
      'NDN Analytics builds and deploys production Retool apps for enterprise clients — from supply chain dashboards to DeFi portfolio trackers.',
    category: 'dev_tools',
    tags: ['low-code', 'internal-tools', 'dashboard', 'admin-panel'],
    pricing: 'freemium',
    featured: true,
    sortOrder: 11,
    badge: 'Partner',
    isActive: true,
  },

  // ── Productivity ──────────────────────────────────────────────────────────
  {
    name: 'Notion',
    tagline: 'The connected workspace with AI built in',
    description:
      'Notion combines docs, wikis, databases, and project management into one collaborative workspace. Notion AI drafts, summarizes, and answers questions across all your team knowledge.',
    logoUrl: 'https://www.notion.so/images/favicon.ico',
    websiteUrl: 'https://www.notion.com',
    affiliateUrl: 'https://affiliate.notion.so/ndnanalytics',
    affiliateProgramUrl: 'https://www.notion.com/affiliates',
    affiliateProgram: 'notion',
    commissionRate: '50% first year',
    cookieDuration: 90,
    ndnServiceTieIn:
      'NDN Analytics can build your team\'s Notion operating system — SOPs, project hubs, client databases, and AI-assisted knowledge bases.',
    category: 'productivity',
    tags: ['docs', 'wiki', 'collaboration', 'ai-writing', 'project-management'],
    pricing: 'freemium',
    featured: false,
    sortOrder: 20,
    isActive: true,
  },

  // ── Analytics ─────────────────────────────────────────────────────────────
  {
    name: 'Mixpanel',
    tagline: 'Product analytics that helps you convert, engage, and retain',
    description:
      'Mixpanel is the leading product analytics platform for tracking user behaviour, running A/B tests, and understanding exactly which features drive retention and revenue.',
    logoUrl: 'https://mixpanel.com/favicon.ico',
    websiteUrl: 'https://mixpanel.com',
    affiliateUrl: 'https://mixpanel.com',
    affiliateProgram: 'impact',
    commissionRate: 'Referral credits',
    cookieDuration: 30,
    ndnServiceTieIn:
      'NDN Analytics implements Mixpanel event tracking architectures and builds custom reporting pipelines on top of your Mixpanel data.',
    category: 'analytics',
    tags: ['product-analytics', 'user-tracking', 'retention', 'a-b-testing'],
    pricing: 'freemium',
    featured: false,
    sortOrder: 30,
    isActive: true,
  },
  {
    name: 'Segment',
    tagline: 'The leading Customer Data Platform',
    description:
      'Segment collects, unifies, and connects your customer data to 400+ analytics and marketing tools. A single tracking plan replaces dozens of fragmented integrations.',
    logoUrl: 'https://segment.com/favicon.ico',
    websiteUrl: 'https://segment.com',
    affiliateUrl: 'https://segment.com',
    affiliateProgram: 'direct',
    ndnServiceTieIn:
      'NDN Analytics designs and implements your Segment tracking plan, ensuring clean, governed data flows to every downstream tool.',
    category: 'analytics',
    tags: ['cdp', 'data', 'tracking', 'integration', 'marketing-analytics'],
    pricing: 'freemium',
    featured: false,
    sortOrder: 31,
    isActive: true,
  },

  // ── Automation ────────────────────────────────────────────────────────────
  {
    name: 'Zapier',
    tagline: 'Automate your work across 7,000+ apps',
    description:
      'Zapier connects your apps and automates workflows with no code. AI-powered Zaps let you describe the automation you want in plain English and have it built instantly.',
    logoUrl: 'https://cdn.zapier.com/zapier/images/favicon.ico',
    websiteUrl: 'https://zapier.com',
    affiliateUrl: 'https://zapier.com?utm_source=ndnanalytics',
    affiliateProgramUrl: 'https://zapier.com/affiliate',
    affiliateProgram: 'partnerstack',
    commissionRate: '20-30%',
    cookieDuration: 90,
    ndnServiceTieIn:
      'NDN Analytics designs multi-step Zapier workflows that connect your CRM, email, Slack, and ERP — eliminating manual data entry across your team.',
    category: 'automation',
    tags: ['no-code', 'integration', 'workflow', 'automation'],
    pricing: 'freemium',
    featured: false,
    sortOrder: 40,
    isActive: true,
  },
  {
    name: 'Make (Integromat)',
    tagline: 'Visual automation for complex business workflows',
    description:
      'Make (formerly Integromat) is the most powerful visual workflow builder for complex automations that require data transformation, conditional logic, and multi-branch flows.',
    logoUrl: 'https://www.make.com/favicon.ico',
    websiteUrl: 'https://www.make.com',
    affiliateUrl: 'https://www.make.com/en/register?pc=ndnanalytics',
    affiliateProgramUrl: 'https://www.make.com/en/partners',
    affiliateProgram: 'partnerstack',
    commissionRate: '20%',
    cookieDuration: 30,
    ndnServiceTieIn:
      'NDN Analytics builds enterprise-grade Make scenarios for supply chain event processing, DeFi alert systems, and healthcare data pipelines.',
    category: 'automation',
    tags: ['no-code', 'integration', 'workflow', 'data-transformation'],
    pricing: 'freemium',
    featured: false,
    sortOrder: 41,
    isActive: true,
  },

  // ── Database ──────────────────────────────────────────────────────────────
  {
    name: 'Supabase',
    tagline: 'The open source Firebase alternative',
    description:
      'Supabase is a fully managed Postgres database with instant REST and GraphQL APIs, real-time subscriptions, auth, storage, and AI/vector support built in.',
    logoUrl: 'https://supabase.com/favicon/favicon-32x32.png',
    websiteUrl: 'https://supabase.com',
    affiliateUrl: 'https://supabase.com/?utm_source=ndnanalytics',
    affiliateProgramUrl: 'https://supabase.com/partners/affiliates',
    affiliateProgram: 'supabase',
    commissionRate: '20% first year',
    cookieDuration: 30,
    ndnServiceTieIn:
      'NDN Analytics provisions and optimises Supabase databases for AI applications, including vector search pipelines and row-level security policies.',
    category: 'database',
    tags: ['postgres', 'database', 'vector-search', 'real-time', 'open-source'],
    pricing: 'freemium',
    featured: true,
    sortOrder: 50,
    badge: 'Recommended',
    isActive: true,
  },

  // ── Infrastructure ────────────────────────────────────────────────────────
  {
    name: 'Vercel',
    tagline: 'Deploy web projects with zero configuration',
    description:
      'Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration. Built for AI-powered apps with v0 and AI SDK.',
    logoUrl: 'https://vercel.com/favicon.ico',
    websiteUrl: 'https://vercel.com',
    affiliateUrl: 'https://vercel.com?utm_source=ndnanalytics',
    affiliateProgramUrl: 'https://vercel.com/partners',
    affiliateProgram: 'vercel',
    commissionRate: 'Partner program',
    cookieDuration: 30,
    ndnServiceTieIn:
      'NDN Analytics deploys and optimises Next.js and React applications on Vercel, including Edge Network configuration and ISR caching strategies.',
    category: 'infrastructure',
    tags: ['hosting', 'deployment', 'serverless', 'edge', 'cdn'],
    pricing: 'freemium',
    featured: true,
    sortOrder: 60,
    badge: 'Partner',
    isActive: true,
  },
  {
    name: 'Cloudflare',
    tagline: 'The global network platform for performance and security',
    description:
      'Cloudflare protects and accelerates any internet application with a global anycast network, DDoS mitigation, WAF, Workers serverless platform, and AI Gateway.',
    logoUrl: 'https://www.cloudflare.com/favicon.ico',
    websiteUrl: 'https://www.cloudflare.com',
    affiliateUrl: 'https://www.cloudflare.com',
    affiliateProgram: 'none',
    ndnServiceTieIn:
      'NDN Analytics configures Cloudflare for enterprise clients — WAF rules, zero-trust access, AI Gateway, and Workers for edge computing.',
    category: 'infrastructure',
    tags: ['cdn', 'security', 'ddos-protection', 'serverless', 'edge'],
    pricing: 'freemium',
    featured: false,
    sortOrder: 61,
    isActive: true,
  },

  // ── Productivity / AI Writing ──────────────────────────────────────────────
  {
    name: 'Jasper AI',
    tagline: 'AI copilot for enterprise marketing teams',
    description:
      'Generate marketing copy, blog posts, social media content, and ads at scale. Jasper is used by 100,000+ teams worldwide and integrates with your existing marketing stack.',
    logoUrl: 'https://www.jasper.ai/favicon.ico',
    websiteUrl: 'https://www.jasper.ai',
    affiliateUrl: 'https://www.jasper.ai?fpr=ndnanalytics',
    affiliateProgramUrl: 'https://www.jasper.ai/partners',
    affiliateProgram: 'partnerstack',
    commissionRate: '30% recurring',
    cookieDuration: 30,
    ndnServiceTieIn:
      'NDN Analytics integrates Jasper into your content pipeline for automated blog generation and multi-channel marketing.',
    category: 'productivity',
    tags: ['ai', 'writing', 'marketing', 'content', 'copywriting'],
    pricing: 'paid',
    featured: true,
    sortOrder: 21,
    badge: '30% Recurring',
    isActive: true,
  },
  {
    name: 'Copy.ai',
    tagline: 'AI-powered copywriting at scale',
    description:
      'Create marketing copy, product descriptions, and sales content in seconds. Trusted by 10M+ users, Copy.ai automates GTM workflows and entire content operations for enterprise teams.',
    logoUrl: 'https://www.copy.ai/favicon.ico',
    websiteUrl: 'https://www.copy.ai',
    affiliateUrl: 'https://www.copy.ai?via=ndnanalytics',
    affiliateProgramUrl: 'https://www.copy.ai/partners',
    affiliateProgram: 'partnerstack',
    commissionRate: '45% first year',
    cookieDuration: 60,
    ndnServiceTieIn:
      'Our team embeds Copy.ai workflows into your marketing automation stack for fully autonomous content production.',
    category: 'productivity',
    tags: ['ai', 'writing', 'copywriting', 'marketing', 'gtm'],
    pricing: 'freemium',
    featured: true,
    sortOrder: 22,
    badge: '45% Commission',
    isActive: true,
  },
  {
    name: 'Otter.ai',
    tagline: 'AI meeting assistant and transcription',
    description:
      'Automated meeting notes, real-time transcription, and AI summaries. Integrates with Zoom, Microsoft Teams, and Google Meet to capture every decision and action item automatically.',
    logoUrl: 'https://otter.ai/favicon.ico',
    websiteUrl: 'https://otter.ai',
    affiliateUrl: 'https://otter.ai?ref=ndnanalytics',
    affiliateProgramUrl: 'https://otter.ai/affiliates',
    affiliateProgram: 'impact',
    commissionRate: '20%',
    cookieDuration: 30,
    ndnServiceTieIn:
      'NDN Interpreter handles real-time ASL translation with similar edge-AI technology — built for inclusivity at enterprise scale.',
    category: 'productivity',
    tags: ['ai', 'transcription', 'meetings', 'notes', 'automation'],
    pricing: 'freemium',
    featured: false,
    sortOrder: 23,
    isActive: true,
  },

  // ── Design / Video AI ──────────────────────────────────────────────────────
  {
    name: 'Synthesia',
    tagline: 'AI video generation platform',
    description:
      'Create professional AI avatar videos from text in minutes. No cameras, studios, or actors required. Used by 50,000+ teams for training, marketing, and communications at scale.',
    logoUrl: 'https://www.synthesia.io/favicon.ico',
    websiteUrl: 'https://www.synthesia.io',
    affiliateUrl: 'https://www.synthesia.io?ref=ndnanalytics',
    affiliateProgramUrl: 'https://www.synthesia.io/affiliates',
    affiliateProgram: 'partnerstack',
    commissionRate: '20-25% recurring',
    cookieDuration: 90,
    ndnServiceTieIn:
      'NDN Analytics embeds AI video generation into enterprise training and marketing workflows — reducing video production costs by 80%.',
    category: 'design',
    tags: ['ai', 'video', 'avatars', 'training', 'marketing'],
    pricing: 'paid',
    featured: true,
    sortOrder: 30,
    badge: '25% Recurring',
    isActive: true,
  },
  {
    name: 'Descript',
    tagline: 'All-in-one video and podcast editing',
    description:
      'Edit video and audio by editing the transcript — the most intuitive editor ever made. AI Overdub, filler-word removal, screen recording, and automatic captions built in.',
    logoUrl: 'https://www.descript.com/favicon.ico',
    websiteUrl: 'https://www.descript.com',
    affiliateUrl: 'https://www.descript.com?ref=ndnanalytics',
    affiliateProgramUrl: 'https://www.descript.com/affiliates',
    affiliateProgram: 'impact',
    commissionRate: '15% recurring',
    cookieDuration: 30,
    ndnServiceTieIn:
      'NDN Interpreter uses similar real-time AI for sign language translation — reducing communication barriers across enterprise.',
    category: 'design',
    tags: ['ai', 'video', 'audio', 'podcasting', 'transcription'],
    pricing: 'freemium',
    featured: false,
    sortOrder: 31,
    isActive: true,
  },

  // ── Analytics / SEO ───────────────────────────────────────────────────────
  {
    name: 'Surfer SEO',
    tagline: 'AI-powered SEO and content optimization',
    description:
      'Write content that ranks on page one. Real-time NLP-based SEO suggestions, keyword research, content auditing, and SERP analyzer built for content teams and agencies.',
    logoUrl: 'https://surferseo.com/favicon.ico',
    websiteUrl: 'https://surferseo.com',
    affiliateUrl: 'https://surferseo.com?fp_ref=ndnanalytics',
    affiliateProgramUrl: 'https://surferseo.com/affiliate-program',
    affiliateProgram: 'direct',
    commissionRate: '25% recurring',
    cookieDuration: 60,
    ndnServiceTieIn:
      'NDN Analytics implements Surfer SEO alongside our blog auto-generation pipeline to produce content that ranks automatically.',
    category: 'analytics',
    tags: ['seo', 'content', 'ai', 'optimization', 'ranking'],
    pricing: 'paid',
    featured: true,
    sortOrder: 40,
    badge: '25% Recurring',
    isActive: true,
  },
];

// ─── Upsert / clear ───────────────────────────────────────────────────────────

async function upsertProduct(product, token) {
  const now = new Date().toISOString();
  const docId = product.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const exists = await docExists(docId, token);

  const docData = exists
    ? { ...product, updatedAt: now }
    : { ...product, clickCount: 0, createdAt: now, updatedAt: now };

  // PATCH creates or fully replaces the document
  await firestoreRequest('PATCH', `/aiProducts/${docId}`, toFirestoreDoc(docData), token);
  return { action: exists ? 'updated' : 'created', id: docId };
}

async function clearCollection(token) {
  const ids = await listAllDocIds(token);
  if (ids.length === 0) {
    console.log('  Collection already empty.');
    return;
  }
  for (const id of ids) {
    await deleteDoc(id, token);
  }
  console.log(`  Deleted ${ids.length} existing product(s).`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\nNDN Analytics — Firestore AI Products Seed`);
  console.log(`Project: ${PROJECT_ID}`);
  console.log(`Mode:    ${isDryRun ? 'DRY RUN (no writes)' : 'LIVE'}`);
  console.log(`Products to seed: ${AI_PRODUCTS.length}\n`);

  if (isDryRun) {
    console.log('Products that would be seeded:');
    AI_PRODUCTS.forEach((p, i) => {
      console.log(`  ${i + 1}. [${p.category}] ${p.name} — ${p.tagline}`);
    });
    console.log('\nRun without --dry-run to write to Firestore.\n');
    return;
  }

  console.log('Obtaining credentials…');
  const token = getAccessToken();
  console.log('  OK\n');

  if (clearFirst) {
    console.log('Clearing existing aiProducts…');
    await clearCollection(token);
    console.log('');
  }

  console.log('Seeding products…');
  let created = 0;
  let updated = 0;
  let failed = 0;

  for (const product of AI_PRODUCTS) {
    try {
      const { action, id } = await upsertProduct(product, token);
      const icon = action === 'created' ? '✓' : '↻';
      console.log(`  ${icon} ${action.padEnd(7)} ${id}`);
      if (action === 'created') created++;
      else updated++;
    } catch (err) {
      console.error(`  ✗ FAILED  ${product.name}: ${err.message.slice(0, 200)}`);
      failed++;
    }
  }

  console.log('\n─────────────────────────────────────────');
  console.log(`Created: ${created}  Updated: ${updated}  Failed: ${failed}`);
  console.log(`\nView in console:`);
  console.log(`https://console.firebase.google.com/project/${PROJECT_ID}/firestore/data/aiProducts`);
  console.log('');
}

main().catch(err => {
  console.error('\nSeed failed:', err.message);
  process.exit(1);
});
