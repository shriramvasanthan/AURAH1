'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [content, setContent] = useState({
    footer_desc: 'Hand-selected specimens of nature\'s most intense character.',
    footer_email: 'curator@aurah.com',
    footer_address: 'Malabar Coast, India',
    footer_ig: '#',
    footer_tw: '#',
    footer_tagline: 'Explore. Preserve. Elevate.'
  });

  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then(data => {
        if (Object.keys(data).length > 0) {
          setContent(prev => ({ ...prev, ...data }));
        }
      })
      .catch(console.error);
  }, []);

  return (
    <footer className="footer-container">

      <div className="footer-main-grid">
        <div className="footer-col brand-info">
          <h2 className="footer-logo">AURAH</h2>
          <p className="footer-desc">{content.footer_desc}</p>
          <div className="social-links">
            <a href={content.footer_ig} target="_blank" rel="noopener noreferrer" aria-label="Instagram">IG</a>
            <a href={content.footer_tw} target="_blank" rel="noopener noreferrer" aria-label="Twitter">TW</a>
          </div>
        </div>

        <div className="footer-col">
          <span className="footer-label">The Collection</span>
          <ul className="footer-list">
            <li><Link href="/products">All Products</Link></li>
            <li><Link href="/story">Our Story</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <span className="footer-label">Company</span>
          <ul className="footer-list">
            <li><Link href="/story">Heritage</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <span className="footer-label">Reach Out</span>
          <div className="contact-info">
            <p>{content.footer_email}</p>
            <p>{content.footer_address}</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} AURAH. {content.footer_tagline}</p>
      </div>

      <style jsx>{`
        .footer-container {
          background: var(--dark-2);
          color: var(--white);
          padding: 80px 0 32px;
          border-top: 1px solid rgba(192, 82, 42, 0.08);
        }
        .footer-main-grid {
          max-width: var(--container-max);
          margin: 0 auto;
          padding: 0 3rem;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 48px;
          margin-bottom: 60px;
        }
        .footer-logo {
          font-family: var(--font-cinzel);
          font-size: 2.2rem;
          letter-spacing: 0.2em;
          margin-bottom: 16px;
        }
        .footer-desc {
          font-family: var(--font-montserrat);
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--muted);
          max-width: 280px;
          margin-bottom: 24px;
          font-style: italic;
        }
        .footer-label {
          display: block;
          font-family: var(--font-cinzel);
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: var(--gold);
          margin-bottom: 24px;
          font-weight: 800;
        }
        .footer-list {
          list-style: none;
          padding: 0;
        }
        .footer-list li {
          margin-bottom: 12px;
        }
        .footer-list a {
          text-decoration: none;
          color: var(--white);
          font-family: var(--font-cinzel);
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          transition: var(--transition);
          opacity: 0.6;
          display: inline-block;
          padding: 4px 0;
          min-height: 32px;
        }
        .footer-list a:hover { opacity: 1; color: var(--gold); }
        .contact-info p {
          font-family: var(--font-montserrat);
          font-size: 0.83rem;
          margin-bottom: 8px;
          color: var(--muted);
          font-weight: 600;
        }
        .footer-bottom {
          border-top: 1px solid rgba(192, 82, 42, 0.08);
          padding: 28px 3rem 0;
          text-align: center;
          font-family: var(--font-montserrat);
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--muted);
          font-weight: 700;
        }
        .social-links {
          display: flex;
          gap: 16px;
        }
        .social-links a {
          text-decoration: none;
          color: var(--white);
          font-family: var(--font-cinzel);
          font-size: 0.7rem;
          font-weight: 900;
          opacity: 0.5;
          transition: var(--transition);
          min-width: 44px;
          min-height: 44px;
          display: flex;
          align-items: center;
        }
        .social-links a:hover { opacity: 1; color: var(--gold); }

        /* ===== Responsive ===== */
        @media (max-width: 1024px) {
          .footer-main-grid {
            grid-template-columns: 1fr 1fr;
            gap: 36px;
          }
          .footer-bottom { padding: 24px 2rem 0; }
        }
        @media (max-width: 640px) {
          .footer-main-grid {
            grid-template-columns: 1fr 1fr;
            gap: 28px;
            padding: 0 1.25rem;
          }
          .footer-cta-bar { margin-bottom: 48px; }
          .footer-logo { font-size: 1.8rem; }
          .footer-desc { max-width: 100%; font-size: 0.82rem; }
          .footer-container { padding: 56px 0 28px; }
          .footer-bottom { padding: 20px 1.25rem 0; }
        }
        @media (max-width: 400px) {
          .footer-main-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .footer-cta-btn { width: 100%; max-width: 280px; }
        }
      `}</style>
    </footer>
  );
}
