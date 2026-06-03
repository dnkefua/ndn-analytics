# Google Deployment Checklist

This project is prepared for deployment through Firebase / Google Cloud using:

- Firebase Hosting for the public app and CDN
- Cloud Functions for SSR and API endpoints
- Firestore rules and indexes
- Cloud Storage rules
- PWA metadata for app-style installation

## 1. Google Cloud / Firebase Console

1. Open Firebase Console and select the `ndn-analytics` project.
2. Confirm the web app exists under Project settings > General > Your apps.
3. Enable these products:
   - Hosting
   - Functions
   - Firestore
   - Storage
   - Authentication, if admin login is used
4. Confirm billing is enabled for Cloud Functions.

## 2. Local CLI Setup

```bash
npm install
cd functions && npm install && cd ..
firebase login
firebase use ndn-analytics
```

## 3. Environment Variables

Copy `.env.example` to `.env` and fill only public browser-safe values.

Server secrets must be set in Firebase Secret Manager:

```bash
firebase functions:secrets:set ANTHROPIC_API_KEY
firebase functions:secrets:set RESEND_API_KEY
firebase functions:secrets:set STRIPE_SECRET_KEY
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
```

## 4. Build And Verify

```bash
npm run lint
npm run test:run
npm run build:ssr
```

## 5. Deploy

```bash
npm run deploy
```

Deploy only rules:

```bash
npm run deploy:rules
```

Deploy only hosting or functions:

```bash
npm run deploy:hosting
npm run deploy:functions
```

## 6. Post-Deploy Checks

Check these URLs after deployment:

- `https://www.ndnanalytics.com/`
- `https://www.ndnanalytics.com/_health`
- `https://www.ndnanalytics.com/site.webmanifest`
- `https://www.ndnanalytics.com/sw.js`
- `https://www.ndnanalytics.com/robots.txt`
- `https://www.ndnanalytics.com/sitemap.xml`
- `https://www.ndnanalytics.com/feed.xml`
- `https://www.ndnanalytics.com/llms.txt`

## 7. Google Play Console / App Distribution Notes

The web app is PWA-ready. To publish it in Google Play Console as an Android app, wrap the live site as a Trusted Web Activity using Bubblewrap after the site is deployed.

You will need:

- Android package name, for example `com.ndnanalytics.app`
- App signing SHA-256 fingerprint from Play Console
- A deployed `/.well-known/assetlinks.json` generated with that fingerprint
- 512x512 app icon
- Feature graphic, screenshots, privacy policy URL, and app category metadata

Do not deploy a placeholder `assetlinks.json`; Google Play verification requires the real SHA-256 fingerprint.
