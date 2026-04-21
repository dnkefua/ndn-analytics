/* eslint-disable react-refresh/only-export-components */
import { renderToString } from 'react-dom/server'
import { StaticRouter, Routes, Route } from 'react-router'
import { StrictMode, Suspense, lazy } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import './styles/variables.css'
import './styles/typography.css'
import './styles/animations.css'
import './styles/components.css'
import './index.css'

const Hero = lazy(() => import('./components/hero/Hero'))
const ProductsSection = lazy(() => import('./components/products/ProductsSection'))
const ProductDetail = lazy(() => import('./components/products/ProductDetail'))
const SolutionsSection = lazy(() => import('./components/solutions/SolutionsSection'))
const TechSection = lazy(() => import('./components/tech/TechSection'))
const AboutSection = lazy(() => import('./components/about/AboutSection'))
const ContactSection = lazy(() => import('./components/contact/ContactSection'))
const BlogSection = lazy(() => import('./components/blog/BlogSection'))
const BlogPost = lazy(() => import('./components/blog/BlogPost'))
const PricingSection = lazy(() => import('./components/pricing/PricingSection'))
const AIToolsSection = lazy(() => import('./components/aitools/AIToolsSection'))
const CaseStudiesSection = lazy(() => import('./components/casestudies/CaseStudiesSection'))
const CaseStudyDetail = lazy(() => import('./components/casestudies/CaseStudyDetail'))
const Navbar = lazy(() => import('./components/layout/Navbar'))
const Footer = lazy(() => import('./components/layout/Footer'))
const AriaFAB = lazy(() => import('./components/aria/AriaFAB'))
const WhitePaper = lazy(() => import('./components/whitepaper/WhitePaper'))
const CheckoutSuccess = lazy(() => import('./components/checkout/CheckoutSuccess'))
const CheckoutCancelled = lazy(() => import('./components/checkout/CheckoutCancelled'))
const PrivacyPolicy = lazy(() => import('./components/legal/PrivacyPolicy'))
const FineTuningTeaser = lazy(() => import('./components/products/FineTuningTeaser'))
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'))
const NotFound = lazy(() => import('./components/errors/NotFound'))

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

function SSRApp({ url }: { url: string }) {
  return (
    <StrictMode>
      <HelmetProvider>
        <StaticRouter location={url}>
          <Suspense fallback={<PageLoader />}>
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
                  <Route path="/ai-tools" element={<AIToolsSection />} />
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
            </main>
            <Footer />
            <AriaFAB />
          </Suspense>
        </StaticRouter>
      </HelmetProvider>
    </StrictMode>
  )
}

export function render(url: string) {
  const html = renderToString(<SSRApp url={url} />)
  return { html }
}