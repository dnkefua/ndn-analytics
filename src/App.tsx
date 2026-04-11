import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { Suspense, lazy, useEffect } from 'react';
import CustomCursor from './components/layout/CustomCursor';
import FloatingParticlesBackground from './components/background/FloatingParticlesBackground';
import GridOverlay from './components/layout/GridOverlay';
import SpeedHUD from './components/layout/SpeedHUD';
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
const PricingSection = lazy(() => import('./components/pricing/PricingSection'));
const AIToolsSection = lazy(() => import('./components/aitools/AIToolsSection'));
const CaseStudiesSection = lazy(() => import('./components/casestudies/CaseStudiesSection'));
const CaseStudyDetail = lazy(() => import('./components/casestudies/CaseStudyDetail'));

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

function PageLoader() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', color: 'var(--brand-cyan)',
      fontFamily: "'JetBrains Mono Variable', monospace",
      fontSize: '0.75rem', letterSpacing: '0.2em',
    }}>
      LOADING...
    </div>
  );
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
        <Suspense fallback={<PageLoader />}>
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
            <Route path="/pricing"     element={<PricingSection />} />
            <Route path="/ai-tools"    element={<AIToolsSection />} />
            <Route path="/case-studies" element={<CaseStudiesSection />} />
            <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <PageTracker />
        <CustomCursor />
        <FloatingParticlesBackground />
        <GridOverlay />
        <SpeedHUD />
        <Navbar />
        <main id="main-content">
          <AnimatedRoutes />
        </main>
        <Footer />
        <AriaFAB />
      </BrowserRouter>
    </HelmetProvider>
  );
}
