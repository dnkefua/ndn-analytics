/* eslint-disable react-refresh/only-export-components */
import { renderToString } from 'react-dom/server'
import { StaticRouter, Routes, Route, Navigate } from 'react-router'
import { StrictMode, Suspense } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import './styles/variables.css'
import './styles/typography.css'
import './styles/animations.css'
import './styles/components.css'
import './index.css'

// Import components directly for SSR (no lazy loading)
import Hero from './components/hero/Hero'
import ProductsSection from './components/products/ProductsSection'
import ProductDetail from './components/products/ProductDetail'
import SolutionsSection from './components/solutions/SolutionsSection'
import TechSection from './components/tech/TechSection'
import AboutSection from './components/about/AboutSection'
import ContactSection from './components/contact/ContactSection'
import BlogSection from './components/blog/BlogSection'
import BlogPost from './components/blog/BlogPost'
import AIToolsSection from './components/aitools/AIToolsSection'
import AIProductsLanding from './components/landing/AIProductsLanding'
import BlockchainSolutionsLanding from './components/landing/BlockchainSolutionsLanding'
import GoogleCloudAILanding from './components/landing/GoogleCloudAILanding'
import SmartContractLanding from './components/landing/SmartContractLanding'
import AIAutomationLanding from './components/landing/AIAutomationLanding'
import CaseStudiesSection from './components/casestudies/CaseStudiesSection'
import CaseStudyDetail from './components/casestudies/CaseStudyDetail'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import AriaFAB from './components/aria/AriaFAB'
import WhitePaper from './components/whitepaper/WhitePaper'
import CheckoutSuccess from './components/checkout/CheckoutSuccess'
import CheckoutCancelled from './components/checkout/CheckoutCancelled'
import PrivacyPolicy from './components/legal/PrivacyPolicy'
import FineTuningTeaser from './components/products/FineTuningTeaser'
import AdminDashboard from './components/admin/AdminDashboard'
import NotFound from './components/errors/NotFound'

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

export function render(url: string) {
  const helmetContext: { helmet?: import('react-helmet-async').HelmetServerState } = {}
  const html = renderToString(
    <StrictMode>
      <HelmetProvider context={helmetContext}>
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
                  <Route path="/pricing" element={<Navigate to="/contact" replace />} />
                  <Route path="/ai-tools" element={<AIToolsSection />} />
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
            </main>
            <Footer />
            <AriaFAB />
          </Suspense>
        </StaticRouter>
      </HelmetProvider>
    </StrictMode>
  )

  return { html, helmet: helmetContext.helmet }
}
