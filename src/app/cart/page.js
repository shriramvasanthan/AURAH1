'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { cart, removeFromCart, updateQty, clearCart, total, itemCount } = useCart();
  const { user } = useAuth();
  const [form, setForm] = useState({ customerName: '', email: '', phone: '', address: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);

  // UPI config – update your UPI ID here or via env
  const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID || 'aurah@upi';
  const MERCHANT_NAME = 'AURAH';

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
      setPendingOrder(order);
      setShowPayment(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentConfirm = () => {
    setSuccess(pendingOrder);
    clearCart();
    setShowPayment(false);
  };

  // Generate UPI QR URL
  const upiLink = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${(total || 0).toFixed(2)}&cu=INR&tn=${encodeURIComponent('AURAH Order Payment')}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiLink)}&color=2C1A0E&bgcolor=FAF4E8`;

  if (showPayment && pendingOrder) {
    return (
      <div className="success-page">
        <div className="success-card upi-card">
          <div className="upi-header">
            <div className="upi-icon">₹</div>
            <h1 className="success-title">Complete Payment</h1>
            <p className="success-sub">Order #{pendingOrder.id} · <strong>{formatPrice(pendingOrder.total)}</strong></p>
          </div>

          <div className="upi-body">
            <p className="upi-instruction">Scan the QR code below with any UPI app<br />(PhonePe, GPay, Paytm, BHIM…)</p>
            <div className="upi-qr-wrapper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrUrl} alt="UPI QR Code" className="upi-qr" width={220} height={220} />
            </div>
            <div className="upi-id-box">
              <span className="upi-id-label">UPI ID</span>
              <span className="upi-id-value">{UPI_ID}</span>
            </div>
            <a href={upiLink} className="upi-app-btn" rel="noopener noreferrer">
              ↗ Open in UPI App
            </a>
          </div>

          <div className="upi-footer">
            <p className="upi-note">After completing the payment, tap the button below to confirm your order.</p>
            <button className="btn-gold upi-confirm-btn" onClick={handlePaymentConfirm}>
              ✦ I Have Paid — Confirm Order
            </button>
            <button
              className="upi-cancel-link"
              onClick={() => { setShowPayment(false); setPendingOrder(null); }}
            >
              ← Go back and edit details
            </button>
          </div>
        </div>
        <style>{`
          .upi-card { max-width: 440px; padding: 40px 32px; }
          .upi-header { text-align: center; margin-bottom: 24px; }
          .upi-icon { font-size: 2.5rem; color: var(--gold); margin-bottom: 8px; line-height: 1; }
          .upi-body { display: flex; flex-direction: column; align-items: center; gap: 16px; margin-bottom: 28px; }
          .upi-instruction { text-align: center; font-size: 0.88rem; color: var(--muted); line-height: 1.6; }
          .upi-qr-wrapper {
            padding: 16px; background: #FAF4E8;
            border: 2px solid rgba(192,82,42,0.2);
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(44,26,14,0.08);
          }
          .upi-qr { display: block; border-radius: 4px; }
          .upi-id-box {
            display: flex; flex-direction: column; align-items: center; gap: 4px;
            padding: 12px 24px; background: rgba(192,82,42,0.06);
            border: 1px solid rgba(192,82,42,0.15); border-radius: 8px;
            width: 100%;
          }
          .upi-id-label { font-size: 0.55rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--muted); font-weight: 700; }
          .upi-id-value { font-family: var(--font-cinzel); font-size: 1.05rem; color: #2C1A0E; font-weight: 700; letter-spacing: 0.05em; }
          .upi-app-btn {
            display: inline-flex; align-items: center; gap: 8px;
            background: #2C1A0E; color: #FAF4E8;
            padding: 12px 28px; border-radius: 6px;
            font-family: var(--font-cinzel); font-size: 0.65rem; letter-spacing: 0.2em;
            text-decoration: none; text-transform: uppercase; font-weight: 700;
            transition: all 0.3s;
          }
          .upi-app-btn:hover { background: var(--gold); color: #2C1A0E; }
          .upi-footer { text-align: center; border-top: 1px solid rgba(192,82,42,0.1); padding-top: 24px; display: flex; flex-direction: column; align-items: center; gap: 12px; }
          .upi-note { font-size: 0.8rem; color: var(--muted); line-height: 1.6; }
          .upi-confirm-btn { width: 100%; justify-content: center; min-height: 52px; }
          .upi-cancel-link { background: none; border: none; color: var(--muted); font-size: 0.78rem; cursor: pointer; text-decoration: underline; padding: 4px; }
          .upi-cancel-link:hover { color: var(--gold); }
          @media (max-width: 480px) {
            .upi-card { padding: 28px 18px; }
          }
        `}</style>
      </div>
    );
  }

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
          <div className="success-total">Total Paid: <span className="gold-text-static">{formatPrice(success.total)}</span></div>
          <Link href="/products" className="btn-gold" style={{ marginTop: '28px' }}>
            Continue Shopping
          </Link>
        </div>
        <style>{`
          .success-page {
            min-height: 100svh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 100px 20px 40px;
            background: radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%), var(--black);
          }
          .success-card {
            max-width: 520px;
            width: 100%;
            background: #FAF4E8;
            border: 1px solid rgba(192,82,42,0.3);
            border-radius: 10px;
            padding: 52px 40px;
            text-align: center;
            animation: fadeInUp 0.6s ease;
            box-shadow: 0 8px 40px rgba(44, 26, 14, 0.12);
          }
          .success-icon {
            font-size: 3.5rem;
            color: var(--gold);
            animation: pulse-glow 2s ease-in-out infinite;
            margin-bottom: 20px;
          }
          .success-title {
            font-size: clamp(1.8rem, 5vw, 2.5rem);
            margin-bottom: 10px;
            background: linear-gradient(135deg, var(--gold-dark), var(--gold), var(--gold-shimmer));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .success-sub { font-size: 0.95rem; color: var(--muted); margin-bottom: 14px; }
          .success-desc { color: var(--muted); font-size: 0.85rem; line-height: 1.8; margin-bottom: 14px; }
          .success-total { font-family: var(--font-display); font-size: 0.95rem; color: var(--muted); letter-spacing: 0.1em; }
          @media (max-width: 480px) {
            .success-card { padding: 36px 24px; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div className="cart-page">
        <div className="cart-page-header">
          <div className="cart-header-bg" />
          <div className="container">
            <div className="section-label" style={{ justifyContent: 'center' }}>Your Selection</div>
            <h1 className="cart-page-title">
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
              <Link href="/products" className="btn-gold empty-shop-btn">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="cart-layout">
              {/* Cart Items */}
              <div className="cart-items-col">
                {/* Desktop table header */}
                <div className="cart-table-header">
                  <span>Product</span>
                  <span>Price</span>
                  <span>Qty</span>
                  <span>Total</span>
                </div>

                {cart.map((item) => (
                  <div key={item.id} className="cart-row">
                    {/* Image + Name */}
                    <div className="cart-item-info">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-item-img"
                        onError={(e) => {
                          e.target.src = `https://placehold.co/80x80/F5EDD6/2C1A0E?text=${encodeURIComponent(item.name[0])}`;
                        }}
                      />
                      <div className="cart-item-meta">
                        <div className="cart-item-name">{item.name}</div>
                        <div className="cart-item-unit">{item.unit}</div>
                        {/* Mobile: price shown here */}
                        <div className="cart-item-price-mobile">{formatPrice(item.price)}</div>
                      </div>
                    </div>

                    {/* Desktop price */}
                    <div className="cart-item-price">{formatPrice(item.price)}</div>

                    {/* Qty */}
                    <div className="qty-row">
                      <div className="qty-controls-small">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >−</button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >+</button>
                      </div>
                      {/* Mobile: remove button beside qty */}
                      <button
                        className="remove-btn remove-btn-mobile"
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                      >×</button>
                    </div>

                    {/* Total */}
                    <div className="cart-item-total gold-text-static">
                      {formatPrice(item.price * item.quantity)}
                    </div>

                    {/* Desktop remove */}
                    <button
                      className="remove-btn remove-btn-desktop"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Remove item"
                    >×</button>
                  </div>
                ))}

                <button className="clear-btn" onClick={clearCart}>Clear Cart</button>
              </div>

              {/* Checkout Panel */}
              <div className="checkout-panel">
                <div className="order-summary">
                  <h3 className="summary-title">Order Summary</h3>
                  <div className="summary-row">
                    <span>Items ({itemCount})</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span className="gold-text-static">FREE</span>
                  </div>
                  <div className="summary-divider" />
                  <div className="summary-row total-row">
                    <span>Total</span>
                    <span className="gold-text">{formatPrice(total)}</span>
                  </div>
                </div>

                <form className="checkout-form" onSubmit={handleSubmit}>
                  <h3 className="checkout-title">Delivery Details</h3>
                  {[
                    { name: 'customerName', label: 'Full Name', type: 'text', placeholder: 'John Doe', autoComplete: 'name' },
                    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com', autoComplete: 'email' },
                    { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 234 567 8901', autoComplete: 'tel' },
                  ].map((field) => (
                    <div className="form-group" key={field.name}>
                      <label className="form-label" htmlFor={`cart-${field.name}`}>{field.label}</label>
                      <input
                        id={`cart-${field.name}`}
                        className="form-input"
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={form[field.name]}
                        onChange={handleChange}
                        required
                        autoComplete={field.autoComplete}
                      />
                    </div>
                  ))}
                  <div className="form-group">
                    <label className="form-label" htmlFor="cart-address">Delivery Address</label>
                    <textarea
                      id="cart-address"
                      className="form-textarea"
                      name="address"
                      placeholder="Enter your full delivery address..."
                      value={form.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {error && <p className="form-error" role="alert">{error}</p>}
                  <button type="submit" className="btn-gold submit-btn" disabled={submitting}>
                    {submitting ? 'Placing Order…' : 'Place Order →'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .cart-page { min-height: 100svh; }

        .cart-page-header {
          padding: 110px 0 48px;
          position: relative;
          overflow: hidden;
          text-align: center;
        }
        .cart-header-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 100%, rgba(192,82,42,0.07) 0%, transparent 70%);
          border-bottom: 1px solid rgba(192,82,42,0.1);
        }
        .cart-page-title { font-size: clamp(2rem, 5vw, 4rem); }

        .cart-content { padding-top: 48px; padding-bottom: 80px; }

        .cart-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 40px;
          align-items: start;
        }

        .cart-table-header {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 12px;
          padding: 10px 12px;
          font-family: var(--font-display);
          font-size: 0.62rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold-dark);
          border-bottom: 1px solid rgba(192,82,42,0.15);
          margin-bottom: 4px;
        }

        .cart-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr auto;
          gap: 12px;
          align-items: center;
          padding: 18px 12px;
          border-bottom: 1px solid rgba(192,82,42,0.08);
          transition: background 0.2s;
        }
        .cart-row:hover { background: rgba(192,82,42,0.025); }

        .cart-item-info {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }
        .cart-item-img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 4px;
          border: 1px solid rgba(192,82,42,0.12);
          flex-shrink: 0;
        }
        .cart-item-meta { min-width: 0; }
        .cart-item-name {
          font-family: var(--font-display);
          font-size: 0.85rem;
          color: var(--white);
          margin-bottom: 3px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .cart-item-unit { font-size: 0.7rem; color: var(--muted); }
        .cart-item-price-mobile { display: none; }
        .cart-item-price { font-size: 0.88rem; color: var(--muted); }

        .qty-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .qty-controls-small {
          display: flex;
          align-items: center;
          border: 1.5px solid rgba(192,82,42,0.2);
          border-radius: 3px;
          overflow: hidden;
        }
        .qty-controls-small button {
          width: 34px;
          height: 34px;
          background: var(--dark-3);
          border: none;
          color: var(--gold);
          cursor: pointer;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
          flex-shrink: 0;
          -webkit-tap-highlight-color: transparent;
        }
        .qty-controls-small button:hover { background: var(--dark-4); }
        .qty-controls-small button:active { background: rgba(192, 82, 42, 0.15); }
        .qty-controls-small span {
          width: 34px;
          text-align: center;
          background: var(--dark-2);
          line-height: 34px;
          font-size: 0.85rem;
          flex-shrink: 0;
        }
        .cart-item-total { font-family: var(--font-display); font-size: 0.92rem; font-weight: 700; }

        .remove-btn {
          background: none;
          border: none;
          color: var(--muted);
          font-size: 1.4rem;
          cursor: pointer;
          transition: color 0.2s;
          line-height: 1;
          padding: 4px 6px;
          border-radius: 4px;
          min-width: 36px;
          min-height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          -webkit-tap-highlight-color: transparent;
        }
        .remove-btn:hover { color: #ef4444; background: rgba(239,68,68,0.08); }
        .remove-btn-mobile { display: none; }

        .clear-btn {
          margin-top: 14px;
          background: none;
          border: none;
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.62rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          cursor: pointer;
          transition: color 0.3s;
          padding: 10px 0;
          min-height: 40px;
        }
        .clear-btn:hover { color: #ef4444; }

        .checkout-panel {
          position: sticky;
          top: 80px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .order-summary {
          background: #FAF4E8;
          border: 1px solid rgba(192,82,42,0.2);
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 16px rgba(44, 26, 14, 0.06);
        }
        .summary-title, .checkout-title {
          font-family: var(--font-display);
          font-size: 0.7rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 16px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.86rem;
          padding: 7px 0;
          color: var(--muted);
        }
        .summary-divider { height: 1px; background: rgba(192,82,42,0.15); margin: 10px 0; }
        .total-row { font-size: 1rem; font-weight: 600; color: var(--white); }

        .checkout-form {
          background: #FAF4E8;
          border: 1px solid rgba(192,82,42,0.15);
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 16px rgba(44, 26, 14, 0.06);
        }
        .submit-btn {
          width: 100%;
          justify-content: center;
          margin-top: 8px;
          font-size: 0.72rem;
          letter-spacing: 0.25em;
          min-height: 52px;
        }
        .form-error { color: #ef4444; font-size: 0.8rem; margin-bottom: 10px; line-height: 1.5; }

        .empty-cart {
          text-align: center;
          padding: 80px 20px;
          color: var(--muted);
        }
        .empty-icon { font-size: 3.5rem; color: rgba(201,168,76,0.2); margin-bottom: 20px; }
        .empty-cart h2 { font-family: var(--font-display); font-size: 1.8rem; color: var(--white); margin-bottom: 8px; }
        .empty-cart p { font-size: 0.9rem; margin-bottom: 24px; }
        .empty-shop-btn { margin-top: 8px; }

        /* ===== Responsive ===== */
        @media (max-width: 1024px) {
          .cart-layout { grid-template-columns: 1fr; gap: 32px; }
          .checkout-panel { position: static; }
        }

        @media (max-width: 640px) {
          /* Mobile: hide the desktop table header */
          .cart-table-header { display: none; }
          /* Mobile: reflow each row as a card */
          .cart-row {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
            gap: 10px;
            padding: 16px 12px;
            background: rgba(192,82,42,0.02);
            border-radius: 6px;
            border: 1px solid rgba(192,82,42,0.08);
            margin-bottom: 8px;
          }
          .cart-row:hover { background: rgba(192,82,42,0.04); }
          /* Hide desktop-specific cells */
          .cart-item-price { display: none; }
          .remove-btn-desktop { display: none; }
          /* Show mobile alternatives */
          .cart-item-price-mobile {
            display: block;
            font-size: 0.78rem;
            color: var(--gold);
            font-weight: 700;
            font-family: var(--font-display);
            margin-top: 3px;
          }
          .remove-btn-mobile { display: flex; }
          /* qty row: space between qty controls and total */
          .qty-row { justify-content: space-between; }
          .cart-item-total { font-size: 1rem; }
          /* Checkout panel */
          .checkout-form, .order-summary { padding: 20px 18px; }
        }

        @media (max-width: 480px) {
          .cart-page-header { padding: 90px 0 32px; }
          .cart-content { padding-top: 24px; padding-bottom: 60px; }
          .cart-item-img { width: 52px; height: 52px; }
        }
      `}</style>
    </>
  );
}
