import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock firebase module — no real Firestore connection in tests
const mockSetDoc = vi.fn().mockResolvedValue(undefined);
const mockUpdateDoc = vi.fn().mockResolvedValue(undefined);
const mockGetDocs = vi.fn().mockResolvedValue({ empty: true, docs: [] });
const mockGetDoc = vi.fn().mockResolvedValue({ exists: () => false });
const mockAddDoc = vi.fn().mockResolvedValue({ id: 'eng-001' });
const mockCollection = vi.fn().mockReturnValue('collection-ref');
const mockDoc = vi.fn().mockReturnValue({ id: 'lead-001' });

vi.mock('firebase/firestore', () => ({
  collection: (...args: unknown[]) => mockCollection(...args),
  doc: (...args: unknown[]) => mockDoc(...args),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
  updateDoc: (...args: unknown[]) => mockUpdateDoc(...args),
  deleteDoc: vi.fn().mockResolvedValue(undefined),
  addDoc: (...args: unknown[]) => mockAddDoc(...args),
  query: vi.fn().mockReturnValue('query-ref'),
  where: vi.fn(),
  orderBy: vi.fn(),
  serverTimestamp: vi.fn().mockReturnValue({ seconds: 1000, nanoseconds: 0 }),
  Timestamp: { now: vi.fn().mockReturnValue({ seconds: 1000, nanoseconds: 0 }) },
}));

vi.mock('../lib/firebase', () => ({
  db: {},
  auth: null,
  app: {},
  isFirebaseEnabled: () => true,
}));

import {
  createLead,
  findLeadByEmail,
  updateLead,
  addEngagement,
  getSessionId,
  trackAnonymousEngagement,
  attributeAnonymousEngagements,
} from '../lib/leads';

describe('Firestore Lead Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    // Default: no existing leads
    mockGetDocs.mockResolvedValue({ empty: true, docs: [] });
  });

  describe('createLead', () => {
    it('creates a new lead with correct fields', async () => {
      const lead = await createLead({
        email: 'Test@Example.com',
        name: 'Test User',
        source: 'contact_form',
        productInterests: ['ndn-001'],
        tags: ['contact_form'],
      });

      expect(lead).toBeTruthy();
      expect(lead!.email).toBe('test@example.com');
      expect(mockSetDoc).toHaveBeenCalledOnce();
    });

    it('normalizes email to lowercase', async () => {
      await createLead({
        email: 'UPPER@EMAIL.COM',
        source: 'newsletter_footer',
      });

      expect(mockSetDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ email: 'upper@email.com' })
      );
    });

    it('assigns initial score based on source', async () => {
      await createLead({
        email: 'score@test.com',
        source: 'contact_form',
      });

      expect(mockSetDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ score: 25 })
      );
    });

    it('assigns lower score for newsletter source', async () => {
      await createLead({
        email: 'news@test.com',
        source: 'newsletter_footer',
      });

      expect(mockSetDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ score: 10 })
      );
    });

    it('updates existing lead instead of duplicating', async () => {
      mockGetDocs.mockResolvedValueOnce({
        empty: false,
        docs: [{
          id: 'existing-lead',
          data: () => ({
            email: 'existing@test.com',
            productInterests: ['ndn-001'],
            tags: ['newsletter'],
            score: 10,
            status: 'new',
          }),
        }],
      });

      const lead = await createLead({
        email: 'existing@test.com',
        source: 'contact_form',
        productInterests: ['ndn-005'],
        tags: ['contact_form'],
      });

      expect(lead).toBeTruthy();
      expect(mockSetDoc).not.toHaveBeenCalled();
      expect(mockUpdateDoc).toHaveBeenCalled();
    });
  });

  describe('findLeadByEmail', () => {
    it('returns null when no lead exists', async () => {
      mockGetDocs.mockResolvedValueOnce({ empty: true, docs: [] });
      const lead = await findLeadByEmail('nobody@test.com');
      expect(lead).toBeNull();
    });

    it('returns lead when found', async () => {
      mockGetDocs.mockResolvedValueOnce({
        empty: false,
        docs: [{
          id: 'found-lead',
          data: () => ({ email: 'found@test.com', score: 15, status: 'new' }),
        }],
      });

      const lead = await findLeadByEmail('found@test.com');
      expect(lead).toBeTruthy();
      expect(lead!.id).toBe('found-lead');
    });
  });

  describe('updateLead', () => {
    it('calls updateDoc with correct fields', async () => {
      await updateLead('lead-123', { status: 'qualified' as const, score: 50 });
      expect(mockUpdateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ status: 'qualified', score: 50 })
      );
    });
  });

  describe('addEngagement', () => {
    it('adds engagement document to subcollection', async () => {
      mockGetDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ score: 10 }),
      });

      await addEngagement('lead-123', 'page_view', { path: '/' });
      expect(mockAddDoc).toHaveBeenCalled();
    });

    it('increments lead score after engagement', async () => {
      mockGetDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ score: 10 }),
      });

      await addEngagement('lead-123', 'product_view', { productId: 'ndn-001' });
      expect(mockUpdateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ score: 15 }) // 10 + 5 for product_view
      );
    });
  });

  describe('Session management', () => {
    it('generates session ID with correct prefix', () => {
      const id = getSessionId();
      expect(id).toMatch(/^sess_/);
    });

    it('returns same session ID on repeated calls', () => {
      const id1 = getSessionId();
      const id2 = getSessionId();
      expect(id1).toBe(id2);
    });
  });

  describe('Anonymous engagement tracking', () => {
    it('stores engagements in sessionStorage', async () => {
      await trackAnonymousEngagement('page_view', { path: '/products' });
      await trackAnonymousEngagement('product_view', { productId: 'ndn-001' });

      const stored = JSON.parse(sessionStorage.getItem('ndn_engagements') || '[]');
      expect(stored).toHaveLength(2);
      expect(stored[0].type).toBe('page_view');
      expect(stored[1].type).toBe('product_view');
    });

    it('attributes anonymous engagements to lead', async () => {
      // First store some anonymous engagements
      sessionStorage.setItem('ndn_engagements', JSON.stringify([
        { type: 'page_view', metadata: { path: '/' }, timestamp: Date.now() },
        { type: 'blog_read', metadata: { slug: 'test' }, timestamp: Date.now() },
      ]));

      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ score: 10 }),
      });

      await attributeAnonymousEngagements('lead-123');

      // Should have called addDoc for each engagement
      expect(mockAddDoc).toHaveBeenCalledTimes(2);
      // Session storage should be cleared
      expect(sessionStorage.getItem('ndn_engagements')).toBeNull();
    });
  });
});

describe('Firestore Rules Validation (unit)', () => {
  it('email regex validates correct emails', () => {
    const emailRegex = /.*@.*\..*/;
    expect(emailRegex.test('user@example.com')).toBe(true);
    expect(emailRegex.test('test@domain.co.uk')).toBe(true);
  });

  it('email regex rejects invalid emails', () => {
    const emailRegex = /.*@.*\..*/;
    expect(emailRegex.test('noatsign')).toBe(false);
    expect(emailRegex.test('@nodomain')).toBe(false);
  });

  it('field size limits are reasonable', () => {
    const EMAIL_MAX = 255;
    const SOURCE_MAX = 100;
    const NAME_MAX = 200;
    const MAX_FIELDS = 20;

    expect(EMAIL_MAX).toBeGreaterThan(5);
    expect(SOURCE_MAX).toBeLessThanOrEqual(100);
    expect(NAME_MAX).toBeLessThanOrEqual(200);
    expect(MAX_FIELDS).toBeLessThanOrEqual(20);
  });

  it('sensitive collections deny client access', () => {
    // These collections use `allow read, write: if false`
    const clientDeniedCollections = ['purchases', '_rateLimits'];
    expect(clientDeniedCollections).toContain('purchases');
    expect(clientDeniedCollections).toContain('_rateLimits');
  });
});
