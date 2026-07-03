/**
 * Opens all pending affiliate registration pages in your browser.
 *
 * Run from project root:
 *   node scripts/openAffiliateRegistrations.js
 *
 * Options:
 *   --all        Open all programs (including already-registered ones)
 *   --list       Print URLs without opening browser
 */

import { execSync } from 'child_process';

const PROGRAMS = [
  {
    name: 'PartnerStack',
    url: 'https://app.partnerstack.com/applications/apply/jasper',
    covers: ['Jasper AI (30% recurring)', 'Copy.ai (45% first year)', 'Synthesia (25% recurring)', 'Zapier (20-30%)', 'Make (20%)'],
    commission: 'Multiple products — highest priority',
    note: 'One signup. Then search each product inside the dashboard.',
  },
  {
    name: 'Impact',
    url: 'https://impact.com/partners/',
    covers: ['Otter.ai (20%)', 'Descript (15% recurring)', 'Mixpanel'],
    commission: 'Multiple products',
    note: 'One signup. Search each product in the Impact marketplace.',
  },
  {
    name: 'Notion Affiliate',
    url: 'https://affiliate.notion.so',
    covers: ['Notion (50% first year)'],
    commission: '50% of first year — best single rate',
    note: 'Notion assigns you a unique slug (e.g. affiliate.notion.so/yourcode).',
  },
  {
    name: 'Surfer SEO Affiliate',
    url: 'https://surferseo.com/affiliate-program',
    covers: ['Surfer SEO (25% recurring)'],
    commission: '25% recurring commission',
    note: 'High B2B conversion — SEO buyers are high intent.',
  },
  {
    name: 'Supabase Affiliates',
    url: 'https://supabase.com/partners/affiliates',
    covers: ['Supabase (20% first year)'],
    commission: '20% first year',
    note: 'Developer audience — high intent, technical buyers.',
  },
  {
    name: 'Vercel Partners',
    url: 'https://vercel.com/partners',
    covers: ['Vercel (partner program)'],
    commission: 'Revenue share — application required',
    note: 'May take a few days to review.',
  },
  {
    name: 'Retool Partners',
    url: 'https://retool.com/partners',
    covers: ['Retool (20% first year)'],
    commission: '20% first year — highest B2B order values',
    note: 'Enterprise tool — customers pay $10k+ per year.',
  },
  {
    name: 'Google Cloud Affiliate (CJ Affiliate)',
    url: 'https://cloud.google.com/affiliate-program',
    covers: ['Google Cloud (tiered commissions, no cap)'],
    commission: 'Tiered — scales with referral volume, no annual cap',
    note: 'Runs via CJ Affiliate. Gives your audience $350 free trial (vs $300 standard). Apply on the GCP page, get redirected to CJ to complete signup.',
  },
];

const listOnly = process.argv.includes('--list');

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('  NDN Analytics — Affiliate Registration Launcher');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log(`  ${PROGRAMS.length} programs to register on\n`);

PROGRAMS.forEach((p, i) => {
  console.log(`  ${i + 1}. ${p.name}`);
  console.log(`     Covers:     ${p.covers.join(', ')}`);
  console.log(`     Commission: ${p.commission}`);
  console.log(`     Note:       ${p.note}`);
  console.log(`     URL:        ${p.url}`);
  console.log('');
});

if (listOnly) {
  console.log('  --list mode: URLs printed above, no browser opened.\n');
  process.exit(0);
}

// Open all URLs in the default browser
function openUrl(url) {
  try {
    // Windows
    execSync(`start "" "${url}"`, { stdio: 'ignore', shell: true });
  } catch {
    try {
      // macOS
      execSync(`open "${url}"`, { stdio: 'ignore' });
    } catch {
      try {
        // Linux
        execSync(`xdg-open "${url}"`, { stdio: 'ignore' });
      } catch {
        console.warn(`  Could not auto-open: ${url}`);
      }
    }
  }
}

console.log('  Opening all registration pages in your browser...\n');

// Stagger opens by 600ms so tabs don't all slam at once
PROGRAMS.forEach((p, i) => {
  setTimeout(() => {
    openUrl(p.url);
    console.log(`  ✓ Opened: ${p.name}`);
    if (i === PROGRAMS.length - 1) {
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('  All pages opened. Complete each signup, then:');
      console.log('');
      console.log('  1. Paste your real codes into:');
      console.log('     src/lib/affiliateCodes.ts  (set registered: true)');
      console.log('');
      console.log('  2. Sync to Firestore:');
      console.log('     node scripts/seedAIProducts.js');
      console.log('');
      console.log('  3. Commit and push:');
      console.log('     git add src/lib/affiliateCodes.ts');
      console.log('     git commit -m "feat: activate affiliate codes"');
      console.log('     git push');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    }
  }, i * 600);
});
