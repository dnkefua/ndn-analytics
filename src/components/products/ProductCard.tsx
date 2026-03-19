import type { Product } from '../../types';
import './ProductCard.css';

interface Props {
  product: Product;
}

const STACK_COLORS: Record<string, string> = {
  gcloud: 'var(--brand-cyan)',
  ethereum: 'var(--brand-blue)',
  new: 'var(--brand-gold)',
};

export default function ProductCard({ product }: Props) {
  const color = STACK_COLORS[product.stack];

  return (
    <div className="product-card" style={{ '--accent': color } as React.CSSProperties}>
      <div className="product-card-top-line" />
      <div className="product-card-header">
        <span className="product-number">{product.number}</span>
        <span className="product-badge">{product.badge}</span>
      </div>
      <div className="product-icon">{product.icon}</div>
      <h3 className="product-name">{product.name}</h3>
      <p className="product-desc">{product.description}</p>
      <ul className="product-features">
        {product.features.map(f => (
          <li key={f}>
            <span className="feature-dot" />
            {f}
          </li>
        ))}
      </ul>
      <div className="product-card-footer">
        <button className="btn btn-ghost" style={{ fontSize: '0.7rem', padding: '7px 16px' }}>
          Learn More →
        </button>
      </div>
    </div>
  );
}
