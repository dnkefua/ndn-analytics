import { useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import { GCLOUD_PRODUCTS, ETH_PRODUCTS, NEW_PRODUCTS } from './productData';
import SEO from '../seo/SEO';
import './ProductsSection.css';

function StackGroup({ label, icon, products, color }: { label: string; icon: string; products: typeof GCLOUD_PRODUCTS; color: string }) {
  return (
    <div className="stack-group">
      <div className="stack-label" style={{ color }}>
        <span>{icon}</span>
        <span>{label}</span>
        <div className="stack-line" style={{ background: color }} />
      </div>
      <div className="products-grid">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}

export default function ProductsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.target.classList.toggle('visible', e.isIntersecting)),
      { threshold: 0.05 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <SEO
        title="Enterprise AI & Blockchain Products"
        description="Explore 14 enterprise products from NDN Analytics - demand forecasting, healthcare AI, supply chain traceability, blockchain payments, credential verification, community finance, diaspora networking, IPFS chain-of-custody, and cognitive AI."
        keywords="enterprise AI products, demand forecasting, healthcare AI, supply chain blockchain, Ethereum smart contracts, credential verification, real estate tokenization"
        canonicalPath="/products"
      />
      <section className="section products-section" ref={sectionRef}>
      <div className="container">
        <div className="section-tag reveal">Products</div>
        <h2 className="section-title reveal stagger-1">
          14 Products. Three Stacks.<br />
          <span className="text-gradient">Infinite Intelligence.</span>
        </h2>
        <p className="products-subtitle reveal stagger-2">
          From Google Cloud AI to Ethereum smart contracts and emerging intelligence platforms — enterprise-grade intelligence across every vertical.
        </p>

        <StackGroup label="Google Cloud AI" icon="☁" products={GCLOUD_PRODUCTS} color="var(--brand-cyan)" />
        <StackGroup label="Ethereum Stack" icon="⬡" products={ETH_PRODUCTS} color="var(--brand-blue-light)" />
        <StackGroup label="New Launches" icon="★" products={NEW_PRODUCTS} color="var(--brand-gold)" />
      </div>
    </section>
    </>
  );
}

