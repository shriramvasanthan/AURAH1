'use client';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useRef, useState } from 'react';
import { formatPrice } from '@/lib/utils';

const WHATSAPP_NUMBER = '917867899091';

export default function CartDrawer() {
  const { items, removeFromCart, updateQty, totalPrice, totalItems, isOpen, setIsOpen, clearCart } = useCart();
  const { user } = useAuth();
  const drawerRef = useRef(null);
  const [checkoutMode, setCheckoutMode] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', address: '', email: '' });
  const [placing, setPlacing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        email: user.email || '',
      });
    }
  }, [user]);

  useEffect(() => {
    const handler = (e) => {
      if (isOpen && drawerRef.current && !drawerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, setIsOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleRazorpay = async (e) => {
    e.preventDefault();
    setPlacing(true);
    try {
      const orderRes = await fetch('/api/orders/create-razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(totalPrice * 100),
          currency: 'INR',
          items,
          ...form,
          userId: user?.id || null,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || 'Order creation failed');

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.razorpayOrder.amount,
        currency: 'INR',
        name: 'AURAH',
        description: 'Premium Spices & Nuts',
        order_id: orderData.razorpayOrder.id,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: '#c0522a' },
        handler: async (response) => {
          const verifyRes = await fetch('/api/orders/verify-razorpay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              dbOrderId: orderData.dbOrderId,
            }),
          });
          if (verifyRes.ok) {
            clearCart();
            setOrderSuccess(true);
            setCheckoutMode(null);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert('Payment setup failed: ' + err.message);
    } finally {
      setPlacing(false);
    }
  };

  const handleWhatsApp = (e) => {
    e.preventDefault();
    const lines = items.map((i) => `• ${i.name} (${i.unit}) × ${i.quantity} = ₹${(i.price * i.quantity).toFixed(2)}`);
    const msg = [
      '🌿 *AURAH Order*',
      `👤 *Name:* ${form.name}`,
      `📱 *Phone:* ${form.phone}`,
      `📍 *Address:* ${form.address}`,
      '',
      '*Items:*',
      ...lines,
      '',
      `*Total: ₹${totalPrice.toFixed(2)}*`,
    ].join('\n');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    clearCart();
    setIsOpen(false);
    setCheckoutMode(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-backdrop" onClick={() => setIsOpen(false)} />
      <div className="cart-drawer" ref={drawerRef}>
        <div className="cart-header">
          <div>
            <div className="cart-title">Your Bag</div>
            {totalItems > 0 && <div className="cart-count">{totalItems} item{totalItems !== 1 ? 's' : ''}</div>}
          </div>
          <button className="cart-close" onClick={() => setIsOpen(false)}>✕</button>
        </div>

        {orderSuccess ? (
          <div className="cart-success">
            <div className="success-icon">✦</div>
            <h3>Order Placed!</h3>
            <p>Thank you! We'll confirm via WhatsApp or email shortly.</p>
            <button className="btn-gold-full" onClick={() => { setOrderSuccess(false); setIsOpen(false); }}>
              Continue Shopping
            </button>
          </div>
        ) : checkoutMode ? (
          <div className="checkout-form-wrap">
            <button className="back-btn" onClick={() => setCheckoutMode(null)}>← Back to bag</button>
            <h3 className="form-section-title">
              {checkoutMode === 'razorpay' ? '💳 Pay with Razorpay' : '💬 Order via WhatsApp'}
            </h3>
            <form onSubmit={checkoutMode === 'razorpay' ? handleRazorpay : handleWhatsApp}>
              <div className="cf-group">
                <label className="cf-label">Full Name *</label>
                <input className="cf-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="Your name" />
              </div>
              <div className="cf-group">
                <label className="cf-label">Phone *</label>
                <input className="cf-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required placeholder="+91 98765 43210" />
              </div>
              {checkoutMode === 'razorpay' && (
                <div className="cf-group">
                  <label className="cf-label">Email *</label>
                  <input className="cf-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required placeholder="you@email.com" />
                </div>
              )}
              <div className="cf-group">
                <label className="cf-label">Delivery Address *</label>
                <textarea className="cf-textarea" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} required placeholder="House no, Street, City, PIN" rows={3} />
              </div>
              <div className="order-summary">
                {items.map(i => (
                  <div key={i.id} className="summary-row">
                    <span>{i.name} × {i.quantity}</span>
                    <span>{formatPrice(i.price * i.quantity)}</span>
                  </div>
                ))}
                <div className="summary-total">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
              <button type="submit" className="btn-gold-full" disabled={placing}>
                {placing ? 'Processing...' : checkoutMode === 'razorpay' ? `💳 Pay ₹${totalPrice.toFixed(2)}` : '💬 Send WhatsApp Order'}
              </button>
            </form>
          </div>
        ) : items.length === 0 ? (
          <div className="cart-empty">
            <div className="empty-icon-cart">✦</div>
            <p>Your bag is empty</p>
            <button className="btn-gold-full" onClick={() => setIsOpen(false)}>Browse Products</button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-img-wrap">
                    <img
                      src={item.image || `https://placehold.co/60x60/F5EDD6/2C1A0E?text=${item.name.charAt(0)}`}
                      alt={item.name}
                      className="item-img"
                      onError={e => { e.target.src = `https://placehold.co/60x60/F5EDD6/2C1A0E?text=${item.name.charAt(0)}`; }}
                    />
                  </div>
                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    <div className="item-unit">{item.unit} · {formatPrice(item.price)}</div>
                    <div className="item-qty-row">
                      <button className="qty-btn" onClick={() => updateQty(item.id, item.quantity - 1)}>−</button>
                      <span className="qty-num">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <div className="item-right">
                    <div className="item-total">{formatPrice(item.price * item.quantity)}</div>
                    <button className="item-remove" onClick={() => removeFromCart(item.id)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <div className="cart-total-row">
                <span>Subtotal</span>
                <span className="cart-total-price">{formatPrice(totalPrice)}</span>
              </div>
              <p className="cart-shipping-note">Shipping calculated at checkout</p>
              <button className="btn-gold-full" onClick={() => setCheckoutMode('razorpay')}>
                💳 Pay Online (Razorpay)
              </button>
              <button className="btn-whatsapp-full" onClick={() => setCheckoutMode('whatsapp')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{flexShrink:0}}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Order via WhatsApp
              </button>
              <button className="clear-btn" onClick={clearCart}>Clear bag</button>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .cart-backdrop { position: fixed; inset: 0; background: rgba(44,26,14,0.6); z-index: 900; animation: fadeIn 0.2s ease; }
        .cart-drawer { position: fixed; top: 0; right: 0; bottom: 0; width: min(420px, 100vw); background: #faf4e8; z-index: 901; display: flex; flex-direction: column; animation: slideIn 0.3s cubic-bezier(0.23,1,0.32,1); box-shadow: -8px 0 40px rgba(44,26,14,0.18); }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .cart-header { display: flex; align-items: flex-start; justify-content: space-between; padding: 24px; border-bottom: 1px solid rgba(192,82,42,0.12); }
        .cart-title { font-family: var(--font-cinzel, serif); font-size: 1.1rem; color: #2c1a0e; letter-spacing: 0.1em; font-weight: 700; }
        .cart-count { font-size: 0.7rem; color: #c0522a; margin-top: 2px; font-weight: 600; }
        .cart-close { background: none; border: none; font-size: 1.1rem; color: #8b7355; cursor: pointer; padding: 4px; }
        .cart-items { flex: 1; overflow-y: auto; padding: 16px 24px; }
        .cart-item { display: flex; gap: 12px; padding: 16px 0; border-bottom: 1px solid rgba(192,82,42,0.08); }
        .item-img-wrap { width: 64px; height: 64px; flex-shrink: 0; border-radius: 4px; overflow: hidden; background: #e8dfc8; }
        .item-img { width: 100%; height: 100%; object-fit: cover; }
        .item-info { flex: 1; min-width: 0; }
        .item-name { font-family: var(--font-cinzel, serif); font-size: 0.8rem; color: #2c1a0e; font-weight: 700; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .item-unit { font-size: 0.7rem; color: #8b7355; margin-bottom: 8px; }
        .item-qty-row { display: flex; align-items: center; gap: 8px; }
        .qty-btn { width: 26px; height: 26px; background: none; border: 1px solid rgba(192,82,42,0.25); color: #2c1a0e; border-radius: 3px; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .qty-num { font-size: 0.85rem; font-weight: 700; color: #2c1a0e; min-width: 20px; text-align: center; }
        .item-right { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; flex-shrink: 0; }
        .item-total { font-family: var(--font-cinzel, serif); font-size: 0.9rem; color: #c0522a; font-weight: 700; }
        .item-remove { background: none; border: none; font-size: 0.75rem; color: #b0956e; cursor: pointer; padding: 2px; }
        .cart-footer { padding: 20px 24px; border-top: 1px solid rgba(192,82,42,0.12); }
        .cart-total-row { display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 0.85rem; color: #2c1a0e; font-weight: 600; }
        .cart-total-price { font-family: var(--font-cinzel, serif); font-size: 1.1rem; color: #c0522a; font-weight: 700; }
        .cart-shipping-note { font-size: 0.68rem; color: #8b7355; margin-bottom: 16px; }
        .btn-gold-full { width: 100%; padding: 14px; margin-bottom: 10px; background: linear-gradient(135deg, #8b3c1e, #c0522a, #d96a38); border: none; color: #f5edd6; font-family: var(--font-cinzel, serif); font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 700; border-radius: 4px; cursor: pointer; transition: opacity 0.2s; }
        .btn-gold-full:hover { opacity: 0.9; }
        .btn-gold-full:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-whatsapp-full { width: 100%; padding: 14px; margin-bottom: 10px; background: #25d366; border: none; color: #fff; font-family: var(--font-cinzel, serif); font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: opacity 0.2s; }
        .btn-whatsapp-full:hover { opacity: 0.9; }
        .clear-btn { background: none; border: none; color: #b0956e; font-size: 0.7rem; cursor: pointer; width: 100%; text-align: center; padding: 8px; text-decoration: underline; }
        .cart-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 24px; gap: 16px; }
        .empty-icon-cart { font-size: 3rem; color: rgba(192,82,42,0.15); }
        .cart-empty p { font-size: 0.9rem; color: #8b7355; }
        .cart-success { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 24px; text-align: center; gap: 16px; }
        .success-icon { font-size: 3rem; color: #c0522a; }
        .cart-success h3 { font-family: var(--font-cinzel, serif); color: #2c1a0e; font-size: 1.3rem; }
        .cart-success p { font-size: 0.85rem; color: #8b7355; line-height: 1.6; }
        .checkout-form-wrap { flex: 1; overflow-y: auto; padding: 24px; }
        .back-btn { background: none; border: none; color: #c0522a; font-size: 0.78rem; cursor: pointer; margin-bottom: 20px; padding: 0; font-weight: 600; }
        .form-section-title { font-family: var(--font-cinzel, serif); font-size: 1rem; color: #2c1a0e; margin-bottom: 20px; }
        .cf-group { margin-bottom: 16px; }
        .cf-label { display: block; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.15em; color: #2c1a0e; font-weight: 700; margin-bottom: 6px; }
        .cf-input, .cf-textarea { width: 100%; background: #f0e8d4; border: 1px solid rgba(192,82,42,0.2); padding: 12px; font-size: 0.88rem; color: #2c1a0e; border-radius: 3px; outline: none; box-sizing: border-box; }
        .cf-input:focus, .cf-textarea:focus { border-color: #c0522a; }
        .cf-textarea { resize: vertical; font-family: inherit; }
        .order-summary { background: #f0e8d4; border-radius: 4px; padding: 16px; margin: 20px 0; }
        .summary-row { display: flex; justify-content: space-between; font-size: 0.8rem; color: #8b7355; margin-bottom: 8px; }
        .summary-total { display: flex; justify-content: space-between; font-size: 0.9rem; font-weight: 700; color: #2c1a0e; padding-top: 10px; border-top: 1px solid rgba(192,82,42,0.15); margin-top: 4px; }
      `}</style>
    </>
  );
}