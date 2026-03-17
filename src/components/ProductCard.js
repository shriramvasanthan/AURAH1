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
        <Link href={`/products/${product.id}`}>
          <Image 
            src={product.image || 'https://placehold.co/600x600/F5EDD6/2C1A0E?text=' + product.name} 
            alt={product.name} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
        
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc-short">{product.description?.substring(0, 60)}...</p>
        
        <div className="price-action">
          <span className="product-price">{formatPrice(product.price)}</span>
          <button 
            className={`add-trigger-btn ${added ? 'added' : ''}`}
            onClick={handleAdd}
            disabled={added}
          >
            {added ? 'Successfully Added ✓' : 'Add To Bag'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .product-card-archival {
          background: #faf4e8;
          border: 1px solid rgba(192, 82, 42, 0.12);
          border-radius: 4px;
          overflow: hidden;
          transition: var(--transition);
          display: flex;
          flex-direction: column;
        }
        .product-card-archival:hover {
          transform: translateY(-8px);
          box-shadow: var(--glow);
          border-color: rgba(192, 82, 42, 0.3);
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
          transition: transform 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .product-card-archival:hover .product-img {
          transform: scale(1.08);
        }
        .featured-badge {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          background: rgba(192, 82, 42, 0.9);
          backdrop-filter: blur(8px);
          color: #f5edd6;
          font-family: var(--font-cinzel);
          font-size: 0.55rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          padding: 6px 12px;
          font-weight: 700;
          border-radius: 2px;
        }
        .content-area {
          padding: 2rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        .meta-top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .category-tag {
          font-family: var(--font-cinzel);
          font-size: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--gold);
          font-weight: 800;
        }
        .unit-tag {
          font-family: var(--font-montserrat);
          font-size: 0.6rem;
          color: var(--muted);
          font-weight: 600;
        }
        .product-name {
          font-family: var(--font-cinzel);
          font-size: 1.25rem;
          color: var(--white);
          margin-bottom: 0.8rem;
          letter-spacing: 0.05em;
          font-weight: 700;
        }
        .product-desc-short {
          font-family: var(--font-montserrat);
          font-size: 0.75rem;
          color: var(--muted);
          line-height: 1.6;
          margin-bottom: 2rem;
          flex-grow: 1;
        }
        .price-action {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(192, 82, 42, 0.08);
        }
        .product-price {
          font-family: var(--font-cinzel);
          font-size: 1rem;
          color: var(--gold);
          font-weight: 800;
        }
        .add-trigger-btn {
          background: none;
          border: 1px solid var(--gold);
          color: var(--gold);
          padding: 8px 16px;
          font-family: var(--font-cinzel);
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-weight: 900;
          border-radius: 2px;
          cursor: pointer;
          transition: var(--transition);
        }
        .add-trigger-btn:hover, .add-trigger-btn.added {
          background: var(--gold);
          color: #f5edd6;
        }
      `}</style>
    </div>
  );
}
