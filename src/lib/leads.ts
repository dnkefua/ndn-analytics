// Lead CRUD operations for Firebase Firestore
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { db, isFirebaseEnabled } from './firebase';
import type { Lead, LeadSource, LeadStatus, EngagementType, Engagement } from '../types/leads';

const LEADS_COLLECTION = 'leads';
const ENGAGEMENTS_SUBCOLLECTION = 'engagements';

// Generate a session ID for anonymous tracking
export function getSessionId(): string {
  const key = 'ndn_session_id';
  let sessionId = sessionStorage.getItem(key);
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    sessionStorage.setItem(key, sessionId);
  }
  return sessionId;
}

// Check if email already exists as a lead
export async function findLeadByEmail(email: string): Promise<Lead | null> {
  if (!db) return null;

  const q = query(collection(db, LEADS_COLLECTION), where('email', '==', email.toLowerCase()));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as Lead;
}

// Create a new lead
export async function createLead(data: {
  email: string;
  name?: string;
  source: LeadSource;
  productInterests?: string[];
  tags?: string[];
}): Promise<Lead | null> {
  if (!db) return null;

  const email = data.email.toLowerCase().trim();

  // Check if lead exists
  const existing = await findLeadByEmail(email);
  if (existing) {
    // Update existing lead with new source if different
    await updateLead(existing.id, {
      productInterests: [...new Set([...existing.productInterests, ...(data.productInterests || [])])],
      tags: [...new Set([...existing.tags, ...(data.tags || [])])],
    });
    return existing;
  }

  const leadRef = doc(collection(db, LEADS_COLLECTION));
  const lead: Omit<Lead, 'id'> = {
    email,
    name: data.name,
    productInterests: data.productInterests || [],
    source: data.source,
    score: getInitialScore(data.source),
    status: 'new',
    tags: data.tags || [],
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
  };

  await setDoc(leadRef, lead);

  return { id: leadRef.id, ...lead };
}

// Update lead
export async function updateLead(
  leadId: string,
  data: Partial<Omit<Lead, 'id' | 'createdAt'>>
): Promise<void> {
  if (!db) return;

  const leadRef = doc(db, LEADS_COLLECTION, leadId);
  await updateDoc(leadRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Add engagement to lead
export async function addEngagement(
  leadId: string,
  type: EngagementType,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  if (!db) return;

  const engagementsRef = collection(db, LEADS_COLLECTION, leadId, ENGAGEMENTS_SUBCOLLECTION);
  await addDoc(engagementsRef, {
    type,
    timestamp: serverTimestamp(),
    metadata,
  });

  // Update lead score
  const leadRef = doc(db, LEADS_COLLECTION, leadId);
  const leadSnap = await getDoc(leadRef);
  if (leadSnap.exists()) {
    const lead = leadSnap.data() as Lead;
    const scoreIncrease = getEngagementScore(type);
    await updateDoc(leadRef, {
      score: lead.score + scoreIncrease,
      updatedAt: serverTimestamp(),
    });
  }
}

// Track anonymous engagement (before email capture)
export async function trackAnonymousEngagement(
  type: EngagementType,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  // Store in sessionStorage for later attribution
  const key = 'ndn_engagements';
  const existing = JSON.parse(sessionStorage.getItem(key) || '[]');
  existing.push({ type, metadata, timestamp: Date.now() });
  sessionStorage.setItem(key, JSON.stringify(existing));
}

// Attribute anonymous engagements to lead after email capture
export async function attributeAnonymousEngagements(leadId: string): Promise<void> {
  const key = 'ndn_engagements';
  const engagements = JSON.parse(sessionStorage.getItem(key) || '[]');

  for (const eng of engagements) {
    await addEngagement(leadId, eng.type, eng.metadata);
  }

  sessionStorage.removeItem(key);
}

// Get initial score based on source
function getInitialScore(source: LeadSource): number {
  const scores: Record<LeadSource, number> = {
    contact_form: 25,
    aria_chat: 20,
    content_upgrade: 15,
    newsletter_footer: 10,
    newsletter_blog: 10,
    exit_intent: 5,
    fine_tuning_teaser: 20,
  };
  return scores[source] || 5;
}

// Get score for engagement type
function getEngagementScore(type: EngagementType): number {
  const scores: Record<EngagementType, number> = {
    page_view: 1,
    blog_read: 2,
    product_view: 5,
    content_download: 8,
    aria_conversation: 3,
    form_submit: 10,
    cta_click: 3,
  };
  return scores[type] || 1;
}

// Check if Firebase is available (for graceful degradation)
export { isFirebaseEnabled };

// ─────────────────────────────────────────────────────────────────────────────
// Admin CRUD — requires authenticated user (firestore rules enforce auth)
// ─────────────────────────────────────────────────────────────────────────────

// Get all leads (admin)
export async function getAllLeads(): Promise<Lead[]> {
  if (!db) return [];
  const q = query(collection(db, LEADS_COLLECTION), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Lead);
}

// Update lead status (admin)
export async function updateLeadStatus(leadId: string, status: LeadStatus): Promise<void> {
  if (!db) return;
  const leadRef = doc(db, LEADS_COLLECTION, leadId);
  await updateDoc(leadRef, { status, updatedAt: serverTimestamp() });
}

// Delete lead (admin)
export async function deleteLead(leadId: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, LEADS_COLLECTION, leadId));
}

// Get engagements for a lead (admin)
export async function getLeadEngagements(leadId: string): Promise<Engagement[]> {
  if (!db) return [];
  const ref = collection(db, LEADS_COLLECTION, leadId, ENGAGEMENTS_SUBCOLLECTION);
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Engagement);
}
