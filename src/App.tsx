import { BrowserRouter, Routes, Route, Navigate, useInRouterContext, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Suspense, lazy, useEffect } from 'react';
import * as Sentry from '@sentry/react';
import SkeletonLoader from './components/ui/SkeletonLoader';
import CustomCursor from './components/layout/CustomCursor';
import FloatingParticlesBackground from './components/background/FloatingParticlesBackground';
import GridOverlay from './components/layout/GridOverlay';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AriaFAB from './components/aria/AriaFAB';
import { trackPageView } from './lib/analytics';
import { usePageTracking } from './lib/engagementTracker';

const Hero           = lazy(() => import('./components/hero/Hero'));
const ProductsSection = lazy(() => import('./components/products/ProductsSection'));
const ProductDetail  = lazy(() => import('./components/products/ProductDetail'));
const SolutionsSection = lazy(() => import('./components/solutions/SolutionsSection'));
const TechSection    = lazy(() => import('./components/tech/TechSection'));
const AboutSection   = lazy(() => import('./components/about/AboutSection'));
const ContactSection = lazy(() => import('./components/contact/ContactSection'));
const BlogSection    = lazy(() => import('./components/blog/BlogSection'));
const BlogPost       = lazy(() => import('./components/blog/BlogPost'));
const AIToolsSection = lazy(() => import('./components/aitools/AIToolsSection'));
const AIProductsLanding = lazy(() => import('./components/landing/AIProductsLanding'));
const BlockchainSolutionsLanding = lazy(() => import('./components/landing/BlockchainSolutionsLanding'));
const GoogleCloudAILanding = lazy(() => import('./components/landing/GoogleCloudAILanding'));
const SmartContractLanding = lazy(() => import('./components/landing/SmartContractLanding'));
const AIAutomationLanding = lazy(() => import('./components/landing/AIAutomationLanding'));
const CaseStudiesSection = lazy(() => import('./components/casestudies/CaseStudiesSection'));
const CaseStudyDetail = lazy(() => import('./components/casestudies/CaseStudyDetail'));
const WhitePaper = lazy(() => import('./components/whitepaper/WhitePaper'));
const CheckoutSuccess = lazy(() => import('./components/checkout/CheckoutSuccess'));
const CheckoutCancelled = lazy(() => import('./components/checkout/CheckoutCancelled'));
const PrivacyPolicy = lazy(() => import('./components/legal/PrivacyPolicy'));
const FineTuningTeaser = lazy(() => import('./components/products/FineTuningTeaser'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const NotFound = lazy(() => import('./components/errors/NotFound'));

function PageTracker() {
  const location = useLocation();

  // Track for Google Analytics
  useEffect(() => {
    trackPageView(location.pathname + location.search);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);

  // Track for lead engagement scoring
  usePageTracking();

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -14 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'relative', zIndex: 10 }}
      >
        <Suspense fallback={<SkeletonLoader />}>
          <Routes location={location}>
            <Route path="/"            element={<Hero />} />
            <Route path="/products"    element={<ProductsSection />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/solutions"   element={<SolutionsSection />} />
            <Route path="/tech"        element={<TechSection />} />
            <Route path="/about"       element={<AboutSection />} />
            <Route path="/contact"     element={<ContactSection />} />
            <Route path="/blog"        element={<BlogSection />} />
            <Route path="/blog/:slug"  element={<BlogPost />} />
            <Route path="/pricing"     element={<Navigate to="/contact" replace />} />
            <Route path="/ai-tools"    element={<AIToolsSection />} />
            <Route path="/ai-products" element={<AIProductsLanding />} />
            <Route path="/blockchain-solutions" element={<BlockchainSolutionsLanding />} />
            <Route path="/google-cloud-ai-consulting" element={<GoogleCloudAILanding />} />
            <Route path="/smart-contract-development" element={<SmartContractLanding />} />
            <Route path="/ai-automation" element={<AIAutomationLanding />} />
            <Route path="/case-studies" element={<CaseStudiesSection />} />
            <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/checkout/cancelled" element={<CheckoutCancelled />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/whitepaper" element={<WhitePaper />} />
            <Route path="/fine-tuning" element={<FineTuningTeaser />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

function AppShell() {
  return (
    <>
      <PageTracker />
      <CustomCursor />
      <FloatingParticlesBackground />
      <GridOverlay />
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Navbar />
      <main id="main-content">
        <AnimatedRoutes />
      </main>
      <Footer />
      <AriaFAB />
    </>
  );
}

export default function App() {
  const isInRouterContext = useInRouterContext();

  return (
    <Sentry.ErrorBoundary fallback={<div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Something went wrong. Please refresh the page.</div>}>
      {isInRouterContext ? (
        <AppShell />
      ) : (
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      )}
    </Sentry.ErrorBoundary>
  );
}
