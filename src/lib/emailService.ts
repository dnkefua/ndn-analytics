// Email service using Resend for transactional emails and sequences
// Docs: https://resend.com/docs

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;
const FROM_EMAIL = 'NDN Analytics <hello@ndnanalytics.com>';

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  tags?: { name: string; value: string }[];
}

export interface SequenceStep {
  delayDays: number;
  subject: string;
  templateId: string;
}

// Email sequences definitions
export const EMAIL_SEQUENCES = {
  lead_nurture: {
    name: 'Lead Nurture Sequence',
    steps: [
      { delayDays: 0, subject: 'Welcome to NDN Analytics', templateId: 'welcome' },
      { delayDays: 3, subject: 'How AI is Transforming Enterprise Operations', templateId: 'case_study' },
      { delayDays: 7, subject: 'Your Industry-Specific AI Solution', templateId: 'product_deep_dive' },
      { delayDays: 14, subject: 'Ready to See It in Action?', templateId: 'consultation_offer' },
    ],
  },
  content_upgrade: {
    name: 'Content Upgrade Sequence',
    steps: [
      { delayDays: 0, subject: 'Your Download is Ready', templateId: 'download_delivery' },
      { delayDays: 2, subject: 'Did You Find the Guide Helpful?', templateId: 'feedback_request' },
      { delayDays: 5, subject: 'Related Resources You Might Like', templateId: 'related_content' },
      { delayDays: 10, subject: 'Let\'s Talk Implementation', templateId: 'consultation_offer' },
    ],
  },
  demo_followup: {
    name: 'Demo Follow-up Sequence',
    steps: [
      { delayDays: 0, subject: 'Thanks for Booking a Demo!', templateId: 'demo_confirmation' },
      { delayDays: 1, subject: 'What to Prepare for Your Demo', templateId: 'demo_prep' },
      { delayDays: 3, subject: 'Following Up on Your Demo', templateId: 'demo_followup' },
    ],
  },
};

// Email templates
export const EMAIL_TEMPLATES: Record<string, (data: Record<string, string>) => string> = {
  welcome: (data) => `
    <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 24px; color: #1E293B;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #7C3AED; font-size: 24px; margin-bottom: 8px;">NDN Analytics</h1>
        <p style="color: #64748B; font-size: 14px;">AI & Blockchain Enterprise Solutions</p>
      </div>

      <h2 style="font-size: 22px; color: #0F172A; margin-bottom: 16px;">Welcome${data.name ? `, ${data.name}` : ''}!</h2>

      <p style="font-size: 16px; line-height: 1.7; color: #475569; margin-bottom: 20px;">
        Thanks for joining NDN Analytics. We build AI products that predict outcomes and blockchain solutions that prove authenticity.
      </p>

      <p style="font-size: 16px; line-height: 1.7; color: #475569; margin-bottom: 20px;">
        Here's what you can expect from us:
      </p>

      <ul style="font-size: 15px; line-height: 1.8; color: #475569; margin-bottom: 24px; padding-left: 20px;">
        <li>Weekly insights on enterprise AI and blockchain adoption</li>
        <li>Case studies from real implementations</li>
        <li>Early access to new products and features</li>
        <li>No spam — ever</li>
      </ul>

      <div style="text-align: center; margin: 32px 0;">
        <a href="https://ndn-analytics.web.app/products" style="display: inline-block; background: #7C3AED; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Explore Our Products →
        </a>
      </div>

      <p style="font-size: 14px; color: #94A3B8; text-align: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid #E2E8F0;">
        NDN Analytics | AI & Blockchain Solutions<br>
        <a href="https://ndn-analytics.web.app" style="color: #7C3AED;">ndn-analytics.web.app</a>
      </p>
    </div>
  `,

  download_delivery: (data) => `
    <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 24px; color: #1E293B;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #7C3AED; font-size: 24px; margin-bottom: 8px;">NDN Analytics</h1>
      </div>

      <h2 style="font-size: 22px; color: #0F172A; margin-bottom: 16px;">Your Download is Ready!</h2>

      <p style="font-size: 16px; line-height: 1.7; color: #475569; margin-bottom: 24px;">
        Thanks for downloading <strong>${data.resourceName || 'our guide'}</strong>. Click below to access it:
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${data.downloadUrl || 'https://ndn-analytics.web.app/downloads'}" style="display: inline-block; background: #7C3AED; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Download Now →
        </a>
      </div>

      <p style="font-size: 15px; line-height: 1.7; color: #475569; margin-bottom: 20px;">
        We think you'll find this resource valuable as you evaluate AI and blockchain solutions for your organization.
      </p>

      <p style="font-size: 15px; line-height: 1.7; color: #475569;">
        Questions? Just reply to this email — we read every response.
      </p>

      <p style="font-size: 14px; color: #94A3B8; text-align: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid #E2E8F0;">
        NDN Analytics | <a href="https://ndn-analytics.web.app" style="color: #7C3AED;">ndn-analytics.web.app</a>
      </p>
    </div>
  `,

  case_study: (data) => `
    <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 24px; color: #1E293B;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #7C3AED; font-size: 24px; margin-bottom: 8px;">NDN Analytics</h1>
      </div>

      <h2 style="font-size: 22px; color: #0F172A; margin-bottom: 16px;">Real Results: AI in Enterprise Operations</h2>

      <p style="font-size: 16px; line-height: 1.7; color: #475569; margin-bottom: 24px;">
        Hi${data.name ? ` ${data.name}` : ''},
      </p>

      <p style="font-size: 16px; line-height: 1.7; color: #475569; margin-bottom: 20px;">
        We wanted to share how organizations like yours are using AI to transform operations:
      </p>

      <div style="background: #F8FAFC; padding: 24px; border-radius: 12px; margin: 24px 0; border-left: 4px solid #7C3AED;">
        <h3 style="font-size: 18px; color: #0F172A; margin-bottom: 12px;">Retail Demand Forecasting</h3>
        <p style="font-size: 15px; color: #475569; margin-bottom: 12px;">
          A regional grocery chain improved forecast accuracy by <strong>32%</strong> and reduced stockouts by <strong>45%</strong> within 90 days.
        </p>
        <p style="font-size: 14px; color: #64748B;">
          "We went from gut-feel ordering to data-driven precision." — VP of Operations
        </p>
      </div>

      <div style="text-align: center; margin: 32px 0;">
        <a href="https://ndn-analytics.web.app/case-studies" style="display: inline-block; background: #7C3AED; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Read More Case Studies →
        </a>
      </div>

      <p style="font-size: 14px; color: #94A3B8; text-align: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid #E2E8F0;">
        NDN Analytics | <a href="https://ndn-analytics.web.app" style="color: #7C3AED;">ndn-analytics.web.app</a>
      </p>
    </div>
  `,

  consultation_offer: (data) => `
    <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 24px; color: #1E293B;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #7C3AED; font-size: 24px; margin-bottom: 8px;">NDN Analytics</h1>
      </div>

      <h2 style="font-size: 22px; color: #0F172A; margin-bottom: 16px;">Ready to See It in Action?</h2>

      <p style="font-size: 16px; line-height: 1.7; color: #475569; margin-bottom: 20px;">
        Hi${data.name ? ` ${data.name}` : ''},
      </p>

      <p style="font-size: 16px; line-height: 1.7; color: #475569; margin-bottom: 20px;">
        We'd love to show you how NDN Analytics can work for your specific use case.
      </p>

      <p style="font-size: 16px; line-height: 1.7; color: #475569; margin-bottom: 24px;">
        In a 30-minute consultation, we'll:
      </p>

      <ul style="font-size: 15px; line-height: 1.8; color: #475569; margin-bottom: 24px; padding-left: 20px;">
        <li>Review your current challenges</li>
        <li>Show relevant product demos</li>
        <li>Provide a custom implementation roadmap</li>
        <li>Answer all your questions</li>
      </ul>

      <div style="text-align: center; margin: 32px 0;">
        <a href="https://calendly.com/ndnanalytics/demo" style="display: inline-block; background: #7C3AED; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Book Free Consultation →
        </a>
      </div>

      <p style="font-size: 15px; line-height: 1.7; color: #475569;">
        No pressure, no sales pitch — just a conversation about what's possible.
      </p>

      <p style="font-size: 14px; color: #94A3B8; text-align: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid #E2E8F0;">
        NDN Analytics | <a href="https://ndn-analytics.web.app" style="color: #7C3AED;">ndn-analytics.web.app</a>
      </p>
    </div>
  `,
};

// Send email via Resend API
export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!RESEND_API_KEY) {
    console.warn('Resend API key not configured');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        tags: payload.tags,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend API error:', error);
      return { success: false, error };
    }

    const data = await response.json();
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: String(error) };
  }
}

// Send templated email
export async function sendTemplatedEmail(
  to: string,
  templateId: keyof typeof EMAIL_TEMPLATES,
  data: Record<string, string> = {}
): Promise<{ success: boolean; id?: string; error?: string }> {
  const template = EMAIL_TEMPLATES[templateId];
  if (!template) {
    return { success: false, error: `Template ${templateId} not found` };
  }

  const subject = getSubjectForTemplate(templateId, data);
  const html = template(data);

  return sendEmail({
    to,
    subject,
    html,
    tags: [{ name: 'template', value: templateId }],
  });
}

function getSubjectForTemplate(templateId: string, data: Record<string, string>): string {
  const subjects: Record<string, string> = {
    welcome: 'Welcome to NDN Analytics!',
    download_delivery: `Your ${data.resourceName || 'Download'} is Ready`,
    case_study: 'How AI is Transforming Enterprise Operations',
    consultation_offer: 'Ready to See It in Action?',
    feedback_request: 'Quick question about your download',
    related_content: 'More resources you might find useful',
    demo_confirmation: 'Your Demo is Confirmed!',
    demo_prep: 'What to Prepare for Your Demo',
    demo_followup: 'Following Up on Your Demo',
    product_deep_dive: 'Your Industry-Specific AI Solution',
  };
  return subjects[templateId] || 'Message from NDN Analytics';
}

// Trigger email sequence for a lead
export async function triggerEmailSequence(
  email: string,
  sequenceId: keyof typeof EMAIL_SEQUENCES,
  data: Record<string, string> = {}
): Promise<void> {
  const sequence = EMAIL_SEQUENCES[sequenceId];
  if (!sequence) {
    console.error(`Sequence ${sequenceId} not found`);
    return;
  }

  // Send immediate email (delay 0)
  const immediateStep = sequence.steps.find(s => s.delayDays === 0);
  if (immediateStep) {
    await sendTemplatedEmail(email, immediateStep.templateId as keyof typeof EMAIL_TEMPLATES, data);
  }

  // Note: For delayed emails, you'd typically use:
  // 1. A backend job queue (Bull, Agenda, etc.)
  // 2. Resend's scheduled sends feature
  // 3. A serverless function triggered by a scheduler
  //
  // For now, we log the scheduled emails for backend implementation
  const delayedSteps = sequence.steps.filter(s => s.delayDays > 0);
  if (delayedSteps.length > 0) {
    console.log(`Scheduled ${delayedSteps.length} delayed emails for ${email}:`, delayedSteps);
    // TODO: Store in Firestore for backend worker to process
  }
}
