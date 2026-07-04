import { Lesson } from '../../types/academy';

// Course 1: NDN-FB-401 — Firebase & GCP Full-Stack App Development
// 7 modules × 3 lessons (reading / video / lab)

export const FIREBASE_LESSONS: Lesson[] = [
  // ─────────────────────────────────────────────────────────
  // MODULE 1 — Firebase Foundations & Architecture
  // ─────────────────────────────────────────────────────────
  {
    id: "les-fb-1-1",
    courseId: "course-firebase-gcp",
    moduleId: "mod-fb-1",
    order: 1,
    type: "reading",
    title: "Lesson 1.1: Firebase Project Setup & SDK Initialization",
    summary: "Configure Firebase project credentials, environment variables, and client SDK initialization in a TypeScript Vite application.",
    durationMinutes: 25,
    videoPoster: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    readingMarkdown: `
# Firebase Project Setup & SDK Initialization

Google Firebase provides a unified suite of cloud services for mobile and web development — authentication, a real-time NoSQL database, serverless compute, storage, and hosting — all backed by Google Cloud Platform. In this lesson we initialize Firebase SDK v12 inside a TypeScript + Vite application the way production teams do it.

@video[Official Firebase walkthrough — "Getting started with Firebase for the web"](https://www.youtube.com/embed/rQvOAnNvcNQ)

## 1. Create the Firebase Project

The complete setup path lives in the official [Firebase Web setup guide](https://firebase.google.com/docs/web/setup). It is organized as four short steps — create the project, install the SDK, access services, and (optionally) add a bundler:

![The official Firebase "Add Firebase to your JavaScript project" guide, showing the four setup steps and the embedded getting-started video.](/lesson-assets/firebase/setup-overview.jpg "Firebase's official setup guide — the exact path we follow in this lesson (captured from firebase.google.com/docs/web/setup).")

1. Open the [Firebase Console](https://console.firebase.google.com) and click **Add project**.
2. Name it (e.g. \`ndn-analytics-academy\`). The project ID becomes your global namespace — it cannot be changed later.
3. Decide on Google Analytics. For production apps, enable it; you can wire BigQuery export later.
4. Under **Project settings → Your apps**, register a *Web app*. Firebase generates the client configuration object you will consume via environment variables.

Here is that documentation flowing through the create-project and install steps, so you know exactly what to expect before you start:

![Scroll-through recording of the official Firebase setup documentation covering project creation, SDK installation, and initialization.](/lesson-assets/firebase/firebase-setup-walkthrough.gif "Captured walkthrough of the official Firebase setup guide, Step 1 through Step 3.")

> A Firebase project **is** a Google Cloud project. Everything you create here — Firestore, Functions, Storage buckets — appears in the GCP Console under the same project ID.

## 2. Store Credentials in Environment Variables

Never hard-code configuration into source files. Create a \`.env\` file (and add it to \`.gitignore\`):

\`\`\`bash
VITE_FIREBASE_API_KEY=AIzaSyA_ExampleKeyHere
VITE_FIREBASE_AUTH_DOMAIN=ndn-analytics-academy.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ndn-analytics-academy
VITE_FIREBASE_STORAGE_BUCKET=ndn-analytics-academy.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
\`\`\`

The Firebase web API key is *not* a secret — it identifies your project, and access is enforced by Security Rules — but treating it as configuration keeps environments (dev/staging/prod) cleanly separated.

## 3. Install the SDK

Firebase's modular SDK installs from npm and is designed for bundlers (tree-shaking keeps your build small):

![Step 2 of the official guide: install the Firebase SDK from npm.](/lesson-assets/firebase/install-sdk.jpg "The install step from the official docs — a single 'npm install firebase' command.")

\`\`\`bash
npm install firebase
\`\`\`

## 4. Initialize the SDK with a Singleton

The official docs show the minimal initialization — you pass your config object into \`initializeApp\`:

![The official docs' initialization snippet: importing initializeApp and passing the firebaseConfig object.](/lesson-assets/firebase/init-config.jpg "The canonical initializeApp snippet from Firebase's documentation.")

Our production version of \`src/lib/firebase.ts\` adds the singleton guard and typed service exports:

\`\`\`typescript
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Singleton pattern: re-use the app across hot reloads and re-renders
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
\`\`\`

Why the singleton? Vite hot-module-replacement and React StrictMode both re-execute module code. Calling \`initializeApp\` twice with the same name throws \`app/duplicate-app\`. Guarding with \`getApps()\` makes initialization idempotent.

Once the app is initialized, you access each product (Auth, Firestore, Storage…) through its own getter — exactly as the official guide's "Access Firebase in your app" step describes:

![Step 3 of the official guide: access Firebase products such as Authentication and Firestore in your app.](/lesson-assets/firebase/access-services.jpg "Accessing Firebase services after initialization, per the official documentation.")

## 5. Verify the Connection

\`\`\`typescript
import { collection, getDocs } from "firebase/firestore";
import { db } from "./lib/firebase";

const snapshot = await getDocs(collection(db, "healthcheck"));
console.log("Firestore reachable — docs:", snapshot.size);
\`\`\`

If this resolves without a permissions error (default rules deny everything — that is expected and healthy), your pipeline is live.
`,
    terminalLanguage: "typescript",
    starterCode: `import { initializeApp, getApps, getApp } from 'firebase/app';\nimport { getFirestore } from 'firebase/firestore';\n\nconst firebaseConfig = {\n  projectId: "ndn-analytics-academy"\n};\n\nconst app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);\nexport const db = getFirestore(app);\nconsole.log("Firebase App Initialized Successfully!");`,
    expectedOutput: "Firebase App Initialized Successfully!",
    notes: {
      coreConcepts: "A Firebase project is a full GCP project. Client SDK config is environment configuration, not a secret — security is enforced by rules. Singleton initialization makes module re-execution safe.",
      proTip: "Restrict your web API key to your production HTTP referrers in GCP Console → Credentials before launch, and keep a separate Firebase project for dev/staging.",
      keyTerms: [
        { term: "Singleton Pattern", definition: "A design pattern that restricts instantiation to one shared object — here, one FirebaseApp per runtime." },
        { term: "Firebase SDK v12", definition: "The modular, tree-shakeable JavaScript client library for Firebase services." },
        { term: "Environment Variable", definition: "Configuration injected at build/run time (via import.meta.env in Vite) instead of hard-coded values." }
      ]
    },
    resources: [
      { name: "Firebase Web SDK Setup", url: "https://firebase.google.com/docs/web/setup", type: "docs" },
      { name: "Vite Env Variables Guide", url: "https://vitejs.dev/guide/env-and-mode", type: "docs" },
      { name: "Is the Firebase API key a secret?", url: "https://firebase.google.com/docs/projects/api-keys", type: "article" }
    ]
  },
  {
    id: "les-fb-1-2",
    courseId: "course-firebase-gcp",
    moduleId: "mod-fb-1",
    order: 2,
    type: "video",
    title: "Lesson 1.2: Video — Getting Started with Firebase on the Web",
    summary: "Official Firebase walkthrough of setting up a web project, plus GCP Console navigation and billing guardrails.",
    durationMinutes: 18,
    videoUrl: "https://www.youtube.com/embed/ILTo8IvFXJw",
    videoPoster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    readingMarkdown: `
# Video Briefing

This official Firebase video walks through creating a project and connecting a web app end-to-end.

**Watch for:**
- How the Firebase Console and the GCP Console expose the *same* project from two angles.
- Where the web app config object lives (Project settings → Your apps) and how it maps to your \`.env\`.
- The Spark (free) vs Blaze (pay-as-you-go) plan differences — Cloud Functions and App Hosting require Blaze.

**After watching**, open [console.cloud.google.com](https://console.cloud.google.com), select the same project, and find: Firestore, IAM & Admin, and Billing. Set a **budget alert at $10/month** — this is the single most valuable habit for learners on Blaze.
`,
    notes: {
      coreConcepts: "Firebase and GCP consoles are two lenses on one project. Billing plans gate which services are available; budget alerts are your safety net.",
      proTip: "Bookmark the GCP 'Billing → Budgets & alerts' page and create a $10 alert on day one — cost surprises kill side projects.",
      keyTerms: [
        { term: "GCP Resource Hierarchy", definition: "Organization → Folder → Project → Resource; permissions and billing flow down this tree." },
        { term: "Blaze Plan", definition: "Firebase's pay-as-you-go billing plan, required for Cloud Functions, App Hosting, and outbound networking." }
      ]
    },
    resources: [
      { name: "Firebase Pricing Plans", url: "https://firebase.google.com/pricing", type: "docs" },
      { name: "GCP Console", url: "https://console.cloud.google.com", type: "docs" }
    ]
  },
  {
    id: "les-fb-1-3",
    courseId: "course-firebase-gcp",
    moduleId: "mod-fb-1",
    order: 3,
    type: "lab",
    title: "Lesson 1.3: Practical Lab — Firebase SDK Integration & Health Check",
    summary: "Hands-on: wire your local environment to a real Firebase project and prove connectivity with a health-check script.",
    durationMinutes: 40,
    readingMarkdown: `
# Practical Lab

Time to build. In this graded lab you will configure environment variables, implement the singleton initialization module, and run a health-check script that proves your app can reach Firestore.

Complete the lab in the **Lab Studio** panel below. Submit your code, repo URL, and a short reflection for rubric grading.
`,
    notes: {
      coreConcepts: "Verifying connectivity before building UI prevents silent API failures downstream. A health check isolates configuration errors from application bugs.",
      proTip: "If initialization fails with 'invalid-api-key', log import.meta.env first — nine times out of ten the .env file isn't being loaded (wrong filename or missing VITE_ prefix).",
      keyTerms: [
        { term: "Health Check", definition: "A minimal diagnostic call that verifies an external dependency is reachable and correctly configured." }
      ]
    },
    resources: [
      { name: "Firebase CLI Reference", url: "https://firebase.google.com/docs/cli", type: "docs" }
    ]
  },

  // ─────────────────────────────────────────────────────────
  // MODULE 2 — Firebase Authentication & Security
  // ─────────────────────────────────────────────────────────
  {
    id: "les-fb-2-1",
    courseId: "course-firebase-gcp",
    moduleId: "mod-fb-2",
    order: 1,
    type: "reading",
    title: "Lesson 2.1: Firebase Authentication, JWTs & Custom Claims",
    summary: "Implement email/password and Google OAuth sign-in, understand the ID token lifecycle, and attach role claims for RBAC.",
    durationMinutes: 30,
    readingMarkdown: `
# Firebase Authentication, JWTs & Custom Claims

Firebase Authentication issues **JSON Web Tokens (JWTs)** that identify your users to Firestore, Storage, Functions, and your own APIs. Understanding the token lifecycle is the foundation of every security decision you will make in this course.

## 1. Sign-In Flows

\`\`\`typescript
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  GoogleAuthProvider, signInWithPopup, onAuthStateChanged
} from "firebase/auth";

const auth = getAuth();

// Email/password registration
await createUserWithEmailAndPassword(auth, "student@ndn.dev", "S3curePassw0rd!");

// Google OAuth popup
await signInWithPopup(auth, new GoogleAuthProvider());

// The one listener every app needs — fires on login, logout, and token restore
onAuthStateChanged(auth, (user) => {
  console.log(user ? \`Signed in as \${user.uid}\` : "Signed out");
});
\`\`\`

\`onAuthStateChanged\` is the source of truth. Never gate UI on a one-time check — session restoration is asynchronous.

## 2. Anatomy of the ID Token

Every signed-in user carries an ID token (a JWT) with three parts: header, payload, signature. The payload includes \`uid\`, \`email\`, expiry (\`exp\`, one hour), and any **custom claims** you attach. Firestore Security Rules read this token as \`request.auth\`.

## 3. Custom Claims for Role-Based Access Control

Roles like \`INSTRUCTOR\` or \`admin\` must be set **server-side** with the Admin SDK — never from the client:

\`\`\`typescript
import * as admin from "firebase-admin";

export async function grantInstructor(uid: string) {
  await admin.auth().setCustomUserClaims(uid, { academyRole: "INSTRUCTOR" });
}
\`\`\`

Claims are baked into the *next* token that gets minted. The client must force a refresh to pick them up:

\`\`\`typescript
await auth.currentUser?.getIdToken(true); // true = force refresh
\`\`\`

## 4. Verifying Tokens on Your Backend

Any Express/Cloud Run API you build must verify tokens before trusting them:

\`\`\`typescript
const decoded = await admin.auth().verifyIdToken(bearerToken);
if (decoded.academyRole !== "INSTRUCTOR") throw new Error("Forbidden");
\`\`\`

This is the zero-trust posture: the client asserts nothing; the server verifies everything.
`,
    terminalLanguage: "typescript",
    starterCode: `import { getAuth, onAuthStateChanged } from 'firebase/auth';\n\nconst auth = getAuth();\nonAuthStateChanged(auth, (user) => {\n  console.log(user ? "User authenticated: " + user.email : "Signed out");\n});`,
    expectedOutput: "User authenticated: user@ndnanalytics.com",
    notes: {
      coreConcepts: "Custom claims live inside the user's ID token, so permission checks cost zero database reads. Tokens expire hourly and refresh automatically; claims apply on the next mint.",
      proTip: "After setting custom claims server-side, call getIdToken(true) on the client — otherwise the user won't see their new role for up to an hour.",
      keyTerms: [
        { term: "JWT (JSON Web Token)", definition: "A signed, base64-encoded token carrying user identity and claims, verifiable without a database lookup." },
        { term: "Custom Claims", definition: "Key/value attributes attached to a Firebase user's token by the Admin SDK, used for roles and entitlements." },
        { term: "onAuthStateChanged", definition: "The auth observer that fires whenever the user's sign-in state changes, including silent session restoration." }
      ]
    },
    resources: [
      { name: "Firebase Auth Documentation", url: "https://firebase.google.com/docs/auth", type: "docs" },
      { name: "Control Access with Custom Claims", url: "https://firebase.google.com/docs/auth/admin/custom-claims", type: "docs" },
      { name: "Verify ID Tokens (Admin SDK)", url: "https://firebase.google.com/docs/auth/admin/verify-id-tokens", type: "docs" }
    ]
  },
  {
    id: "les-fb-2-2",
    courseId: "course-firebase-gcp",
    moduleId: "mod-fb-2",
    order: 2,
    type: "video",
    title: "Lesson 2.2: Video — Firebase Authentication on the Web",
    summary: "Official walkthrough of implementing Firebase Authentication in a web app, from provider setup to session handling.",
    durationMinutes: 16,
    videoUrl: "https://www.youtube.com/embed/rbuSx1yEgV8",
    videoPoster: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    readingMarkdown: `
# Video Briefing

The official Firebase team demonstrates wiring authentication into a web application.

**Watch for:**
- Enabling providers in the Console (Email/Password, Google) before writing any code.
- How the SDK persists sessions in IndexedDB and restores them on reload.
- Error handling patterns for common codes: \`auth/email-already-in-use\`, \`auth/wrong-password\`, \`auth/popup-blocked\`.

**Challenge:** after the video, add a sign-out button to any test page and confirm \`onAuthStateChanged\` fires with \`null\`.
`,
    notes: {
      coreConcepts: "Providers must be explicitly enabled in the Console. Session persistence is automatic; your job is to react to auth state, not manage it.",
      proTip: "Use signInWithPopup during development but consider signInWithRedirect for mobile web — popups are frequently blocked in embedded browsers.",
      keyTerms: [
        { term: "Auth Provider", definition: "An identity source (Google, email/password, Apple, etc.) enabled per-project in the Firebase Console." }
      ]
    },
    resources: [
      { name: "Password Auth on Web", url: "https://firebase.google.com/docs/auth/web/password-auth", type: "docs" },
      { name: "Google Sign-In on Web", url: "https://firebase.google.com/docs/auth/web/google-signin", type: "docs" }
    ]
  },
  {
    id: "les-fb-2-3",
    courseId: "course-firebase-gcp",
    moduleId: "mod-fb-2",
    order: 3,
    type: "lab",
    title: "Lesson 2.3: Practical Lab — Auth Flow with Role Claims",
    summary: "Build a complete sign-up/sign-in flow and a server-side script that grants an INSTRUCTOR custom claim.",
    durationMinutes: 45,
    readingMarkdown: `
# Practical Lab

Implement a working authentication flow: registration, login, logout, an auth-state listener, and an Admin SDK script that grants a role claim. You will prove the claim landed by decoding the refreshed token.

Complete the lab in the **Lab Studio** panel below and submit your evidence for grading.
`,
    notes: {
      coreConcepts: "The full auth loop — client sign-in, server claim grant, client token refresh — is the pattern behind every role-gated feature you will ever ship.",
      proTip: "Decode any JWT at jwt.io during debugging (it's just base64) — but never paste production user tokens into third-party sites.",
      keyTerms: [
        { term: "Token Refresh", definition: "Re-minting the ID token (getIdToken(true)) so newly granted claims become visible to rules and APIs." }
      ]
    },
    resources: [
      { name: "Admin SDK Setup", url: "https://firebase.google.com/docs/admin/setup", type: "docs" }
    ]
  },

  // ─────────────────────────────────────────────────────────
  // MODULE 3 — Cloud Firestore Database Architecture
  // ─────────────────────────────────────────────────────────
  {
    id: "les-fb-3-1",
    courseId: "course-firebase-gcp",
    moduleId: "mod-fb-3",
    order: 1,
    type: "reading",
    title: "Lesson 3.1: Firestore Data Modeling — Collections, Documents & Indexes",
    summary: "Design document-oriented schemas, choose between subcollections and root collections, and master compound indexes and pagination.",
    durationMinutes: 30,
    readingMarkdown: `
# Firestore Data Modeling — Collections, Documents & Indexes

Firestore is a **document database**: data lives in documents (max 1 MiB) grouped into collections. There are no joins — your schema is shaped by your *queries*, not by normalization theory.

## 1. Model Around Read Patterns

For a learning platform:

\`\`\`text
users/{userId}                      → profile, role
courses/{courseId}                  → catalog metadata
courses/{courseId}/modules/{modId}  → subcollection: syllabus structure
enrollments/{enrollmentId}          → root collection: userId + courseId + progress
\`\`\`

Rules of thumb:
- **Subcollections** when children are always fetched *through* the parent (modules of a course).
- **Root collections** when you query across parents (all enrollments for a user, regardless of course).
- **Duplicate data deliberately** (e.g. store courseTitle inside the enrollment) to avoid N+1 reads. Storage is cheap; reads are the billing unit.

## 2. Querying

\`\`\`typescript
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

const topEnrollments = query(
  collection(db, "enrollments"),
  where("status", "==", "PASSED"),
  orderBy("score", "desc"),
  limit(5)
);
const snap = await getDocs(topEnrollments);
\`\`\`

Combining an equality filter with an \`orderBy\` on a *different* field requires a **compound index**. Firestore fails fast with an error containing a console link that creates the exact index — click it, wait for the build, re-run.

Declare indexes in \`firestore.indexes.json\` and deploy them with the CLI so environments stay reproducible:

\`\`\`json
{ "indexes": [{
  "collectionGroup": "enrollments",
  "fields": [
    { "fieldPath": "status", "order": "ASCENDING" },
    { "fieldPath": "score", "order": "DESCENDING" }
  ]}]
}
\`\`\`

## 3. Pagination with Cursors

Never use offset-based pagination (you pay for skipped docs). Use cursors:

\`\`\`typescript
import { startAfter } from "firebase/firestore";
const lastDoc = snap.docs[snap.docs.length - 1];
const nextPage = query(
  collection(db, "enrollments"),
  orderBy("score", "desc"),
  startAfter(lastDoc),
  limit(5)
);
\`\`\`

## 4. Real-Time Listeners

\`\`\`typescript
import { onSnapshot } from "firebase/firestore";
const unsubscribe = onSnapshot(topEnrollments, (snap) => {
  snap.docChanges().forEach(c => console.log(c.type, c.doc.id));
});
// Always clean up: unsubscribe() on unmount
\`\`\`

Listeners deliver local writes instantly (latency compensation) and reconcile with the server — this is what makes Firestore apps feel real-time.
`,
    terminalLanguage: "typescript",
    starterCode: `import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';\n\n// Build the top-5 passed enrollments query\nconsole.log("Query built: enrollments where status == PASSED order by score desc limit 5");`,
    expectedOutput: "Query built: enrollments where status == PASSED order by score desc limit 5",
    notes: {
      coreConcepts: "Schema follows queries in Firestore. Reads are the billing unit — denormalize to keep each screen at one query. Compound queries need declared indexes; pagination uses cursors, never offsets.",
      proTip: "Commit firestore.indexes.json to git and deploy with 'firebase deploy --only firestore:indexes' — index drift between dev and prod is a classic outage cause.",
      keyTerms: [
        { term: "Compound Index", definition: "A multi-field index required when combining equality filters with range/sort on different fields." },
        { term: "Denormalization", definition: "Deliberately duplicating data across documents to serve a screen with a single query." },
        { term: "Cursor Pagination", definition: "Paging with startAfter(lastDoc) so you only pay for documents actually returned." }
      ]
    },
    resources: [
      { name: "Firestore Data Model", url: "https://firebase.google.com/docs/firestore/data-model", type: "docs" },
      { name: "Index Types & Management", url: "https://firebase.google.com/docs/firestore/query-data/indexing", type: "docs" },
      { name: "Paginate Data with Cursors", url: "https://firebase.google.com/docs/firestore/query-data/query-cursors", type: "docs" }
    ]
  },
  {
    id: "les-fb-3-2",
    courseId: "course-firebase-gcp",
    moduleId: "mod-fb-3",
    order: 2,
    type: "video",
    title: "Lesson 3.2: Video — Getting Started with Cloud Firestore on the Web",
    summary: "Official Firecast covering Firestore fundamentals: documents, collections, reads, writes, and real-time listeners.",
    durationMinutes: 15,
    videoUrl: "https://www.youtube.com/embed/2Vf1D-rUMwE",
    videoPoster: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80",
    readingMarkdown: `
# Video Briefing

This official Firecast introduces Cloud Firestore in a web app — the mental model of documents/collections and the read/write/listen API surface.

**Watch for:**
- The difference between \`getDocs\` (one-time) and \`onSnapshot\` (real-time listener).
- How \`set\`, \`update\`, and \`add\` differ — and when a write creates vs. merges.
- Latency compensation: the UI updates *before* the server confirms.

**Challenge:** sketch the collections for an app you know well (e.g. a food-delivery app) and mark which ones are subcollections and why.
`,
    notes: {
      coreConcepts: "One-time reads and live listeners share the same query API. Local writes render optimistically, then reconcile with the server.",
      proTip: "In React, wrap onSnapshot in useEffect and return the unsubscribe function — leaked listeners are the most common Firestore memory bug.",
      keyTerms: [
        { term: "onSnapshot", definition: "Attaches a real-time listener that fires on initial data and on every subsequent change." }
      ]
    },
    resources: [
      { name: "Get Realtime Updates", url: "https://firebase.google.com/docs/firestore/query-data/listen", type: "docs" }
    ]
  },
  {
    id: "les-fb-3-3",
    courseId: "course-firebase-gcp",
    moduleId: "mod-fb-3",
    order: 3,
    type: "lab",
    title: "Lesson 3.3: Practical Lab — Schema Design & Paginated Queries",
    summary: "Model an enrollments schema, declare its compound index, and implement cursor pagination with a live listener.",
    durationMinutes: 50,
    readingMarkdown: `
# Practical Lab

Design and implement the data layer for a course-enrollment feature: schema, seed script, a compound-indexed query, cursor pagination, and a real-time listener that logs document changes.

Complete the lab in the **Lab Studio** panel below and submit for rubric evaluation.
`,
    notes: {
      coreConcepts: "A schema is only proven when its queries run without errors and without table scans — this lab makes you close that loop.",
      proTip: "Seed with at least 25 docs so pagination actually has pages — testing pagination with 3 documents proves nothing.",
      keyTerms: [
        { term: "Seed Script", definition: "A repeatable script that populates a database with realistic test data." }
      ]
    },
    resources: [
      { name: "Firestore Best Practices", url: "https://firebase.google.com/docs/firestore/best-practices", type: "docs" }
    ]
  },

  // ─────────────────────────────────────────────────────────
  // MODULE 4 — Zero-Trust Firestore Security Rules
  // ─────────────────────────────────────────────────────────
  {
    id: "les-fb-4-1",
    courseId: "course-firebase-gcp",
    moduleId: "mod-fb-4",
    order: 1,
    type: "reading",
    title: "Lesson 4.1: Writing Zero-Trust Security Rules with RBAC & Schema Validation",
    summary: "Author Firestore Security Rules that enforce ownership, role-based access, and document schema validation — then test them with the emulator.",
    durationMinutes: 35,
    readingMarkdown: `
# Zero-Trust Firestore Security Rules

Your Firestore database is directly reachable from any browser with your project ID. **Security Rules are your only server** between an attacker and your data. The zero-trust principle: deny everything, then allow specific, verified operations.

## 1. Structure of a Ruleset

\`\`\`text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // matches go here
  }
}
\`\`\`

Rules do not cascade *permissions* — but a broad \`allow read, write: if true\` anywhere is a total breach. Start from implicit deny.

## 2. Ownership & Role-Based Access

\`\`\`text
function isSignedIn() { return request.auth != null; }
function isOwner(userId) { return isSignedIn() && request.auth.uid == userId; }
function hasRole(r) { return isSignedIn() && request.auth.token.academyRole == r; }

match /users/{userId} {
  allow read: if isOwner(userId) || hasRole('INSTRUCTOR');
  allow create, update: if isOwner(userId);
  allow delete: if false; // nobody deletes profiles from the client
}

match /certificates/{certId} {
  allow read: if true;                    // public verification
  allow write: if hasRole('INSTRUCTOR');  // only staff issue certs
}
\`\`\`

\`request.auth.token\` exposes the JWT payload — including the custom claims you set in Module 2. This is RBAC with zero extra reads.

## 3. Schema Validation in Rules

Rules can validate the *shape* of writes:

\`\`\`text
match /enrollments/{id} {
  allow create: if isSignedIn()
    && request.resource.data.userId == request.auth.uid
    && request.resource.data.keys().hasAll(['userId', 'courseId', 'status'])
    && request.resource.data.status in ['ACTIVE', 'PASSED', 'WITHDRAWN']
    && request.resource.data.score is int
    && request.resource.data.score >= 0 && request.resource.data.score <= 100;
}
\`\`\`

\`request.resource.data\` is the incoming document; \`resource.data\` is the existing one. Comparing them lets you make fields immutable:

\`\`\`text
allow update: if request.resource.data.userId == resource.data.userId; // can't reassign ownership
\`\`\`

## 4. Test with the Emulator — Before You Deploy

\`\`\`bash
firebase emulators:start --only firestore
npm i -D @firebase/rules-unit-testing
\`\`\`

\`\`\`typescript
import { assertFails, assertSucceeds, initializeTestEnvironment } from "@firebase/rules-unit-testing";

const env = await initializeTestEnvironment({ projectId: "demo-ndn" });
const alice = env.authenticatedContext("alice").firestore();
const mallory = env.authenticatedContext("mallory").firestore();

await assertSucceeds(alice.doc("users/alice").set({ name: "Alice" }));
await assertFails(mallory.doc("users/alice").set({ name: "Pwned" }));
\`\`\`

Untested rules are unverified claims. Treat the rules test suite like any other CI gate.
`,
    terminalLanguage: "bash",
    starterCode: `firebase emulators:start --only firestore\n# then in another terminal:\nnpm run test:rules`,
    expectedOutput: "✔ mallory cannot write to alice's profile — 2 passing",
    notes: {
      coreConcepts: "Rules are the server. Deny by default, verify identity via request.auth, roles via token claims, and document shape via request.resource.data. The emulator makes rules unit-testable.",
      proTip: "Write the attack test first (assertFails for the wrong user), then make it pass — TDD works beautifully for security rules.",
      keyTerms: [
        { term: "Zero-Trust", definition: "A security posture where no request is trusted by default; every operation must prove identity and authorization." },
        { term: "request.resource.data", definition: "The incoming document payload in a rules evaluation — validate it to enforce schema on writes." },
        { term: "Rules Unit Testing", definition: "Testing rules against the local emulator with authenticated/unauthenticated contexts via @firebase/rules-unit-testing." }
      ]
    },
    resources: [
      { name: "Security Rules Get Started", url: "https://firebase.google.com/docs/firestore/security/get-started", type: "docs" },
      { name: "Rules Conditions Reference", url: "https://firebase.google.com/docs/firestore/security/rules-conditions", type: "docs" },
      { name: "Test Rules with the Emulator", url: "https://firebase.google.com/docs/firestore/security/test-rules-emulator", type: "docs" }
    ]
  },
  {
    id: "les-fb-4-2",
    courseId: "course-firebase-gcp",
    moduleId: "mod-fb-4",
    order: 2,
    type: "video",
    title: "Lesson 4.2: Video — Introduction to Firebase Security Rules (Firecasts)",
    summary: "Official Firebase deep dive on how the rules engine evaluates requests and how to avoid the classic insecure patterns.",
    durationMinutes: 15,
    videoUrl: "https://www.youtube.com/embed/QEuu9X9L-MU",
    videoPoster: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1200&q=80",
    readingMarkdown: `
# Video Briefing

A Firebase Developer Advocate explains the rules engine from first principles.

**Watch for:**
- Why rules are *not* filters — a query must be provably safe for every possible result, or it fails entirely.
- How \`match\` blocks and wildcards (\`{userId}\`, \`{document=**}\`) bind path segments to variables.
- The evaluation model: any single \`allow\` that passes grants access.

**Red-flag patterns to memorize:** \`allow read, write: if true\` (open database), \`if request.auth != null\` alone (any signed-in stranger), and validating with \`resource.data\` when you meant \`request.resource.data\`.
`,
    notes: {
      coreConcepts: "Rules are evaluated per-operation against the query's potential result set, not row-by-row. One passing allow grants access — audit every allow you write.",
      proTip: "Run the Rules Playground in the Firebase Console to simulate a request before deploying — it shows exactly which match block allowed or denied it.",
      keyTerms: [
        { term: "Rules Are Not Filters", definition: "Firestore rejects a query outright if any possible result would violate rules — it never silently filters rows." }
      ]
    },
    resources: [
      { name: "Security Rules Deep Dive (video)", url: "https://www.youtube.com/watch?v=TglPc74M3DM", type: "video" },
      { name: "Rules Language Reference", url: "https://firebase.google.com/docs/rules/rules-language", type: "docs" }
    ]
  },
  {
    id: "les-fb-4-3",
    courseId: "course-firebase-gcp",
    moduleId: "mod-fb-4",
    order: 3,
    type: "lab",
    title: "Lesson 4.3: Practical Lab — Write, Test & Deploy Production Rules",
    summary: "Author a complete ruleset with ownership, instructor RBAC, and schema validation — proven by emulator unit tests.",
    durationMinutes: 50,
    readingMarkdown: `
# Practical Lab

Write the full ruleset for the academy data model (users, certificates, enrollments), including at least one immutable field and one enum validation. Prove it with emulator tests covering both the happy path and two attack scenarios.

Complete the lab in the **Lab Studio** panel below and submit for grading.
`,
    notes: {
      coreConcepts: "A ruleset shipped without a failing-attacker test is a hope, not a control.",
      proTip: "Keep a 'mallory.test.ts' file whose only job is trying to break your rules — grow it every time you add a collection.",
      keyTerms: [
        { term: "Attack Test", definition: "A unit test asserting that a malicious or unauthorized operation fails." }
      ]
    },
    resources: [
      { name: "rules-unit-testing Library", url: "https://firebase.google.com/docs/rules/unit-tests", type: "docs" }
    ]
  },

  // ─────────────────────────────────────────────────────────
  // MODULE 5 — Serverless GCP Cloud Functions
  // ─────────────────────────────────────────────────────────
  {
    id: "les-fb-5-1",
    courseId: "course-firebase-gcp",
    moduleId: "mod-fb-5",
    order: 1,
    type: "reading",
    title: "Lesson 5.1: Cloud Functions — Triggers, Idempotency & Cold Starts",
    summary: "Build 2nd-gen Cloud Functions triggered by HTTPS, Firestore writes, and schedules — engineered for retries and cold starts.",
    durationMinutes: 30,
    readingMarkdown: `
# Cloud Functions — Triggers, Idempotency & Cold Starts

Cloud Functions for Firebase (2nd gen, built on Cloud Run) lets you run backend code in response to events with zero server management. Three trigger families cover most production needs.

## 1. HTTPS Callable Functions

\`\`\`typescript
import { onCall, HttpsError } from "firebase-functions/v2/https";

export const issueCertificate = onCall(async (request) => {
  if (request.auth?.token.academyRole !== "INSTRUCTOR") {
    throw new HttpsError("permission-denied", "Instructor role required.");
  }
  const { studentId, courseId } = request.data;
  // ... write certificate doc with Admin SDK (bypasses rules)
  return { issued: true };
});
\`\`\`

Callable functions handle CORS and token verification for you — \`request.auth\` is pre-verified.

## 2. Firestore Triggers

\`\`\`typescript
import { onDocumentCreated } from "firebase-functions/v2/firestore";

export const onEnrollment = onDocumentCreated("enrollments/{id}", async (event) => {
  const data = event.data?.data();
  // send welcome email, increment course counters, etc.
});
\`\`\`

**Critical: triggers can fire more than once.** Event delivery is at-least-once. Make handlers **idempotent** — e.g. write derived data keyed by the event/document ID so a replay overwrites instead of duplicating:

\`\`\`typescript
await db.doc(\`emails/\${event.params.id}-welcome\`).set({ queuedAt: FieldValue.serverTimestamp() });
\`\`\`

## 3. Scheduled Functions

\`\`\`typescript
import { onSchedule } from "firebase-functions/v2/scheduler";

export const nightlyDigest = onSchedule("every day 02:00", async () => {
  // aggregate yesterday's quiz attempts into a stats doc
});
\`\`\`

## 4. Cold Starts & Tuning

A cold start is the latency of provisioning a new instance (typically 1–4 s for Node). Mitigations:

- Keep bundles small: lazy-import heavy SDKs *inside* the handler.
- Set \`minInstances: 1\` for latency-critical functions (costs ~$5–10/month per instance).
- Reuse clients across invocations by initializing them at module scope.

\`\`\`typescript
export const api = onCall({ region: "europe-west1", minInstances: 1, memory: "512MiB" }, handler);
\`\`\`

## 5. Local Development

\`\`\`bash
firebase emulators:start --only functions,firestore
\`\`\`

The emulator suite runs triggers against local Firestore writes — the full event loop, on your laptop, for free.
`,
    terminalLanguage: "typescript",
    starterCode: `import { onCall } from 'firebase-functions/v2/https';\n\nexport const ping = onCall(async () => {\n  return { status: "pong", at: Date.now() };\n});\nconsole.log("Function 'ping' registered for deployment");`,
    expectedOutput: "Function 'ping' registered for deployment",
    notes: {
      coreConcepts: "Three trigger families: HTTPS/callable, Firestore events, schedules. Delivery is at-least-once, so handlers must be idempotent. Cold starts are tunable with bundle size and minInstances.",
      proTip: "Initialize the Admin SDK and any API clients at module scope, not inside the handler — instance reuse makes warm invocations dramatically faster.",
      keyTerms: [
        { term: "Idempotency", definition: "A handler property where processing the same event twice produces the same result — mandatory under at-least-once delivery." },
        { term: "Cold Start", definition: "Latency incurred when a new function instance is provisioned to serve a request." },
        { term: "Callable Function", definition: "An HTTPS function invoked via the Firebase SDK with automatic auth token verification and CORS handling." }
      ]
    },
    resources: [
      { name: "Cloud Functions for Firebase Docs", url: "https://firebase.google.com/docs/functions", type: "docs" },
      { name: "2nd-gen Firestore Triggers", url: "https://firebase.google.com/docs/functions/firestore-events", type: "docs" },
      { name: "Tips & Tricks (performance)", url: "https://firebase.google.com/docs/functions/tips", type: "docs" }
    ]
  },
  {
    id: "les-fb-5-2",
    courseId: "course-firebase-gcp",
    moduleId: "mod-fb-5",
    order: 2,
    type: "video",
    title: "Lesson 5.2: Video — Getting Started with Cloud Functions",
    summary: "Official overview of writing, emulating, and deploying Cloud Functions that respond to HTTP requests and Firebase events.",
    durationMinutes: 15,
    videoUrl: "https://www.youtube.com/embed/2u6Zb36OQjM",
    videoPoster: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1200&q=80",
    readingMarkdown: `
# Video Briefing

The Firebase team shows the complete lifecycle: init, write, emulate, deploy.

**Watch for:**
- \`firebase init functions\` project structure and where TypeScript compiles to.
- Running the local emulator and hitting a function before any deploy.
- How deploys are per-function (\`--only functions:issueCertificate\`) — you don't redeploy the world.

**Challenge:** after watching, list which parts of a traditional Express server disappear when you move to callable functions (CORS middleware, auth middleware, server provisioning, TLS).
`,
    notes: {
      coreConcepts: "The emulator-first workflow is the professional default: iterate locally against emulated Firestore/Auth, deploy only what changed.",
      proTip: "Add 'firebase emulators:exec \"npm test\"' to CI — it boots emulators, runs your suite against them, and tears down automatically.",
      keyTerms: [
        { term: "Emulator Suite", definition: "Local versions of Firestore, Auth, Functions, and Storage for offline development and testing." }
      ]
    },
    resources: [
      { name: "TypeScript Firecast (Functions)", url: "https://www.youtube.com/watch?v=DYfP-UIKxH0", type: "video" },
      { name: "Emulator Suite Docs", url: "https://firebase.google.com/docs/emulator-suite", type: "docs" }
    ]
  },
  {
    id: "les-fb-5-3",
    courseId: "course-firebase-gcp",
    moduleId: "mod-fb-5",
    order: 3,
    type: "lab",
    title: "Lesson 5.3: Practical Lab — Event-Driven Certificate Pipeline",
    summary: "Ship a Firestore-triggered function that reacts to passed enrollments plus a role-gated callable — emulator-tested.",
    durationMinutes: 50,
    readingMarkdown: `
# Practical Lab

Build a mini event pipeline: when an enrollment document's status becomes PASSED, a trigger writes an audit record; a callable function (instructor-only) issues the certificate document. Prove idempotency by replaying the event.

Complete the lab in the **Lab Studio** panel below and submit for grading.
`,
    notes: {
      coreConcepts: "Event-driven side effects (audit trails, notifications, counters) belong in triggers — never in the client.",
      proTip: "Log event.id at the top of every trigger — when you're debugging duplicate deliveries at 2 a.m., you'll thank yourself.",
      keyTerms: [
        { term: "Event Replay", definition: "Re-delivering a previously processed event; your handler must tolerate it without side-effect duplication." }
      ]
    },
    resources: [
      { name: "Functions Samples Repo", url: "https://github.com/firebase/functions-samples", type: "repo" }
    ]
  },

  // ─────────────────────────────────────────────────────────
  // MODULE 6 — GCP Cloud Run Microservice Integration
  // ─────────────────────────────────────────────────────────
  {
    id: "les-fb-6-1",
    courseId: "course-firebase-gcp",
    moduleId: "mod-fb-6",
    order: 1,
    type: "reading",
    title: "Lesson 6.1: Connecting Firebase Frontends to Cloud Run Services",
    summary: "Containerize an Express API, deploy it to Cloud Run, and call it securely from a Firebase app with verified ID tokens.",
    durationMinutes: 30,
    readingMarkdown: `
# Connecting Firebase Frontends to Cloud Run Services

When your backend outgrows individual functions — long-running work, custom runtimes, WebSockets, heavier memory — **Cloud Run** runs any container as an autoscaling HTTPS service. The integration pattern with Firebase is one of the most useful architectures in the Google ecosystem.

## 1. The Contract: Bind to PORT on 0.0.0.0

Cloud Run injects a \`PORT\` env var and health-checks it. This is the #1 deployment failure:

\`\`\`typescript
import express from "express";
const app = express();

app.get("/healthz", (_req, res) => res.json({ ok: true }));

const port = Number(process.env.PORT) || 8080;
app.listen(port, "0.0.0.0", () => console.log(\`listening on \${port}\`));
\`\`\`

Binding to \`localhost\` instead of \`0.0.0.0\` fails the health check and the revision never goes live.

## 2. Verify Firebase ID Tokens in the Service

Your Cloud Run API must not trust callers blindly. Verify the JWT with the Admin SDK:

\`\`\`typescript
import * as admin from "firebase-admin";
admin.initializeApp(); // uses the service's runtime identity on GCP

app.use(async (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "missing token" });
  try {
    (req as any).user = await admin.auth().verifyIdToken(token);
    next();
  } catch {
    res.status(403).json({ error: "invalid token" });
  }
});
\`\`\`

## 3. Call It from the Firebase Client

\`\`\`typescript
const token = await auth.currentUser!.getIdToken();
const res = await fetch("https://api-xyz-ew.a.run.app/reports", {
  headers: { Authorization: \`Bearer \${token}\` },
});
\`\`\`

## 4. Deploy

\`\`\`bash
gcloud run deploy academy-api \\
  --source . \\
  --region europe-west1 \\
  --allow-unauthenticated \\
  --memory 512Mi --min-instances 0 --max-instances 10
\`\`\`

\`--source .\` uses Cloud Build + buildpacks — no Dockerfile required (you'll write real Dockerfiles in NDN-GCP-501). \`--allow-unauthenticated\` is correct here because *your middleware* does auth; the alternative is IAM-gated invocation for service-to-service calls.

## 5. Scale-to-Zero Economics

Cloud Run bills per 100 ms of request processing. Idle services cost nothing at \`min-instances 0\`. For spiky academic workloads this is dramatically cheaper than an always-on VM.
`,
    terminalLanguage: "gcloud",
    starterCode: `gcloud run deploy academy-api --source . --region europe-west1 --allow-unauthenticated`,
    expectedOutput: "Service [academy-api] revision [academy-api-00001] has been deployed and is serving 100 percent of traffic.",
    notes: {
      coreConcepts: "Cloud Run runs any container as autoscaling HTTPS. The PORT/0.0.0.0 contract gates deployment; Firebase ID token verification in middleware extends your zero-trust perimeter to custom APIs.",
      proTip: "Always ship a /healthz route and test the container locally with 'PORT=8080 node server.js' before deploying — it reproduces the exact Cloud Run startup contract.",
      keyTerms: [
        { term: "Cloud Run Revision", definition: "An immutable snapshot of a service (image + config); traffic can be split between revisions for safe rollouts." },
        { term: "Scale-to-Zero", definition: "Autoscaling down to no running instances when idle — you pay only while handling requests." },
        { term: "Bearer Token", definition: "An Authorization header credential (here, the Firebase ID token) presented by the client on every API call." }
      ]
    },
    resources: [
      { name: "Cloud Run Documentation", url: "https://cloud.google.com/run/docs", type: "docs" },
      { name: "Verify ID Tokens", url: "https://firebase.google.com/docs/auth/admin/verify-id-tokens", type: "docs" },
      { name: "Cloud Run Container Contract", url: "https://cloud.google.com/run/docs/container-contract", type: "docs" }
    ]
  },
  {
    id: "les-fb-6-2",
    courseId: "course-firebase-gcp",
    moduleId: "mod-fb-6",
    order: 2,
    type: "video",
    title: "Lesson 6.2: Video — Cloud Run & Serverless Containers",
    summary: "Google Cloud's product leads explain what Cloud Run is, how it autoscales, and where it fits alongside Functions.",
    durationMinutes: 18,
    videoUrl: "https://www.youtube.com/embed/sAFuHhQPKJk",
    videoPoster: "https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=1200&q=80",
    readingMarkdown: `
# Video Briefing

The head of product for Cloud Run explains the service's design philosophy: containers as the universal packaging format, with serverless operational semantics.

**Watch for:**
- The request-based autoscaling model and what concurrency (default 80) means for instance count.
- Revisions and traffic splitting — the primitive behind blue/green and canary deploys.
- When to choose Cloud Run over Cloud Functions (custom runtimes, long requests, WebSockets, sidecars).

**Rule of thumb:** Functions for event glue, Cloud Run for APIs and anything with its own framework.
`,
    notes: {
      coreConcepts: "Concurrency × instances = capacity. Revisions are immutable, so rollback is instant traffic reassignment, not a redeploy.",
      proTip: "Lower concurrency (e.g. 10) for memory-heavy endpoints — one instance handling 80 concurrent PDF renders will OOM.",
      keyTerms: [
        { term: "Concurrency", definition: "Maximum simultaneous requests one Cloud Run instance will accept before the autoscaler adds instances." }
      ]
    },
    resources: [
      { name: "Cloud Run Autoscaling", url: "https://cloud.google.com/run/docs/about-instance-autoscaling", type: "docs" }
    ]
  },
  {
    id: "les-fb-6-3",
    courseId: "course-firebase-gcp",
    moduleId: "mod-fb-6",
    order: 3,
    type: "lab",
    title: "Lesson 6.3: Practical Lab — Deploy an Authenticated API to Cloud Run",
    summary: "Deploy an Express service to Cloud Run with token-verification middleware and call it from a Firebase-authenticated client.",
    durationMinutes: 50,
    readingMarkdown: `
# Practical Lab

Ship a real microservice: Express + health check + Firebase token middleware, deployed to Cloud Run from source, and invoked from your client with a Bearer token. Capture proof that an unauthenticated request gets 401 while a signed-in call succeeds.

Complete the lab in the **Lab Studio** panel below and submit for grading.
`,
    notes: {
      coreConcepts: "The 401-vs-200 evidence pair is the acceptance test of the whole zero-trust chain: client token → HTTPS → middleware verification.",
      proTip: "Use 'gcloud run services logs read academy-api' immediately after a failed deploy — the container's stdout tells you exactly why the health check failed.",
      keyTerms: [
        { term: "Service Logs", definition: "Cloud Run's aggregated stdout/stderr per revision, the first stop for deployment debugging." }
      ]
    },
    resources: [
      { name: "Deploy from Source", url: "https://cloud.google.com/run/docs/deploying-source-code", type: "docs" }
    ]
  },

  // ─────────────────────────────────────────────────────────
  // MODULE 7 — Firebase App Hosting Deployment
  // ─────────────────────────────────────────────────────────
  {
    id: "les-fb-7-1",
    courseId: "course-firebase-gcp",
    moduleId: "mod-fb-7",
    order: 1,
    type: "reading",
    title: "Lesson 7.1: Firebase App Hosting — apphosting.yaml, Secrets & CI/CD",
    summary: "Configure App Hosting compute settings, bind Secret Manager secrets, and set up continuous deployment from GitHub.",
    durationMinutes: 30,
    readingMarkdown: `
# Firebase App Hosting — apphosting.yaml, Secrets & CI/CD

Firebase App Hosting is Google's opinionated hosting for full-stack web apps: it connects to your GitHub repo, builds with Cloud Build, runs your server on Cloud Run, and fronts everything with Cloud CDN. You configure it declaratively.

## 1. apphosting.yaml

\`\`\`yaml
runConfig:
  minInstances: 0
  maxInstances: 4
  concurrency: 80
  cpu: 1
  memoryMiB: 512

env:
  - variable: NODE_ENV
    value: production
    availability: [BUILD, RUNTIME]

  - variable: VITE_FIREBASE_API_KEY
    secret: firebaseApiKey          # ← Secret Manager reference
    availability: [BUILD, RUNTIME]
\`\`\`

Two availability scopes matter: **BUILD** (Vite needs VITE_* vars at build time to inline them) and **RUNTIME** (your Node server reads process.env). Getting this wrong produces the classic "works locally, undefined in prod" bug.

## 2. Secrets via Secret Manager

\`\`\`bash
firebase apphosting:secrets:set geminiApiKey
# paste value; then grant access:
firebase apphosting:secrets:grantaccess geminiApiKey --backend academy-web
\`\`\`

Secrets never live in the repo or the YAML — only *references* do. Rotation is a Secret Manager version bump, no redeploy of code.

## 3. Rollouts from GitHub

Connect the backend to a GitHub branch (usually \`main\`). Every push triggers: Cloud Build → container image → new Cloud Run revision → gradual traffic rollout. Failed health checks auto-halt the rollout, keeping the last good revision serving.

## 4. The Server Contract (again)

App Hosting runs your server on Cloud Run, so the same rules apply:

\`\`\`typescript
const port = Number(process.env.PORT) || 8080;
app.listen(port, "0.0.0.0");
\`\`\`

And your \`package.json\` needs a real \`start\` script that launches the built server — App Hosting runs \`npm run start\` in the production container.

## 5. Monitoring the Rollout

\`\`\`bash
firebase apphosting:backends:list
firebase apphosting:rollouts:list --backend academy-web
\`\`\`

Watch the first deploy in the Console: build logs, then revision health, then domain propagation. A green rollout ends with your app on \`https://<backend>--<project>.<region>.hosted.app\`.
`,
    terminalLanguage: "bash",
    starterCode: `firebase apphosting:backends:create --project ndn-analytics-academy --location europe-west4\nfirebase apphosting:secrets:set firebaseApiKey`,
    expectedOutput: "Backend created. Secret firebaseApiKey version 1 stored in Secret Manager.",
    notes: {
      coreConcepts: "apphosting.yaml declares compute + env + secret bindings. BUILD vs RUNTIME availability decides whether Vite or your server sees a variable. Rollouts are Git-driven with automatic halt on failed health checks.",
      proTip: "Any VITE_-prefixed variable must have BUILD availability — Vite inlines it during compilation; RUNTIME-only secrets are invisible to the client bundle by design.",
      keyTerms: [
        { term: "apphosting.yaml", definition: "The declarative config file controlling App Hosting compute resources, environment variables, and secret bindings." },
        { term: "Secret Manager", definition: "GCP's versioned secret store; App Hosting injects referenced secrets at build or runtime without exposing them in code." },
        { term: "Rollout", definition: "App Hosting's build-and-release pipeline triggered by a Git push, with health-check-gated traffic shifting." }
      ]
    },
    resources: [
      { name: "App Hosting Docs", url: "https://firebase.google.com/docs/app-hosting", type: "docs" },
      { name: "Configure apphosting.yaml", url: "https://firebase.google.com/docs/app-hosting/configure", type: "docs" },
      { name: "Secret Manager", url: "https://cloud.google.com/secret-manager/docs", type: "docs" }
    ]
  },
  {
    id: "les-fb-7-2",
    courseId: "course-firebase-gcp",
    moduleId: "mod-fb-7",
    order: 2,
    type: "video",
    title: "Lesson 7.2: Video — Firebase Hosting & Server-Side Apps",
    summary: "Official Firebase session on hosting web apps with server-side code — the architecture App Hosting automates.",
    durationMinutes: 14,
    videoUrl: "https://www.youtube.com/embed/y3cMOapyRdk",
    videoPoster: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    readingMarkdown: `
# Video Briefing

This official session covers serving dynamic content alongside static assets in the Firebase hosting family — the exact split App Hosting automates for you.

**Watch for:**
- The static-vs-dynamic boundary: what the CDN serves directly vs. what hits your server.
- How rewrites route requests to backend compute.
- Cache-control headers and why immutable hashed assets should be cached for a year.

**Connect it:** in App Hosting, this whole pipeline (CDN + build + Cloud Run) is provisioned from one YAML file and a GitHub connection.
`,
    notes: {
      coreConcepts: "Static assets belong on the CDN with long cache lifetimes; only genuinely dynamic requests should reach compute. App Hosting wires this split automatically.",
      proTip: "Verify your cache headers with 'curl -I' against the deployed URL — a missing max-age on hashed assets silently multiplies your serving costs.",
      keyTerms: [
        { term: "CDN Edge Caching", definition: "Serving static content from Google's global edge network instead of your origin server." }
      ]
    },
    resources: [
      { name: "App Hosting Architecture", url: "https://firebase.google.com/docs/app-hosting/about-app-hosting", type: "docs" }
    ]
  },
  {
    id: "les-fb-7-3",
    courseId: "course-firebase-gcp",
    moduleId: "mod-fb-7",
    order: 3,
    type: "lab",
    title: "Lesson 7.3: Practical Lab — Production Launch on App Hosting",
    summary: "Connect your repo, configure apphosting.yaml with a secret binding, and ship a health-checked production rollout.",
    durationMinutes: 45,
    readingMarkdown: `
# Practical Lab

The graduation exercise for this course's infrastructure track: take your app live. Connect GitHub, write apphosting.yaml with correct BUILD/RUNTIME scopes, bind one Secret Manager secret, and complete a green rollout.

Complete the lab in the **Lab Studio** panel below and submit your deployed URL for verification.
`,
    notes: {
      coreConcepts: "A production deploy is only done when the rollout is green, the URL serves, and secrets came from Secret Manager — not .env files in the image.",
      proTip: "If the build succeeds but the rollout hangs 'unhealthy', it's almost always the PORT/0.0.0.0 contract or a missing start script — check revision logs first.",
      keyTerms: [
        { term: "Green Rollout", definition: "A deployment that passed build, health checks, and full traffic migration." }
      ]
    },
    resources: [
      { name: "App Hosting GitHub Integration", url: "https://firebase.google.com/docs/app-hosting/get-started", type: "docs" }
    ]
  }
];
