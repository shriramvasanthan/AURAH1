'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [content, setContent] = useState({
    footer_cta_text: 'Ready to Elevate Your Kitchen?',
    footer_cta_btn: 'Shop Now',
    footer_desc: 'Hand-selected specimens of nature’s most intense character.',
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
      <div className="footer-cta-bar">
        <h3 className="cta-heading">{content.footer_cta_text}</h3>
        <Link href="/products" className="btn-gold">{content.footer_cta_btn}</Link>
      </div>

      <div className="footer-main-grid">
        <div className="footer-col brand-info">
          <h2 className="footer-logo">AURAH</h2>
          <p className="footer-desc">{content.footer_desc}</p>
          <div className="social-links">
            <a href={content.footer_ig} target="_blank" rel="noopener noreferrer">IG</a>
            <a href={content.footer_tw} target="_blank" rel="noopener noreferrer">TW</a>
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
          padding: 100px 0 40px;
          border-top: 1px solid rgba(192, 82, 42, 0.08);
        }
        .footer-cta-bar {
          text-align: center;
          margin-bottom: 120px;
          padding: 0 20px;
        }
        .cta-heading {
          font-family: var(--font-cinzel);
          font-size: clamp(2rem, 5vw, 4rem);
          margin-bottom: 40px;
          color: var(--white);
          letter-spacing: 0.05em;
        }
        .btn-gold {
          background: linear-gradient(135deg, #8b3c1e, #c0522a, #d96a38);
          border: none;
          color: #f5edd6;
          padding: 16px 40px;
          font-family: var(--font-cinzel);
          font-size: 0.75rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          font-weight: 900;
          border-radius: 4px;
          text-decoration: none;
          display: inline-block;
          transition: var(--transition);
        }
        .btn-gold:hover {
          transform: translateY(-4px);
          box-shadow: var(--glow-strong);
        }
        .footer-main-grid {
          max-width: var(--container-max);
          margin: 0 auto;
          padding: 0 40px;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 60px;
          margin-bottom: 80px;
        }
        .footer-logo {
          font-family: var(--font-cinzel);
          font-size: 2.5rem;
          letter-spacing: 0.2em;
          margin-bottom: 20px;
        }
        .footer-desc {
          font-family: var(--font-montserrat);
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--muted);
          max-width: 300px;
          margin-bottom: 30px;
          font-style: italic;
        }
        .footer-label {
          display: block;
          font-family: var(--font-cinzel);
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: var(--gold);
          margin-bottom: 30px;
          font-weight: 800;
        }
        .footer-list {
          list-style: none;
          padding: 0;
        }
        .footer-list li {
          margin-bottom: 15px;
        }
        .footer-list a {
          text-decoration: none;
          color: var(--white);
          font-family: var(--font-cinzel);
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          transition: var(--transition);
          opacity: 0.6;
        }
        .footer-list a:hover {
          opacity: 1;
          color: var(--gold);
        }
        .contact-info p {
          font-family: var(--font-montserrat);
          font-size: 0.85rem;
          margin-bottom: 10px;
          color: var(--muted);
          font-weight: 600;
        }
        .footer-bottom {
          border-top: 1px solid rgba(192, 82, 42, 0.08);
          padding-top: 40px;
          text-align: center;
          font-family: var(--font-montserrat);
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--muted);
          font-weight: 700;
        }
        .social-links {
          display: flex;
          gap: 20px;
        }
        .social-links a {
          text-decoration: none;
          color: var(--white);
          font-family: var(--font-cinzel);
          font-size: 0.7rem;
          font-weight: 900;
          opacity: 0.5;
          transition: var(--transition);
        }
        .social-links a:hover {
          opacity: 1;
          color: var(--gold);
        }
        @media (max-width: 1024px) {
          .footer-main-grid {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
        }
        @media (max-width: 640px) {
          .footer-main-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
}
