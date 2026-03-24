'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { formatPrice } from '@/lib/utils';

const WHATSAPP_NUMBER = '917867899091';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWhatsAppOrder = () => {
    const msg = `🌿 *AURAH Order*\n\nI'd like to order:\n• ${product.name} (${product.unit}) — ${formatPrice(product.price)}\n\nPlease confirm availability.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="product-card-archival">
      <div className="image-wrapper">
        <Link href={`/products/${product.id}`} tabIndex={-1}>
          <Image
            src={product.image || 'https://placehold.co/600x600/F5EDD6/2C1A0E?text=' + encodeURIComponent(product.name)}
            alt={product.name}
            fill
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="product-img"
            style={{ objectFit: 'cover' }}
          />
        </Link>
        {product.featured && <div className="featured-badge">Featured ✦</div>}
        {product.stock !== undefined && product.stock < 10 && product.stock > 0 && (
          <div className="low-stock-badge">Only {product.stock} left</div>
        )}
        {product.stock === 0 && (
          <div className="out-of-stock-overlay">Out of Stock</div>
        )}
      </div>

      <div className="content-area">
        <div className="meta-top">
          <span className="category-tag">{product.category}</span>
          <span className="unit-tag">{product.unit}</span>
        </div>

        <Link href={`/products/${product.id}`} className="product-name-link">
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <p className="product-desc-short">{product.description?.substring(0, 65)}…</p>

        <div className="price-action">
          <span className="product-price">{formatPrice(product.price)}</span>
          <div className="action-btns">
            <button
              className={`add-trigger-btn ${added ? 'added' : ''}`}
              onClick={handleAdd}
              disabled={added || product.stock === 0}
              aria-label={added ? 'Added to bag' : `Add ${product.name} to bag`}
            >
              {added ? '✓ Added' : product.stock === 0 ? 'Out of Stock' : 'Add To Bag'}
            </button>
            <button
              className="wa-quick-btn"
              onClick={handleWhatsAppOrder}
              aria-label="Order via WhatsApp"
              title="Order via WhatsApp"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .product-card-archival {
          background: #faf4e8;
          border: 1px solid rgba(192, 82, 42, 0.12);
          border-radius: 6px;
          overflow: hidden;
          transition: var(--transition);
          display: flex;
          flex-direction: column;
        }
        .product-card-archival:hover {
          transform: translateY(-6px);
          box-shadow: var(--glow);
          border-color: rgba(192, 82, 42, 0.28);
        }
        .image-wrapper {
          position: relative;
          aspect-ratio: 1/1;
          overflow: hidden;
          background: var(--dark);
        }
        .product-img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.7s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .product-card-archival:hover .product-img { transform: scale(1.06); }
        .featured-badge {
          position: absolute; top: 1rem; left: 1rem;
          background: rgba(192, 82, 42, 0.92);
          backdrop-filter: blur(8px);
          color: #f5edd6;
          font-family: var(--font-cinzel); font-size: 0.5rem;
          text-transform: uppercase; letter-spacing: 0.2em;
          padding: 5px 10px; font-weight: 700; border-radius: 2px;
        }
        .low-stock-badge {
          position: absolute; bottom: 1rem; right: 1rem;
          background: rgba(220,80,20,0.85);
          color: #fff; font-size: 0.55rem; font-weight: 700;
          padding: 4px 8px; border-radius: 2px;
          text-transform: uppercase; letter-spacing: 0.1em;
        }
        .out-of-stock-overlay {
          position: absolute; inset: 0;
          background: rgba(44,26,14,0.6);
          display: flex; align-items: center; justify-content: center;
          color: #f5edd6; font-family: var(--font-cinzel);
          font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase;
        }
        .content-area {
          padding: 1.25rem 1.25rem 1rem;
          flex-grow: 1; display: flex; flex-direction: column;
        }
        .meta-top { display: flex; justify-content: space-between; margin-bottom: 0.6rem; }
        .category-tag {
          font-family: var(--font-cinzel); font-size: 0.48rem;
          text-transform: uppercase; letter-spacing: 0.2em;
          color: var(--gold); font-weight: 800;
        }
        .unit-tag { font-size: 0.58rem; color: var(--muted); font-weight: 600; }
        .product-name-link { text-decoration: none; }
        .product-name {
          font-family: var(--font-cinzel);
          font-size: clamp(0.95rem, 2.5vw, 1.2rem);
          color: var(--white); margin-bottom: 0.5rem;
          letter-spacing: 0.04em; font-weight: 700;
          line-height: 1.2; transition: color 0.3s;
        }
        .product-name-link:hover .product-name { color: var(--gold); }
        .product-desc-short {
          font-size: 0.73rem; color: var(--muted);
          line-height: 1.6; margin-bottom: 1rem; flex-grow: 1;
        }
        .price-action {
          display: flex; align-items: center;
          justify-content: space-between; gap: 8px;
          padding-top: 1rem;
          border-top: 1px solid rgba(192, 82, 42, 0.08);
          flex-wrap: wrap;
        }
        .product-price {
          font-family: var(--font-cinzel);
          font-size: 1rem; color: var(--gold); font-weight: 800;
        }
        .action-btns { display: flex; gap: 6px; align-items: center; }
        .add-trigger-btn {
          background: none;
          border: 1.5px solid var(--gold);
          color: var(--gold);
          padding: 9px 14px;
          font-family: var(--font-cinzel); font-size: 0.58rem;
          text-transform: uppercase; letter-spacing: 0.18em;
          font-weight: 900; border-radius: 3px; cursor: pointer;
          transition: var(--transition); min-height: 40px;
          white-space: nowrap; -webkit-tap-highlight-color: transparent;
        }
        .add-trigger-btn:hover, .add-trigger-btn.added {
          background: var(--gold); color: #f5edd6;
        }
        .add-trigger-btn:disabled { opacity: 0.75; cursor: default; }
        .wa-quick-btn {
          width: 40px; height: 40px; border-radius: 3px;
          background: #25d366; border: none; color: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: opacity 0.2s; flex-shrink: 0;
        }
        .wa-quick-btn:hover { opacity: 0.85; }
      `}</style>
    </div>
  );
}