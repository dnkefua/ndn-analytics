import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Suspense, lazy } from 'react';
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

function PageLoader() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--brand-cyan)',
      fontFamily: "'Share Tech Mono', monospace",
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
        <CustomCursor />
        <SpaceEngine />
        <GridOverlay />
        <SpeedHUD />
        <Navbar />
        <main style={{ position: 'relative', zIndex: 10 }}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/products" element={<ProductsSection />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/solutions" element={<SolutionsSection />} />
              <Route path="/tech" element={<TechSection />} />
              <Route path="/about" element={<AboutSection />} />
              <Route path="/contact" element={<ContactSection />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <AriaFAB />
      </BrowserRouter>
    </HelmetProvider>
  );
}
