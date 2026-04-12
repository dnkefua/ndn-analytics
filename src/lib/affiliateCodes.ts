/**
 * Central affiliate code registry
 *
 * HOW TO UPDATE:
 *   1. Register on each platform (run: node scripts/openAffiliateRegistrations.js)
 *   2. Once approved, paste your real code into the `code` field below
 *   3. Set `registered: true`
 *   4. Run: node scripts/seedAIProducts.js   (to sync to Firestore)
 *   5. Commit + push — the site updates automatically
 *
 * PAYOUT SCHEDULE (all monthly, auto-transfer after threshold):
 *   PartnerStack → PayPal or bank, Net-30, min $25
 *   Impact       → Bank or PayPal, configurable, min $10
 *   Direct       → varies per vendor (see notes)
 */

export interface AffiliateCodeEntry {
  platform: string;
  registered: boolean;
  code: string | null;          // null = not registered yet
  registrationUrl: string;
  dashboardUrl: string;
  paramKey: string;             // URL query param key this platform uses
  notes: string;
}

const AFFILIATE_CODES: Record<string, AffiliateCodeEntry> = {

  // ── PartnerStack (covers: Jasper AI, Copy.ai, Synthesia, Zapier, Make) ──────
  partnerstack: {
    platform: 'PartnerStack',
    registered: false,
    code: null,                 // ← paste your PartnerStack partner ID here
    registrationUrl: 'https://app.partnerstack.com/applications/apply/jasper',
    dashboardUrl: 'https://app.partnerstack.com',
    paramKey: 'fpr',
    notes: 'One account; search each vendor individually inside the dashboard. ' +
           'Each program gives you a unique link—update per-product below.',
  },

  // ── Impact (covers: Otter.ai, Descript, Mixpanel) ─────────────────────────
  impact: {
    platform: 'Impact',
    registered: false,
    code: null,                 // ← paste your Impact partner ID / SID here
    registrationUrl: 'https://app.impact.com/secure/advertiser/signup.ihtml',
    dashboardUrl: 'https://app.impact.com',
    paramKey: 'irclickid',
    notes: 'Search each vendor in the Impact marketplace after account creation.',
  },

  // ── Individual programs ────────────────────────────────────────────────────
  notion: {
    platform: 'Notion Affiliate (via Notion directly)',
    registered: false,
    code: null,                 // ← Notion will assign a slug like "yourname24"
    registrationUrl: 'https://affiliate.notion.so',
    dashboardUrl: 'https://affiliate.notion.so/dashboard',
    paramKey: 'via',            // notion uses ?via=yourcode
    notes: '50% commission on first year. Approval ~1–3 days. ' +
           'Your link will be: https://affiliate.notion.so/YOUR_CODE',
  },

  supabase: {
    platform: 'Supabase Affiliates',
    registered: false,
    code: null,                 // ← paste your Supabase referral slug
    registrationUrl: 'https://supabase.com/partners/affiliates',
    dashboardUrl: 'https://supabase.com/dashboard/account/affiliate',
    paramKey: 'ref',
    notes: '20% commission on first year. Uses ?ref=YOUR_CODE',
  },

  surferseo: {
    platform: 'Surfer SEO Affiliate',
    registered: false,
    code: null,                 // ← paste your Surfer fp_ref code
    registrationUrl: 'https://surferseo.com/affiliate-program',
    dashboardUrl: 'https://surferseo.partnerstack.com',
    paramKey: 'fp_ref',
    notes: '25% recurring. Actually runs on PartnerStack but separate program.',
  },

  vercel: {
    platform: 'Vercel Partner Program',
    registered: false,
    code: null,                 // ← Vercel assigns a partner ID
    registrationUrl: 'https://vercel.com/partners',
    dashboardUrl: 'https://vercel.com/dashboard/partners',
    paramKey: 'ref',
    notes: 'Partner program — may require a brief application review.',
  },

  retool: {
    platform: 'Retool Partner',
    registered: false,
    code: null,                 // ← paste Retool partner code
    registrationUrl: 'https://retool.com/partners',
    dashboardUrl: 'https://partners.retool.com',
    paramKey: 'ref',
    notes: '20% commission first year. B2B — higher conversion rate.',
  },

  // ── Google Cloud (CJ Affiliate) ────────────────────────────────────────────
  gcp: {
    platform: 'Google Cloud Affiliate (via CJ Affiliate)',
    registered: false,
    code: null,                 // ← paste your CJ Affiliate publisher ID / tracking code
    registrationUrl: 'https://cloud.google.com/affiliate-program',
    dashboardUrl: 'https://members.cj.com',
    paramKey: 'utm_source',   // GCP uses standard UTM — CJ injects its own click IDs
    notes: 'Tiered commissions, no cap. Gives audience $350 free trial (vs $300 standard). ' +
           'Apply via CJ Affiliate. Approval is website-content-reviewed.',
  },
};

export default AFFILIATE_CODES;

/**
 * Build an affiliate URL for a product.
 * Falls back to UTM-only if the code is not yet registered.
 */
export function buildAffiliateUrl(
  baseAffiliateUrl: string,
  programKey: keyof typeof AFFILIATE_CODES | string,
  _fallbackUtm: string,
): string {
  const entry = AFFILIATE_CODES[programKey];

  // Not yet registered — use UTM tracking only (no commission, but analytics work)
  if (!entry || !entry.registered || !entry.code) {
    const url = new URL(baseAffiliateUrl);
    url.searchParams.set('utm_source', 'ndnanalytics');
    url.searchParams.set('utm_medium', 'affiliate_pending');
    url.searchParams.set('utm_campaign', 'aitools');
    return url.toString();
  }

  // Registered — inject real referral code
  const url = new URL(baseAffiliateUrl);
  url.searchParams.set(entry.paramKey, entry.code);
  url.searchParams.set('utm_source', 'ndnanalytics');
  url.searchParams.set('utm_medium', 'affiliate');
  url.searchParams.set('utm_campaign', 'aitools');
  return url.toString();
}

/** Returns all unregistered programs — used by the registration launch script */
export function getPendingRegistrations(): AffiliateCodeEntry[] {
  return Object.values(AFFILIATE_CODES).filter(e => !e.registered);
}

/** Returns all registered programs — for dashboard/reporting */
export function getActivePrograms(): AffiliateCodeEntry[] {
  return Object.values(AFFILIATE_CODES).filter(e => e.registered && e.code);
}
