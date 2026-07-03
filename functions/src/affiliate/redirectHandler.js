// Affiliate redirect handler - HTTP Cloud Function
import { onRequest } from 'firebase-functions/v2/https';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { initializeApp, getApps } from 'firebase-admin/app';

// Initialize Firebase Admin if not already done
if (getApps().length === 0) {
  initializeApp();
}

const db = getFirestore();

/**
 * Build destination URL with UTM parameters
 */
function buildDestinationUrl(baseUrl, affiliateUrl, productId, utmParams) {
  const url = new URL(affiliateUrl || baseUrl);

  // Add UTM parameters
  url.searchParams.set('utm_source', utmParams.source || 'ndnanalytics');
  url.searchParams.set('utm_medium', utmParams.medium || 'affiliate');
  url.searchParams.set('utm_campaign', utmParams.campaign || 'aitools');
  url.searchParams.set('utm_content', productId);

  if (utmParams.term) {
    url.searchParams.set('utm_term', utmParams.term);
  }

  return url.toString();
}

/**
 * Extract session ID from request
 */
function getSessionId(req) {
  // Check for session ID in query params or cookies
  return req.query.sid || req.cookies?.ndn_session_id || `anon_${Date.now()}`;
}

/**
 * Affiliate redirect handler
 * GET /go/:productId?campaign=...&sid=...
 */
export const affiliateRedirect = onRequest(
  {
    cors: true,
    memory: '256MiB',
    timeoutSeconds: 30,
  },
  async (req, res) => {
    try {
      // Extract product ID from path
      const pathParts = req.path.split('/').filter(Boolean);
      const productId = pathParts[pathParts.length - 1];

      if (!productId || productId === 'go') {
        res.status(400).json({ error: 'Product ID required' });
        return;
      }

      // Look up product in Firestore
      const productDoc = await db.collection('aiProducts').doc(productId).get();

      if (!productDoc.exists) {
        console.warn(`Product not found: ${productId}`);
        res.redirect(302, 'https://ndnanalytics.com/ai-tools');
        return;
      }

      const product = productDoc.data();

      if (!product.isActive) {
        console.warn(`Product inactive: ${productId}`);
        res.redirect(302, 'https://ndnanalytics.com/ai-tools');
        return;
      }

      // Build UTM parameters
      const utmParams = {
        source: req.query.utm_source || 'ndnanalytics',
        medium: req.query.utm_medium || 'affiliate',
        campaign: req.query.campaign || req.query.utm_campaign || 'aitools',
        term: req.query.utm_term,
      };

      // Build destination URL
      const destinationUrl = buildDestinationUrl(
        product.websiteUrl,
        product.affiliateUrl,
        productId,
        utmParams
      );

      // Log the click
      const sessionId = getSessionId(req);
      const clickData = {
        productId,
        productName: product.name,
        clickedAt: FieldValue.serverTimestamp(),
        sessionId,
        leadId: req.query.leadId || null,
        referrerPath: req.query.ref || req.headers.referer || '/',
        utmParams,
        userAgent: req.headers['user-agent'] || 'unknown',
        destinationUrl,
      };

      // Write click asynchronously
      db.collection('affiliateClicks').add(clickData).catch(err => {
        console.error('Failed to log click:', err);
      });

      // Increment click count on product
      db.collection('aiProducts').doc(productId).update({
        clickCount: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp(),
      }).catch(err => {
        console.error('Failed to update click count:', err);
      });

      // Redirect to destination
      res.redirect(302, destinationUrl);

    } catch (error) {
      console.error('Affiliate redirect error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);
