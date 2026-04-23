import { useParams, Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { PRODUCTS } from './productData';
import SEO from '../seo/SEO';
import ProductSchema from '../seo/ProductSchema';
import './ProductDetail.css';

const STACK_COLORS: Record<string, string> = {
  gcloud: '#06B6D4',
  ethereum: '#4F46E5',
  new: '#F59E0B',
};

const STACK_LABELS: Record<string, string> = {
  gcloud: '☁ Google Cloud AI',
  ethereum: '⬡ Ethereum',
  new: '★ New Launch',
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const heroRef = useRef<HTMLDivElement>(null);

  const product = PRODUCTS.find(p => p.id === id);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    const videoEl = document.querySelector('.pd-media-video') as HTMLVideoElement;
    if (videoEl) videoEl.playbackRate = 2;
  });

  if (!product) {
    return (
      <>
        <SEO
          title="Product Not Found"
          description="The product you're looking for doesn't exist."
          canonicalPath="/products"
        />
        <div className="pd-notfound">
          <p>Product not found.</p>
          <Link to="/products" className="btn btn-primary">← Back to Products</Link>
        </div>
      </>
    );
  }

  const stackKeyword = product.stack === 'gcloud' ? 'Google Cloud AI' : product.stack === 'ethereum' ? 'Ethereum blockchain' : 'AI, Web3';
  const keywords = `${product.name}, ${stackKeyword}, ${product.industries?.join(', ')}, enterprise software`;
  const color = STACK_COLORS[product.stack];
  const currentIndex = PRODUCTS.findIndex(p => p.id === id);
  const prevProduct = PRODUCTS[currentIndex - 1];
  const nextProduct = PRODUCTS[currentIndex + 1];

  return (
    <>
      <SEO
        title={product.name}
        description={product.description}
        keywords={keywords}
        canonicalPath={`/products/${product.id}`}
        type="product"
        product={{
          name: product.name,
          description: product.description,
          stack: product.stack,
        }}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Products', path: '/products' },
          { name: product.name, path: `/products/${product.id}` },
        ]}
      />
      <ProductSchema product={product} />
      <div className="pd-wrapper" style={{ '--accent': color } as React.CSSProperties}>

      {/* ── HERO ── */}
      <section className="pd-hero" ref={heroRef}>
        <div className="pd-hero-glow" />
        <div className="container">
          <Link to="/products" className="pd-back-link">← All Products</Link>

          <div className="pd-hero-content">
            <div className="pd-hero-left">
              <span className="pd-stack-label">{STACK_LABELS[product.stack]}</span>
              <div className="pd-number">{product.number}</div>
              <h1 className="pd-title">{product.name}</h1>
              {product.tagline && (
                <p className="pd-tagline">{product.tagline}</p>
              )}
              <p className="pd-description">{product.description}</p>

              <div className="pd-hero-actions">
                <Link to="/contact" className="btn btn-primary">Book a Demo</Link>
                {product.website ? (
                  <a href={product.website} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                    Visit Website →
                  </a>
                ) : (
                  <Link to="/contact" className="btn btn-ghost">Talk to Sales →</Link>
                )}
              </div>
            </div>

            <div className="pd-hero-right">
              <div className="pd-icon-display">
                <span className="pd-big-icon">{product.icon}</span>
                <div className="pd-icon-ring pd-ring-1" />
                <div className="pd-icon-ring pd-ring-2" />
                <div className="pd-icon-ring pd-ring-3" />
              </div>
            </div>
          </div>
        </div>
      </section>

       {/* ── MEDIA SHOWCASE ── */}
       {product.media && (
         <section className="pd-media-showcase">
           <div className="container">
             {product.media.video && (product.media.video.toLowerCase().endsWith('.mp4') || product.media.video.toLowerCase().endsWith('.webm')) ? (
               <video
                 src={product.media.video}
                 controls
                 autoPlay
                 muted
                 loop
                 playsInline
                 poster={product.media.image}
                 className="pd-media-video"
               />
             ) : (product.media.video && product.media.video.toLowerCase().endsWith('.gif')) || product.media.image ? (
               <img
                 src={product.media.video && product.media.video.toLowerCase().endsWith('.gif') ? product.media.video : product.media.image}
                 alt={`${product.name} demo`}
                 className="pd-media-image"
                 loading="lazy"
               />
             ) : null}
           </div>
         </section>
       )}

      {/* ── METRICS STRIP ── */}
      {product.metrics && (
        <section className="pd-metrics-strip">
          <div className="container">
            <div className="pd-metrics-grid">
              {product.metrics.map((m, i) => (
                <div className="pd-metric" key={i}>
                  <span className="pd-metric-dot" />
                  {m}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURES + HOW IT WORKS ── */}
      <section className="pd-body">
        <div className="container">
          <div className="pd-body-grid">

            {/* Features */}
            <div className="pd-features-col">
              <h2 className="pd-section-title">Key Capabilities</h2>
              <div className="pd-features-list">
                {product.features.map((f, i) => (
                  <div className="pd-feature-item" key={i}>
                    <div className="pd-feature-num">0{i + 1}</div>
                    <div className="pd-feature-text">{f}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* How it works */}
            {product.howItWorks && (
              <div className="pd-how-col">
                <h2 className="pd-section-title">How It Works</h2>
                <div className="pd-how-card">
                  <p>{product.howItWorks}</p>
                </div>

                {product.industries && (
                  <>
                    <h3 className="pd-sub-title">Industries</h3>
                    <div className="pd-industries">
                      {product.industries.map((ind, i) => (
                        <span className="pd-industry-tag" key={i}>{ind}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── USE CASES ── */}
      {product.useCases && (
        <section className="pd-usecases">
          <div className="container">
            <h2 className="pd-section-title pd-section-title--center">Use Cases</h2>
            <div className="pd-usecases-grid">
              {product.useCases.map((uc, i) => (
                <div className="pd-usecase-card" key={i}>
                  <div className="pd-usecase-num">{String(i + 1).padStart(2, '0')}</div>
                  <p>{uc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA BANNER ── */}
      <section className="pd-cta-banner">
        <div className="container">
          <div className="pd-cta-inner">
            <div>
              <h2 className="pd-cta-title">Ready to deploy {product.name}?</h2>
              <p className="pd-cta-sub">Talk to our team and get a tailored demo for your organization.</p>
            </div>
            <div className="pd-cta-actions">
              <Link to="/contact" className="btn btn-primary">Book a Demo</Link>
              <Link to="/contact" className="btn btn-ghost">Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── PREV / NEXT NAV ── */}
      <section className="pd-sibling-nav">
        <div className="container">
          <div className="pd-siblings">
            {prevProduct ? (
              <Link to={`/products/${prevProduct.id}`} className="pd-sibling pd-sibling--prev">
                <span className="pd-sibling-dir">← Previous</span>
                <span className="pd-sibling-name">{prevProduct.name}</span>
              </Link>
            ) : <div />}

            <Link to="/products" className="pd-sibling-all">All Products</Link>

            {nextProduct ? (
              <Link to={`/products/${nextProduct.id}`} className="pd-sibling pd-sibling--next">
                <span className="pd-sibling-dir">Next →</span>
                <span className="pd-sibling-name">{nextProduct.name}</span>
              </Link>
            ) : <div />}
          </div>
        </div>
      </section>

    </div>
    </>
  );
}
