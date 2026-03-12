'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQty, clearCart, total, itemCount } = useCart();
  const { user } = useAuth();
  const [form, setForm] = useState({ customerName: '', email: '', phone: '', address: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  // Auto-fill form from logged-in user
  useEffect(() => {
    if (user) {
      setForm({
        customerName: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart.length) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          userId: user?.id || null,
          items: cart.map((i) => ({ productId: i.id, quantity: i.quantity })),
        }),
      });
      if (!res.ok) throw new Error('Order failed');
      const order = await res.json();
      setSuccess(order);
      clearCart();
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="success-page">
        <div className="success-card">
          <div className="success-icon">✦</div>
          <h1 className="success-title">Order Placed!</h1>
          <p className="success-sub">Thank you, <strong>{success.customerName}</strong>.</p>
          <p className="success-desc">
            Your order <strong>#{success.id}</strong> has been received and is being processed.<br />
            Confirmation will be sent to <strong>{success.email}</strong>.
          </p>
          <div className="success-total">Total Paid: <span className="gold-text-static">${success.total.toFixed(2)}</span></div>
          <Link href="/products" className="btn-gold" style={{ marginTop: '32px', display: 'inline-flex' }}>
            Continue Shopping
          </Link>
        </div>
        <style>{`
          .success-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 120px 20px;
            background: radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%), var(--black);
          }
          .success-card {
            max-width: 560px;
            width: 100%;
            background: #FAF4E8;
            border: 1px solid rgba(192,82,42,0.3);
            border-radius: 4px;
            padding: 60px 48px;
            text-align: center;
            animation: fadeInUp 0.6s ease;
            box-shadow: 0 8px 40px rgba(44, 26, 14, 0.12);
          }
          .success-icon {
            font-size: 4rem;
            color: var(--gold);
            animation: pulse-glow 2s ease-in-out infinite;
            margin-bottom: 24px;
          }
          .success-title {
            font-size: 2.5rem;
            margin-bottom: 12px;
            background: linear-gradient(135deg, var(--gold-dark), var(--gold), var(--gold-shimmer));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .success-sub { font-size: 1rem; color: var(--muted); margin-bottom: 16px; }
          .success-desc { color: var(--muted); font-size: 0.88rem; line-height: 1.8; margin-bottom: 16px; }
          .success-total {
            font-family: var(--font-display);
            font-size: 1rem;
            color: var(--muted);
            letter-spacing: 0.1em;
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div className="cart-page">
        <div className="page-header">
          <div className="page-header-bg" />
          <div className="container">
            <div className="section-label" style={{ justifyContent: 'center' }}>Your Selection</div>
            <h1 className="page-title">
              Shopping <span className="gold-text">Cart</span>
            </h1>
          </div>
        </div>

        <div className="container cart-content">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-icon">✦</div>
              <h2>Your cart is empty</h2>
              <p>Discover our premium spices and nuts collection</p>
              <Link href="/products" className="btn-gold" style={{ marginTop: '24px', display: 'inline-flex' }}>
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="cart-layout">
              {/* Cart Items */}
              <div className="cart-items">
                <div className="cart-header">
                  <span>Product</span>
                  <span>Price</span>
                  <span>Qty</span>
                  <span>Total</span>
                </div>
                {cart.map((item) => (
                  <div key={item.id} className="cart-row">
                    <div className="cart-item-info">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-item-img"
                        onError={(e) => {
                          e.target.src = `https://placehold.co/80x80/1E1E1E/C9A84C?text=${encodeURIComponent(item.name[0])}`;
                        }}
                      />
                      <div>
                        <div className="cart-item-name">{item.name}</div>
                        <div className="cart-item-unit">{item.unit}</div>
                      </div>
                    </div>
                    <div className="cart-item-price">${item.price.toFixed(2)}</div>
                    <div className="qty-controls-small">
                      <button onClick={() => updateQty(item.id, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <div className="cart-item-total gold-text-static">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>×</button>
                  </div>
                ))}
                <button className="clear-btn" onClick={clearCart}>Clear Cart</button>
              </div>

              {/* Checkout */}
              <div className="checkout-panel">
                <div className="order-summary">
                  <h3 className="summary-title">Order Summary</h3>
                  <div className="summary-row">
                    <span>Items ({itemCount})</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span className="gold-text-static">FREE</span>
                  </div>
                  <div className="summary-divider" />
                  <div className="summary-row total-row">
                    <span>Total</span>
                    <span className="gold-text">${total.toFixed(2)}</span>
                  </div>
                </div>

                <form className="checkout-form" onSubmit={handleSubmit}>
                  <h3 className="checkout-title">Delivery Details</h3>
                  {[
                    { name: 'customerName', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
                    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
                    { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 234 567 8901' },
                  ].map((field) => (
                    <div className="form-group" key={field.name}>
                      <label className="form-label">{field.label}</label>
                      <input
                        className="form-input"
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={form[field.name]}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  ))}
                  <div className="form-group">
                    <label className="form-label">Delivery Address</label>
                    <textarea
                      className="form-textarea"
                      name="address"
                      placeholder="Enter your full delivery address..."
                      value={form.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {error && <p className="form-error">{error}</p>}
                  <button type="submit" className="btn-gold submit-btn" disabled={submitting}>
                    {submitting ? 'Placing Order...' : 'Place Order'}
                    {!submitting && (
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .cart-page { min-height: 100vh; }
        .page-header {
          padding: 140px 0 60px;
          position: relative;
          overflow: hidden;
          text-align: center;
        }
        .page-header-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 100%, rgba(192,82,42,0.07) 0%, transparent 70%);
          border-bottom: 1px solid rgba(192,82,42,0.1);
        }
        .page-title { font-size: clamp(2rem, 5vw, 4rem); }
        .cart-content { padding-top: 60px; padding-bottom: 100px; }
        .cart-layout {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 48px;
          align-items: start;
        }
        .cart-header {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 16px;
          padding: 12px 16px;
          font-family: var(--font-display);
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold-dark);
          border-bottom: 1px solid rgba(192,82,42,0.15);
          margin-bottom: 4px;
        }
        .cart-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr auto;
          gap: 16px;
          align-items: center;
          padding: 20px 16px;
          border-bottom: 1px solid rgba(192,82,42,0.08);
          transition: background 0.2s;
        }
        .cart-row:hover { background: rgba(192,82,42,0.03); }
        .cart-item-info { display: flex; align-items: center; gap: 16px; }
        .cart-item-img {
          width: 64px;
          height: 64px;
          object-fit: cover;
          border-radius: 3px;
          border: 1px solid rgba(192,82,42,0.12);
        }
        .cart-item-name { font-family: var(--font-display); font-size: 0.88rem; color: var(--white); margin-bottom: 4px; }
        .cart-item-unit { font-size: 0.72rem; color: var(--muted); }
        .cart-item-price { font-size: 0.9rem; color: var(--muted); }
        .qty-controls-small {
          display: flex;
          align-items: center;
          border: 1.5px solid rgba(192,82,42,0.2);
          border-radius: 2px;
          overflow: hidden;
          font-size: 0.85rem;
        }
        .qty-controls-small button {
          width: 30px;
          height: 30px;
          background: var(--dark-3);
          border: none;
          color: var(--gold);
          cursor: pointer;
          font-size: 1rem;
        }
        .qty-controls-small span {
          width: 36px;
          text-align: center;
          background: var(--dark-2);
          line-height: 30px;
          font-size: 0.85rem;
        }
        .cart-item-total { font-family: var(--font-display); font-size: 0.95rem; font-weight: 700; }
        .remove-btn {
          background: none;
          border: none;
          color: var(--muted);
          font-size: 1.3rem;
          cursor: pointer;
          transition: color 0.2s;
          line-height: 1;
          padding: 0 4px;
        }
        .remove-btn:hover { color: #F87171; }
        .clear-btn {
          margin-top: 16px;
          background: none;
          border: none;
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          cursor: pointer;
          transition: color 0.3s;
          padding: 8px 0;
        }
        .clear-btn:hover { color: #F87171; }
        .checkout-panel {
          position: sticky;
          top: 90px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .order-summary {
          background: #FAF4E8;
          border: 1px solid rgba(192,82,42,0.2);
          border-radius: 4px;
          padding: 28px;
          box-shadow: 0 2px 12px rgba(44, 26, 14, 0.06);
        }
        .summary-title, .checkout-title {
          font-family: var(--font-display);
          font-size: 0.75rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 20px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.88rem;
          padding: 8px 0;
          color: rgba(245,240,232,0.7);
        }
        .summary-divider { height: 1px; background: rgba(192,82,42,0.15); margin: 12px 0; }
        .total-row { font-size: 1.05rem; font-weight: 600; color: var(--white); }
        .checkout-form {
          background: #FAF4E8;
          border: 1px solid rgba(192,82,42,0.15);
          border-radius: 4px;
          padding: 28px;
          box-shadow: 0 2px 12px rgba(44, 26, 14, 0.06);
        }
        .submit-btn { width: 100%; justify-content: center; margin-top: 8px; }
        .form-error { color: #F87171; font-size: 0.8rem; margin-bottom: 12px; }
        .empty-cart {
          text-align: center;
          padding: 80px 20px;
          color: var(--muted);
        }
        .empty-icon { font-size: 4rem; color: rgba(201,168,76,0.2); margin-bottom: 24px; }
        .empty-cart h2 { font-family: var(--font-display); font-size: 1.8rem; color: var(--white); margin-bottom: 8px; }
        @media (max-width: 1024px) {
          .cart-layout { grid-template-columns: 1fr; }
          .checkout-panel { position: static; }
        }
        @media (max-width: 640px) {
          .cart-header { display: none; }
          .cart-row { grid-template-columns: 1fr auto auto; grid-template-rows: auto auto; gap: 12px; }
          .cart-item-info { grid-column: 1 / -1; }
        }
      `}</style>
    </>
  );
}
