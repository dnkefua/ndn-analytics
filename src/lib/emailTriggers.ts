// Email sequence triggers - connects lead capture to email automation
import { triggerEmailSequence } from './emailService';
import type { LeadSource } from '../types/leads';

// Map lead sources to email sequences
const SOURCE_TO_SEQUENCE: Record<LeadSource, string | null> = {
  contact_form: 'lead_nurture',
  aria_chat: 'lead_nurture',
  content_upgrade: 'content_upgrade',
  newsletter_footer: 'lead_nurture',
  newsletter_blog: 'lead_nurture',
  exit_intent: 'content_upgrade',
};

export async function triggerSequenceForLead(
  email: string,
  source: LeadSource,
  data: Record<string, string> = {}
): Promise<void> {
  const sequenceId = SOURCE_TO_SEQUENCE[source];

  if (!sequenceId) {
    console.log(`No email sequence configured for source: ${source}`);
    return;
  }

  try {
    await triggerEmailSequence(
      email,
      sequenceId as 'lead_nurture' | 'content_upgrade' | 'demo_followup',
      data
    );
    console.log(`Triggered ${sequenceId} sequence for ${email}`);
  } catch (error) {
    console.error('Failed to trigger email sequence:', error);
    // Don't throw - email failure shouldn't break lead capture
  }
}

// Send download delivery email with specific resource
export async function sendDownloadEmail(
  email: string,
  resourceName: string,
  downloadUrl: string
): Promise<void> {
  const { sendTemplatedEmail } = await import('./emailService');

  await sendTemplatedEmail(email, 'download_delivery', {
    resourceName,
    downloadUrl,
  });
}
