// Email queue processor — runs every hour, sends scheduled emails from Firestore
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { defineSecret } from 'firebase-functions/params';
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { initializeApp, getApps } from 'firebase-admin/app';

if (getApps().length === 0) {
  initializeApp();
}

const db = getFirestore();
const RESEND_API_KEY = defineSecret('RESEND_API_KEY');

const FROM_EMAIL = 'NDN Analytics <hello@ndnanalytics.com>';

// Minimal email templates for delayed sequence steps
const TEMPLATES = {
  welcome: (data) => ({
    subject: 'Welcome to NDN Analytics!',
    html: `<p>Welcome${data.name ? `, ${data.name}` : ''}! Thanks for joining NDN Analytics. We build AI products that predict outcomes and blockchain solutions that prove authenticity.</p><p><a href="https://ndn-analytics.web.app/products">Explore Our Products →</a></p>`,
  }),
  case_study: (data) => ({
    subject: 'How AI is Transforming Enterprise Operations',
    html: `<p>Hi${data.name ? ` ${data.name}` : ''},</p><p>Enterprises deploying AI in operations are seeing 15–40% efficiency gains. Here's how it works in practice.</p><p><a href="https://ndn-analytics.web.app/case-studies">Read Case Studies →</a></p>`,
  }),
  product_deep_dive: (data) => ({
    subject: 'Your Industry-Specific AI Solution',
    html: `<p>Hi${data.name ? ` ${data.name}` : ''},</p><p>Based on your interest, here's a closer look at the NDN Analytics product built for your industry.</p><p><a href="https://ndn-analytics.web.app/products">View All Products →</a></p>`,
  }),
  consultation_offer: (data) => ({
    subject: 'Ready to See It in Action?',
    html: `<p>Hi${data.name ? ` ${data.name}` : ''},</p><p>Our team can prepare a custom demo tailored to your business. Takes 30 minutes and you'll leave with a clear implementation path.</p><p><a href="https://ndn-analytics.web.app/contact?utm_source=email&utm_medium=sequence&utm_campaign=consultation">Book a Demo →</a></p>`,
  }),
  download_delivery: (data) => ({
    subject: `Your ${data.resourceName || 'Download'} is Ready`,
    html: `<p>Hi${data.name ? ` ${data.name}` : ''},</p><p>Your resource is ready to download:</p><p><a href="${data.downloadUrl || 'https://ndn-analytics.web.app/'}">Download Now →</a></p>`,
  }),
  feedback_request: (data) => ({
    subject: 'Did you find the guide helpful?',
    html: `<p>Hi${data.name ? ` ${data.name}` : ''},</p><p>We'd love to know if the resource we sent was useful. Reply to this email with any questions — or let us know if we can help further.</p><p><a href="https://ndn-analytics.web.app/contact">Contact Us →</a></p>`,
  }),
  related_content: (data) => ({
    subject: 'More resources you might find useful',
    html: `<p>Hi${data.name ? ` ${data.name}` : ''},</p><p>Based on what you downloaded, here are some related resources from our blog and product pages.</p><p><a href="https://ndn-analytics.web.app/blog">Read Our Blog →</a></p>`,
  }),
  demo_confirmation: (data) => ({
    subject: 'Your Demo is Confirmed!',
    html: `<p>Hi${data.name ? ` ${data.name}` : ''},</p><p>Your demo is confirmed. We're looking forward to showing you what NDN Analytics can do for your business.</p>`,
  }),
  demo_prep: (data) => ({
    subject: 'What to Prepare for Your Demo',
    html: `<p>Hi${data.name ? ` ${data.name}` : ''},</p><p>To make the most of your demo, it helps to have: a rough sense of your data sources, the core business problem you're trying to solve, and any current tools you're using.</p>`,
  }),
  demo_followup: (data) => ({
    subject: 'Following Up on Your Demo',
    html: `<p>Hi${data.name ? ` ${data.name}` : ''},</p><p>Thanks for your time during the demo. Happy to answer any questions or prepare a tailored proposal.</p><p><a href="https://ndn-analytics.web.app/contact">Get in Touch →</a></p>`,
  }),
};

/**
 * Send one email via Resend
 */
async function sendEmail(apiKey, { to, subject, html }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend API error ${response.status}: ${body}`);
  }

  return response.json();
}

/**
 * Process pending scheduled emails — runs every hour
 */
export const emailQueueProcessor = onSchedule(
  {
    schedule: 'every 60 minutes',
    timeZone: 'UTC',
    secrets: [RESEND_API_KEY],
    memory: '256MiB',
    timeoutSeconds: 120,
  },
  async () => {
    const apiKey = RESEND_API_KEY.value();
    if (!apiKey) {
      console.error('RESEND_API_KEY secret is not set');
      return;
    }

    const now = Timestamp.now();

    // Fetch up to 50 pending emails due for sending
    const snapshot = await db.collection('scheduledEmails')
      .where('status', '==', 'pending')
      .where('sendAt', '<=', now)
      .orderBy('sendAt', 'asc')
      .limit(50)
      .get();

    if (snapshot.empty) {
      console.log('No pending emails to process');
      return;
    }

    console.log(`Processing ${snapshot.size} scheduled emails`);

    const results = await Promise.allSettled(
      snapshot.docs.map(async (docSnap) => {
        const email = docSnap.data();
        const templateFn = TEMPLATES[email.templateId];

        if (!templateFn) {
          console.warn(`Unknown templateId: ${email.templateId}, skipping`);
          await docSnap.ref.update({ status: 'skipped', processedAt: FieldValue.serverTimestamp() });
          return;
        }

        const { subject, html } = templateFn(email.data || {});

        try {
          const result = await sendEmail(apiKey, { to: email.to, subject, html });

          await docSnap.ref.update({
            status: 'sent',
            sentAt: FieldValue.serverTimestamp(),
            resendId: result.id,
          });

          console.log(`Sent ${email.templateId} to ${email.to} (${result.id})`);
        } catch (err) {
          console.error(`Failed to send ${email.templateId} to ${email.to}:`, err.message);

          const retries = (email.retries || 0) + 1;

          await docSnap.ref.update({
            status: retries >= 3 ? 'failed' : 'pending',
            retries,
            lastError: err.message,
            // Back off: retry after 2h, 4h, then give up
            sendAt: retries < 3
              ? Timestamp.fromMillis(Date.now() + retries * 2 * 60 * 60 * 1000)
              : email.sendAt,
          });
        }
      })
    );

    const sent = results.filter(r => r.status === 'fulfilled').length;
    console.log(`Email queue run complete: ${sent}/${snapshot.size} processed`);
  }
);
