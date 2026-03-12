'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="product-card">
      {product.featured && <div className="featured-tag">✦ Featured</div>}
      <Link href={`/products/${product.id}`} className="card-image-wrap">
        <div className="card-image-inner">
          <img
            src={product.image}
            alt={product.name}
            className="card-img"
            onError={(e) => {
              e.target.src = `https://placehold.co/400x300/E5D9B8/8B3C1E?text=${encodeURIComponent(product.name)}`;
            }}
          />
          <div className="image-overlay" />
        </div>
      </Link>
      <div className="card-body">
        <div className="card-category">{product.category}</div>
        <Link href={`/products/${product.id}`} className="card-name">{product.name}</Link>
        <p className="card-desc">{product.description.slice(0, 80)}...</p>
        <div className="card-footer">
          <div className="card-price-wrap">
            <span className="card-price">${product.price.toFixed(2)}</span>
            <span className="card-unit">/ {product.unit}</span>
          </div>
          {product.stock > 0 ? (
            <button className={`add-btn ${added ? 'added' : ''}`} onClick={handleAdd}>
              {added ? '✓ Added' : 'Add to Cart'}
            </button>
          ) : (
            <span className="out-of-stock">Out of Stock</span>
          )}
        </div>
      </div>

    </div>
  );
}
