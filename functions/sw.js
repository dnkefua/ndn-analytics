const CACHE_NAME = 'ndn-analytics-offline-mpxuhv9d';
const PRECACHE_URLS = [
  "/",
  "/site.webmanifest",
  "/favicon.ico",
  "/favicon.svg",
  "/favicon-96x96.png",
  "/apple-touch-icon.png",
  "/web-app-manifest-192x192.png",
  "/web-app-manifest-512x512.png",
  "/logo.jpg",
  "/og-image.png",
  "/assets/AboutSection-CZEkdOhn.css",
  "/assets/AboutSection-D1uh0324.js",
  "/assets/AdminDashboard-BQdFBLwa.css",
  "/assets/AdminDashboard-DwmiExMj.js",
  "/assets/AIAutomationLanding-NuUQ4SN-.js",
  "/assets/AIProductsLanding-C9U-eC4K.js",
  "/assets/AIToolsSection-CidnFrVT.js",
  "/assets/analytics-cFvPLyjN.js",
  "/assets/AuthorProfile-gyitCAke.js",
  "/assets/BlockchainSolutionsLanding-CeXqH6Em.js",
  "/assets/blog/agentic-workforce-hero.jpg",
  "/assets/blog/ai-divide-enterprise-hero.jpg",
  "/assets/blog/blockchain-supply-chain-hero.jpg",
  "/assets/blog/churn-prevention-hero.jpg",
  "/assets/blog/demand-forecasting-hero.jpg",
  "/assets/blog/enterprise-ai-agents-hero.jpg",
  "/assets/blog/fine-tuning-strategy-hero.jpg",
  "/assets/blog/hallucination-data-fix-hero.jpg",
  "/assets/blog/hospital-ai-readmission-hero.jpg",
  "/assets/blog/last-mile-delivery-hero.jpg",
  "/assets/blog/mcp-protocol-hero.jpg",
  "/assets/blog/multi-agent-orchestration-hero.jpg",
  "/assets/BlogPost-GjdoJEby.js",
  "/assets/BlogSection-BF1oi-iJ.js",
  "/assets/blogService-DcQR2i0n.js",
  "/assets/camdiag-landing.png",
  "/assets/camdiag-logo.png",
  "/assets/CaseStudies-BXuAbZ4y.js",
  "/assets/CaseStudies-vDq5O5V1.css",
  "/assets/CaseStudiesSection-X0c2BdOT.js",
  "/assets/CaseStudyDetail-uS-noRHC.js",
  "/assets/CheckoutCancelled-se9RELLy.js",
  "/assets/CheckoutSuccess-DAEutG_F.js",
  "/assets/ContactSection-CcCMt7Qi.css",
  "/assets/ContactSection-CCy98vCe.js",
  "/assets/CorrectionsPolicy-CYIuAV81.js",
  "/assets/diaspora-app-home.webp",
  "/assets/diaspora-app-profile.webp",
  "/assets/EditorialPolicy-DIsYALtg.js",
  "/assets/eis-maths-studio-logo.png",
  "/assets/es-bG84DEoL.js",
  "/assets/FAQSchema-Be8dYaDR.js",
  "/assets/fine-tune-command-center.webp",
  "/assets/FineTuningTeaser-CKOLjk1v.js",
  "/assets/firebase-BQdZb0my.js",
  "/assets/GlassCard-BOLF7KDM.js",
  "/assets/GoogleCloudAILanding-BvVYxob2.js",
  "/assets/HeroGlass-4D6u8flp.js",
  "/assets/HeroGlass-CnhadAT1.css",
  "/assets/index-DL7c1-9N.js",
  "/assets/index-DYQwuNh_.css",
  "/assets/inter-cyrillic-ext-wght-normal-BOeWTOD4.woff2",
  "/assets/inter-cyrillic-wght-normal-DqGufNeO.woff2",
  "/assets/inter-greek-ext-wght-normal-DlzME5K_.woff2",
  "/assets/inter-greek-wght-normal-CkhJZR-_.woff2",
  "/assets/inter-latin-ext-wght-normal-DO1Apj_S.woff2",
  "/assets/inter-latin-wght-normal-Dx4kXJAl.woff2",
  "/assets/inter-vietnamese-wght-normal-CBcvBZtf.woff2",
  "/assets/jetbrains-mono-cyrillic-wght-normal-D73BlboJ.woff2",
  "/assets/jetbrains-mono-greek-wght-normal-Bw9x6K1M.woff2",
  "/assets/jetbrains-mono-latin-ext-wght-normal-DBQx-q_a.woff2",
  "/assets/jetbrains-mono-latin-wght-normal-B9CIFXIH.woff2",
  "/assets/jetbrains-mono-vietnamese-wght-normal-Bt-aOZkq.woff2",
  "/assets/leads-CHXTMzVh.js",
  "/assets/LocalServiceLanding-Bx2Td8Y4.js",
  "/assets/NDN Tracechain landing page.png",
  "/assets/ndn-ipfs-chain-homepage.png",
  "/assets/ndn-ipfs-chain-homepage.webp",
  "/assets/neuroquest-academy-landing.webp",
  "/assets/Njangi landing page.png",
  "/assets/njangi-demo.gif",
  "/assets/njangi-landing.png",
  "/assets/njangi-landing.webp",
  "/assets/NotFound-KRL_hovi.js",
  "/assets/PrivacyPolicy-BxEAq22v.js",
  "/assets/ProcessPage-B5OQ0c0Z.js",
  "/assets/ProductDetail-Bsw9Kqmk.js",
  "/assets/ProductDetail-JD8zH_gM.css",
  "/assets/ProductsSection-BVQRNExB.js",
  "/assets/ProductsSection-DSBlPztK.css",
  "/assets/PublisherPageLayout-DrjErxTe.js",
  "/assets/rolldown-runtime-COnpUsM8.js",
  "/assets/SEO-C1y0pT-s.js",
  "/assets/ServiceLandingPage-DewZ-wTz.js",
  "/assets/SmartContractLanding-CB0-6M0I.js",
  "/assets/SolutionsSection-BO9_n0nT.js",
  "/assets/SolutionsSection-DQa8ObHh.css",
  "/assets/student-teacher-app-landing.png",
  "/assets/syne-greek-wght-normal-5tOOQDeJ.woff2",
  "/assets/syne-latin-ext-wght-normal-JjI8ZrW1.woff2",
  "/assets/syne-latin-wght-normal-BVsvWWA4.woff2",
  "/assets/TechSection-BAKRKZuL.js",
  "/assets/TechSection-UWlrtTm6.css",
  "/assets/TermsOfService-BWyOiXMA.js",
  "/assets/tracechain-demo.gif",
  "/assets/tracechain-landing.png",
  "/assets/tracechain-landing.webp",
  "/assets/use-spring-CIgJf1rg.js",
  "/assets/vendor-6gBRyHmE.js",
  "/assets/WhitePaper-0sJ3lONO.css",
  "/assets/WhitePaper-Bthyitun.js",
  "/optimized/apple-touch-icon.webp",
  "/optimized/favicon-96x96.webp",
  "/optimized/ndnanalytics logo.webp",
  "/optimized/ndnanalytics logo1.webp",
  "/optimized/web-app-manifest-192x192.webp",
  "/optimized/web-app-manifest-512x512.webp"
];
const OFFLINE_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#06B6D4" />
    <title>NDN Analytics</title>
    <style>
      body{margin:0;min-height:100vh;display:grid;place-items:center;background:#020b18;color:#eff6ff;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
      main{max-width:28rem;padding:2rem;text-align:center}
      h1{margin:0 0 .75rem;font-size:1.5rem}
      p{margin:0;color:#94a3b8;line-height:1.6}
    </style>
  </head>
  <body>
    <main>
      <h1>NDN Analytics</h1>
      <p>The app is offline. Open it once with internet to refresh the latest experience, then it will be available here.</p>
    </main>
  </body>
</html>`;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((key) => key.startsWith('ndn-analytics-') && key !== CACHE_NAME)
        .map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('/', copy));
          return response;
        })
        .catch(() => caches.match('/').then((cached) => cached || new Response(OFFLINE_HTML, {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        })))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
        return response;
      });
    })
  );
});
