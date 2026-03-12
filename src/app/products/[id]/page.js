'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function ProductDetailPage({ params }) {
  const { id } = params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null; }
        return r.json();
      })
      .then((data) => {
        if (data) { setProduct(data); setLoading(false); }
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [id]);

  const handleAdd = () => {
    if (!product || product.stock < 1) return;
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="loading-icon">✦</div>
        <style>{`
                  .detail-loading {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--black);
                  }
                  .loading-icon {
                    font-size: 2rem;
                    color: var(--gold);
                    animation: pulse-glow 1.5s ease-in-out infinite;
                  }
                `}</style>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="not-found-page">
        <div className="not-found-icon">✦</div>
        <h1>Product Not Found</h1>
        <p>This product does not exist or has been removed.</p>
        <Link href="/products" className="btn-gold" style={{ marginTop: '28px', display: 'inline-flex' }}>
          Back to Products
        </Link>
        <style>{`
                  .not-found-page {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 40px 20px;
                    background: var(--black);
                  }
                  .not-found-icon { font-size: 4rem; color: rgba(192,82,42,0.3); margin-bottom: 24px; }
                  .not-found-page h1 { font-size: 2rem; color: var(--white); margin-bottom: 12px; }
                  .not-found-page p { color: var(--muted); font-size: 0.95rem; }
                `}</style>
      </div>
    );
  }

  const inStock = product.stock > 0;

  return (
    <>
      <div className="detail-page">
        {/* Breadcrumb */}
        <div className="breadcrumb-bar">
          <div className="container breadcrumb-inner">
            <Link href="/" className="breadcrumb-link">Home</Link>
            <span className="breadcrumb-sep">✦</span>
            <Link href="/products" className="breadcrumb-link">Products</Link>
            <span className="breadcrumb-sep">✦</span>
            <span className="breadcrumb-current">{product.name}</span>
          </div>
        </div>

        {/* Main content */}
        <div className="container detail-content">
          <div className="detail-grid">
            {/* Image */}
            <div className="detail-image-wrap">
              <div className="detail-image-card">
                {product.featured && (
                  <div className="detail-featured-badge">✦ Featured</div>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="detail-img"
                  onError={(e) => {
                    e.target.src = `https://placehold.co/600x500/E5D9B8/8B3C1E?text=${encodeURIComponent(product.name)}`;
                  }}
                />
              </div>
              {/* Stock indicator */}
              <div className={`stock-badge ${inStock ? 'in-stock' : 'out-stock'}`}>
                <span className="stock-dot" />
                {inStock ? `In Stock — ${product.stock} units available` : 'Out of Stock'}
              </div>
            </div>

            {/* Info */}
            <div className="detail-info">
              <div className="detail-category">{product.category}</div>
              <h1 className="detail-name">{product.name}</h1>

              <div className="detail-price-row">
                <span className="detail-price">${product.price.toFixed(2)}</span>
                <span className="detail-unit">/ {product.unit}</span>
              </div>

              <div className="gold-divider" style={{ margin: '24px 0', marginLeft: 0, width: '60px' }} />

              <p className="detail-description">{product.description}</p>

              {/* Quality assurance */}
              <div className="quality-pills">
                {['Hand-Picked', 'Premium Quality', 'Authentic Source', 'Free Shipping'].map((tag) => (
                  <span key={tag} className="quality-pill">{tag}</span>
                ))}
              </div>

              {/* Quantity + Add to Cart */}
              {inStock ? (
                <div className="add-section">
                  <div className="qty-wrap">
                    <label className="qty-label">Quantity</label>
                    <div className="qty-controls">
                      <button
                        className="qty-btn"
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        aria-label="Decrease quantity"
                      >−</button>
                      <span className="qty-val">{qty}</span>
                      <button
                        className="qty-btn"
                        onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                        aria-label="Increase quantity"
                      >+</button>
                    </div>
                  </div>

                  <div className="cart-total-line">
                    Subtotal: <strong>${(product.price * qty).toFixed(2)}</strong>
                  </div>

                  <div className="add-actions">
                    <button
                      className={`btn-gold add-to-cart-btn ${added ? 'added' : ''}`}
                      onClick={handleAdd}
                    >
                      {added ? (
                        <>✓ Added to Cart</>
                      ) : (
                        <>
                          Add to Cart
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                          </svg>
                        </>
                      )}
                    </button>
                    <Link href="/cart" className="btn-outline view-cart-btn">
                      View Cart
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="out-of-stock-notice">
                  <span className="oos-icon">⚠</span>
                  This product is currently out of stock. Check back soon.
                </div>
              )}

              {/* Product meta */}
              <div className="product-meta">
                <div className="meta-row">
                  <span className="meta-label">Category</span>
                  <span className="meta-val">
                    <Link href={`/products?category=${product.category}`} className="meta-link">
                      {product.category}
                    </Link>
                  </span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Pack Size</span>
                  <span className="meta-val">{product.unit}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Product ID</span>
                  <span className="meta-val">AUR-{String(product.id).padStart(4, '0')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related products hint */}
          <div className="back-row">
            <Link href="/products" className="back-products-link">
              ← Browse all {product.category}
            </Link>
          </div>
        </div>
      </div>

      <style>{`
              .detail-page {
                min-height: 100vh;
                padding-bottom: 100px;
              }

              /* Breadcrumb */
              .breadcrumb-bar {
                padding-top: 100px;
                padding-bottom: 0;
                border-bottom: 1px solid rgba(192,82,42,0.1);
              }
              .breadcrumb-inner {
                padding-top: 20px;
                padding-bottom: 20px;
                display: flex;
                align-items: center;
                gap: 10px;
              }
              .breadcrumb-link {
                font-family: var(--font-display);
                font-size: 0.65rem;
                letter-spacing: 0.15em;
                text-transform: uppercase;
                color: var(--muted);
                text-decoration: none;
                transition: color 0.2s;
              }
              .breadcrumb-link:hover { color: var(--gold); }
              .breadcrumb-sep {
                font-size: 0.5rem;
                color: var(--gold);
                opacity: 0.5;
              }
              .breadcrumb-current {
                font-family: var(--font-display);
                font-size: 0.65rem;
                letter-spacing: 0.15em;
                text-transform: uppercase;
                color: var(--gold-dark);
                font-weight: 700;
              }

              /* Main layout */
              .detail-content {
                padding-top: 60px;
              }
              .detail-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 72px;
                align-items: start;
              }

              /* Image */
              .detail-image-wrap {
                position: sticky;
                top: 90px;
              }
              .detail-image-card {
                position: relative;
                border-radius: 8px;
                overflow: hidden;
                border: 1px solid rgba(192,82,42,0.15);
                box-shadow: 0 8px 40px rgba(44,26,14,0.1);
                aspect-ratio: 4/3;
              }
              .detail-img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);
                display: block;
              }
              .detail-image-card:hover .detail-img { transform: scale(1.04); }
              .detail-featured-badge {
                position: absolute;
                top: 16px; left: 16px;
                background: rgba(192,82,42,0.9);
                color: #FAF4E8;
                font-family: var(--font-display);
                font-size: 0.6rem;
                letter-spacing: 0.15em;
                font-weight: 700;
                padding: 5px 12px;
                border-radius: 2px;
                z-index: 2;
              }
              .stock-badge {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-top: 16px;
                font-family: var(--font-display);
                font-size: 0.7rem;
                letter-spacing: 0.1em;
                text-transform: uppercase;
              }
              .stock-dot {
                width: 8px; height: 8px;
                border-radius: 50%;
                flex-shrink: 0;
              }
              .in-stock { color: #15803D; }
              .in-stock .stock-dot { background: #22C55E; box-shadow: 0 0 8px rgba(34,197,94,0.4); }
              .out-stock { color: #B91C1C; }
              .out-stock .stock-dot { background: #EF4444; }

              /* Info panel */
              .detail-category {
                font-family: var(--font-display);
                font-size: 0.65rem;
                letter-spacing: 0.3em;
                text-transform: uppercase;
                color: var(--gold);
                margin-bottom: 12px;
              }
              .detail-name {
                font-size: clamp(1.8rem, 3vw, 2.8rem);
                color: var(--white);
                margin-bottom: 20px;
                line-height: 1.1;
              }
              .detail-price-row {
                display: flex;
                align-items: baseline;
                gap: 8px;
              }
              .detail-price {
                font-family: var(--font-display);
                font-size: 2.2rem;
                font-weight: 900;
                background: linear-gradient(135deg, var(--gold-dark), var(--gold), var(--gold-shimmer));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              }
              .detail-unit {
                font-size: 0.9rem;
                color: var(--muted);
              }
              .detail-description {
                font-size: 0.95rem;
                color: var(--muted);
                line-height: 1.8;
                margin-bottom: 24px;
              }

              /* Quality pills */
              .quality-pills {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-bottom: 32px;
              }
              .quality-pill {
                font-family: var(--font-display);
                font-size: 0.58rem;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                color: var(--gold-dark);
                border: 1px solid rgba(192,82,42,0.25);
                background: rgba(192,82,42,0.06);
                padding: 5px 12px;
                border-radius: 20px;
              }

              /* Quantity + add */
              .add-section { display: flex; flex-direction: column; gap: 20px; }
              .qty-wrap { display: flex; align-items: center; gap: 20px; }
              .qty-label {
                font-family: var(--font-display);
                font-size: 0.65rem;
                letter-spacing: 0.15em;
                text-transform: uppercase;
                color: var(--gold-dark);
                width: 70px;
                flex-shrink: 0;
              }
              .qty-controls {
                display: flex;
                align-items: center;
                border: 1.5px solid rgba(192,82,42,0.3);
                border-radius: 3px;
                overflow: hidden;
              }
              .qty-btn {
                width: 40px; height: 40px;
                background: var(--dark-2);
                border: none;
                color: var(--gold);
                font-size: 1.2rem;
                cursor: pointer;
                transition: background 0.2s;
                display: flex; align-items: center; justify-content: center;
              }
              .qty-btn:hover { background: var(--dark-3); }
              .qty-val {
                width: 52px;
                text-align: center;
                font-family: var(--font-display);
                font-size: 1rem;
                font-weight: 700;
                background: var(--dark);
                line-height: 40px;
                color: var(--white);
              }
              .cart-total-line {
                font-size: 0.88rem;
                color: var(--muted);
              }
              .cart-total-line strong {
                color: var(--gold-dark);
                font-family: var(--font-display);
                font-size: 1rem;
              }
              .add-actions {
                display: flex;
                gap: 12px;
              }
              .add-to-cart-btn {
                flex: 1;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s;
              }
              .add-to-cart-btn.added {
                background: linear-gradient(135deg, #15803D, #22C55E);
              }
              .view-cart-btn {
                cursor: pointer;
                white-space: nowrap;
              }

              .out-of-stock-notice {
                display: flex;
                align-items: center;
                gap: 12px;
                background: rgba(220,38,38,0.07);
                border: 1px solid rgba(220,38,38,0.2);
                color: #B91C1C;
                padding: 16px 20px;
                border-radius: 3px;
                font-size: 0.88rem;
                margin-top: 8px;
              }
              .oos-icon { font-size: 1.2rem; flex-shrink: 0; }

              /* Meta */
              .product-meta {
                margin-top: 32px;
                border-top: 1px solid rgba(192,82,42,0.1);
                padding-top: 24px;
              }
              .meta-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 0;
                border-bottom: 1px solid rgba(192,82,42,0.07);
                font-size: 0.85rem;
              }
              .meta-label {
                font-family: var(--font-display);
                font-size: 0.65rem;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                color: var(--muted);
              }
              .meta-val { color: var(--white); font-weight: 500; }
              .meta-link {
                color: var(--gold-dark);
                text-decoration: none;
                font-weight: 600;
                transition: color 0.2s;
              }
              .meta-link:hover { color: var(--gold); }

              /* Back row */
              .back-row {
                margin-top: 60px;
                padding-top: 40px;
                border-top: 1px solid rgba(192,82,42,0.1);
              }
              .back-products-link {
                font-family: var(--font-display);
                font-size: 0.72rem;
                letter-spacing: 0.15em;
                text-transform: uppercase;
                color: var(--muted);
                text-decoration: none;
                transition: color 0.3s;
              }
              .back-products-link:hover { color: var(--gold); }

              /* Responsive */
              @media (max-width: 900px) {
                .detail-grid {
                  grid-template-columns: 1fr;
                  gap: 40px;
                }
                .detail-image-wrap { position: static; }
              }
              @media (max-width: 480px) {
                .add-actions { flex-direction: column; }
                .quality-pills { gap: 6px; }
              }
            `}</style>
    </>
  );
}
