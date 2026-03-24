'use client';
import { useCart } from '@/context/CartContext';

export default function CartButton() {
  const { totalItems, setIsOpen } = useCart();

  return (
    <button
      className="cart-nav-btn"
      onClick={() => setIsOpen(true)}
      aria-label={`Open cart, ${totalItems} items`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
      {totalItems > 0 && (
        <span className="cart-badge">{totalItems > 99 ? '99+' : totalItems}</span>
      )}
      <style jsx>{`
        .cart-nav-btn {
          position: relative;
          background: none;
          border: none;
          color: var(--white, #f5edd6);
          cursor: pointer;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 3px;
          transition: color 0.2s;
        }
        .cart-nav-btn:hover { color: var(--gold, #c0522a); }
        .cart-badge {
          position: absolute;
          top: -2px;
          right: -4px;
          background: #c0522a;
          color: #f5edd6;
          font-size: 0.55rem;
          font-weight: 700;
          min-width: 16px;
          height: 16px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 3px;
          line-height: 1;
        }
      `}</style>
    </button>
  );
}