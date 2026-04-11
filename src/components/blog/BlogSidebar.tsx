import { Link } from 'react-router-dom';
import { PRODUCTS } from '../products/productData';
import NewsletterSignup from '../newsletter/NewsletterSignup';
import type { BlogPost } from './blogData';

interface Props {
  post: BlogPost;
}

export default function BlogSidebar({ post }: Props) {
  const relatedProducts = post.relatedProducts
    ?.map(id => PRODUCTS.find(p => p.id === id))
    .filter(Boolean) ?? [];

  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div style={{
          background: 'rgba(6,182,212,0.04)',
          border: '1px solid rgba(6,182,212,0.15)',
          borderRadius: 12,
          padding: 24,
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono Variable', monospace",
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            color: 'var(--text-tertiary)',
            marginBottom: 16,
            textTransform: 'uppercase',
          }}>
            Related Products
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {relatedProducts.map(product => product && (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                style={{
                  display: 'block',
                  padding: 16,
                  background: 'rgba(10,22,40,0.6)',
                  borderRadius: 8,
                  border: '1px solid var(--border-subtle)',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = 'rgba(6,182,212,0.4)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  fontFamily: "'JetBrains Mono Variable', monospace",
                  fontSize: '0.65rem',
                  color: 'var(--brand-cyan)',
                  marginBottom: 4,
                }}>
                  {product.number}
                </div>
                <div style={{
                  fontFamily: "'Syne Variable', sans-serif",
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: 6,
                }}>
                  {product.name}
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                }}>
                  {product.tagline}
                </div>
                <div style={{
                  marginTop: 10,
                  fontSize: '0.75rem',
                  color: 'var(--brand-cyan)',
                  fontFamily: "'JetBrains Mono Variable', monospace",
                }}>
                  Learn more →
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Demo CTA */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(168,85,247,0.08))',
        border: '1px solid rgba(6,182,212,0.2)',
        borderRadius: 12,
        padding: 24,
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: "'Syne Variable', sans-serif",
          fontSize: '1.1rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 8,
        }}>
          Ready to get started?
        </div>
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          marginBottom: 16,
          lineHeight: 1.6,
        }}>
          Book a demo and see how NDN Analytics can transform your operations.
        </p>
        <Link
          to="/contact"
          className="btn btn-primary"
          style={{ width: '100%', textAlign: 'center' }}
        >
          Book a Demo
        </Link>
      </div>

      {/* Newsletter */}
      <div style={{
        background: 'rgba(10,22,40,0.6)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 12,
        padding: 24,
      }}>
        <div style={{
          fontFamily: "'Syne Variable', sans-serif",
          fontSize: '1rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 8,
        }}>
          Stay ahead
        </div>
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          marginBottom: 16,
          lineHeight: 1.6,
        }}>
          Get enterprise AI and blockchain insights delivered monthly.
        </p>
        <NewsletterSignup source="blog" />
      </div>

      {/* Content Upgrade CTA (if available) */}
      {post.contentUpgrade && (
        <div style={{
          background: 'rgba(168,85,247,0.06)',
          border: '1px solid rgba(168,85,247,0.2)',
          borderRadius: 12,
          padding: 24,
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono Variable', monospace",
            fontSize: '0.65rem',
            letterSpacing: '0.1em',
            color: 'rgba(168,85,247,0.8)',
            marginBottom: 8,
            textTransform: 'uppercase',
          }}>
            Free Resource
          </div>
          <div style={{
            fontFamily: "'Syne Variable', sans-serif",
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 8,
          }}>
            {post.contentUpgrade.title}
          </div>
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            marginBottom: 16,
            lineHeight: 1.6,
          }}>
            {post.contentUpgrade.description}
          </p>
          <button
            className="btn"
            style={{
              width: '100%',
              background: 'rgba(168,85,247,0.15)',
              border: '1px solid rgba(168,85,247,0.3)',
              color: 'var(--text-primary)',
            }}
            data-content-upgrade={post.contentUpgrade.downloadId}
          >
            Download Free →
          </button>
        </div>
      )}
    </aside>
  );
}
