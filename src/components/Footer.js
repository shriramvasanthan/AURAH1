'use client';
import Link from 'next/link';

export default function Footer() {
  const spices = ['Cardamom', 'Black Pepper', 'Fenugreek', 'Cinnamon', 'Turmeric', 'Cloves'];
  const nuts = ['Cashews', 'Almonds'];

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">AURAH</div>
            <p className="footer-tagline">Where Ancient Spice Meets Modern Excellence</p>
            <div className="footer-social">
              {['instagram', 'facebook', 'twitter'].map((s) => (
                <a key={s} href="#" className="social-link" aria-label={s}>
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="footer-links-group">
            <h4>Spices</h4>
            <ul>
              {spices.map(s => <li key={s}><Link href="/products">{s}</Link></li>)}
            </ul>
          </div>

          <div className="footer-links-group">
            <h4>Nuts</h4>
            <ul>
              {nuts.map(n => <li key={n}><Link href="/products">{n}</Link></li>)}
            </ul>
          </div>

          <div className="footer-links-group">
            <h4>Company</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/products">All Products</Link></li>
              <li><Link href="/cart">Cart & Checkout</Link></li>
              <li><Link href="/admin">Admin Panel</Link></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contact</h4>
            <p>📧 orders@aurah.com</p>
            <p>📞 +1 (555) 234-5678</p>
            <p>📍 Spice Market, Old City</p>
            <br />
            <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>Mon–Sat: 9am – 6pm</p>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} AURAH Spices & Nuts. All rights reserved.</p>
          <p>Crafted with ✦ for spice lovers everywhere</p>
        </div>
      </div>

      <style>{`
        .footer {
          background: var(--dark-2);
          border-top: 1px solid rgba(192, 82, 42, 0.2);
          margin-top: 80px;
        }
        .footer-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 80px 40px 40px;
        }
        .footer-top {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
          gap: 60px;
          margin-bottom: 60px;
        }
        .footer-logo {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 900;
          letter-spacing: 0.3em;
          background: linear-gradient(135deg, var(--gold-dark), var(--gold), var(--gold-shimmer));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 12px;
        }
        .footer-tagline {
          font-size: 0.8rem;
          color: var(--muted);
          font-style: italic;
          margin-bottom: 24px;
          line-height: 1.6;
        }
        .footer-social { display: flex; gap: 12px; }
        .social-link {
          width: 36px;
          height: 36px;
          border: 1px solid rgba(192, 82, 42, 0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold);
          text-decoration: none;
          transition: all 0.3s;
        }
        .social-link:hover {
          background: var(--gold);
          color: #FAF4E8;
          box-shadow: var(--glow);
        }
        .footer-links-group h4,
        .footer-contact h4 {
          font-family: var(--font-display);
          font-size: 0.7rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--gold-dark);
          margin-bottom: 20px;
        }
        .footer-links-group ul { list-style: none; }
        .footer-links-group li { margin-bottom: 10px; }
        .footer-links-group a {
          color: var(--muted);
          text-decoration: none;
          font-size: 0.85rem;
          transition: color 0.3s, padding-left 0.3s;
          display: block;
        }
        .footer-links-group a:hover { color: var(--gold); padding-left: 6px; }
        .footer-contact p {
          font-size: 0.85rem;
          color: var(--muted);
          margin-bottom: 8px;
        }
        .footer-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(192, 82, 42, 0.3), transparent);
          margin-bottom: 32px;
        }
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.78rem;
          color: var(--muted);
        }
        @media (max-width: 1024px) {
          .footer-top { grid-template-columns: 1fr 1fr 1fr; gap: 40px; }
          .footer-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 600px) {
          .footer-top { grid-template-columns: 1fr 1fr; }
          .footer-bottom { flex-direction: column; gap: 8px; text-align: center; }
          .footer-inner { padding: 60px 20px 30px; }
        }
      `}</style>
    </footer>
  );
}
