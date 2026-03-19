'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { formatPrice } from '@/lib/utils';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
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
          <button
            className={`add-trigger-btn ${added ? 'added' : ''}`}
            onClick={handleAdd}
            disabled={added}
            aria-label={added ? 'Added to bag' : `Add ${product.name} to bag`}
          >
            {added ? '✓ Added' : 'Add To Bag'}
          </button>
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
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .product-card-archival:hover .product-img {
          transform: scale(1.06);
        }
        .featured-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: rgba(192, 82, 42, 0.92);
          backdrop-filter: blur(8px);
          color: #f5edd6;
          font-family: var(--font-cinzel);
          font-size: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          padding: 5px 10px;
          font-weight: 700;
          border-radius: 2px;
        }
        .content-area {
          padding: 1.25rem 1.25rem 1rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        .meta-top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.6rem;
        }
        .category-tag {
          font-family: var(--font-cinzel);
          font-size: 0.48rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--gold);
          font-weight: 800;
        }
        .unit-tag {
          font-family: var(--font-montserrat);
          font-size: 0.58rem;
          color: var(--muted);
          font-weight: 600;
        }
        .product-name-link { text-decoration: none; }
        .product-name {
          font-family: var(--font-cinzel);
          font-size: clamp(0.95rem, 2.5vw, 1.2rem);
          color: var(--white);
          margin-bottom: 0.5rem;
          letter-spacing: 0.04em;
          font-weight: 700;
          line-height: 1.2;
          transition: color 0.3s;
        }
        .product-name-link:hover .product-name { color: var(--gold); }
        .product-desc-short {
          font-family: var(--font-montserrat);
          font-size: 0.73rem;
          color: var(--muted);
          line-height: 1.6;
          margin-bottom: 1rem;
          flex-grow: 1;
        }
        .price-action {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding-top: 1rem;
          border-top: 1px solid rgba(192, 82, 42, 0.08);
          flex-wrap: wrap;
        }
        .product-price {
          font-family: var(--font-cinzel);
          font-size: 1rem;
          color: var(--gold);
          font-weight: 800;
        }
        .add-trigger-btn {
          background: none;
          border: 1.5px solid var(--gold);
          color: var(--gold);
          padding: 9px 14px;
          font-family: var(--font-cinzel);
          font-size: 0.58rem;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          font-weight: 900;
          border-radius: 3px;
          cursor: pointer;
          transition: var(--transition);
          min-height: 40px;
          white-space: nowrap;
          -webkit-tap-highlight-color: transparent;
        }
        .add-trigger-btn:hover,
        .add-trigger-btn.added {
          background: var(--gold);
          color: #f5edd6;
        }
        .add-trigger-btn:disabled { opacity: 0.75; cursor: default; }
      `}</style>
    </div>
  );
}
