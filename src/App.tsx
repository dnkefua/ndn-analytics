import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Suspense, lazy, useEffect } from 'react';
import CustomCursor from './components/layout/CustomCursor';
import SpaceEngine from './components/three/SpaceEngine';
import GridOverlay from './components/layout/GridOverlay';
import SpeedHUD from './components/layout/SpeedHUD';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AriaFAB from './components/aria/AriaFAB';

const Hero = lazy(() => import('./components/hero/Hero'));
const ProductsSection = lazy(() => import('./components/products/ProductsSection'));
const ProductDetail = lazy(() => import('./components/products/ProductDetail'));
const SolutionsSection = lazy(() => import('./components/solutions/SolutionsSection'));
const TechSection = lazy(() => import('./components/tech/TechSection'));
const AboutSection = lazy(() => import('./components/about/AboutSection'));
const ContactSection = lazy(() => import('./components/contact/ContactSection'));
const BlogSection = lazy(() => import('./components/blog/BlogSection'));
const BlogPost = lazy(() => import('./components/blog/BlogPost'));
const PricingSection = lazy(() => import('./components/pricing/PricingSection'));

function PageTracker() {
  const location = useLocation();
  useEffect(() => {
    if (typeof gtag === 'function') {
      gtag('config', 'G-XXXXXXXXXX', { page_path: location.pathname + location.search });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);
  return null;
}

function PageLoader() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--brand-cyan)',
      fontFamily: "'JetBrains Mono Variable', 'JetBrains Mono', monospace",
      fontSize: '0.75rem',
      letterSpacing: '0.2em',
    }}>
      LOADING...
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <PageTracker />
        <CustomCursor />
        <SpaceEngine />
        <GridOverlay />
        <SpeedHUD />
        <Navbar />
        <main id="main-content" style={{ position: 'relative', zIndex: 10 }}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/products" element={<ProductsSection />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/solutions" element={<SolutionsSection />} />
              <Route path="/tech" element={<TechSection />} />
              <Route path="/about" element={<AboutSection />} />
              <Route path="/contact" element={<ContactSection />} />
              <Route path="/blog" element={<BlogSection />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/pricing" element={<PricingSection />} />
              <Route path="/pricing" element={<PricingSection />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <AriaFAB />
      </BrowserRouter>
    </HelmetProvider>
  );
}
