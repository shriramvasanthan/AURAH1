'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const hoverTimerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleMouseEnter = () => {
    clearTimeout(hoverTimerRef.current);
    setHovered(true);
  };
  const handleMouseLeave = () => {
    hoverTimerRef.current = setTimeout(() => setHovered(false), 300);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Collapsed = scrolled AND not being hovered
  const isCollapsed = scrolled && !hovered;

  const links = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <motion.nav
      className="navbar-root"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      variants={{
        expanded: { borderRadius: '0px', y: 0 },
        collapsed: { borderRadius: '0px', y: 0 },
      }}
    >
      {/* Full expanded navbar */}
      <div className={`nav-full ${isCollapsed ? 'nav-full--hidden' : 'nav-full--visible'}`}>
        <div className="nav-wrapper">
          <Link href="/" className="nav-logo-group">
            <span className="logo-star">✦</span>
            <div className="logo-stack">
              <span className="logo-main">AURAH</span>
              <span className="logo-sub">THE EARTHY ALCHEMIST</span>
            </div>
          </Link>

          {/* Desktop center links */}
          <nav className="nav-desktop-links" aria-label="Main navigation">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${hoveredLink === link.href ? 'nav-link--active' : ''}`}
                onMouseEnter={() => setHoveredLink(link.href)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <span className="nav-link-inner">
                  <span className="nav-link-text">{link.label}</span>
                  <span className="nav-link-text nav-link-clone" aria-hidden>{link.label}</span>
                </span>
              </Link>
            ))}
          </nav>

          <div className="nav-desktop-actions">
            {user ? (
              <>
                <Link href="/dashboard" className="btn-nav">Dashboard</Link>
                <button onClick={handleLogout} className="btn-nav">Logout</button>
              </>
            ) : (
              <Link href="/login" className="btn-nav">Sign In</Link>
            )}
          </div>

          {/* Mobile cart */}
          <Link href="/cart" className="mobile-cart-btn" aria-label={`Cart, ${itemCount} items`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {itemCount > 0 && <span className="mobile-cart-badge">{itemCount}</span>}
          </Link>
        </div>
      </div>

      {/* Collapsed pill — shown when scrolled */}
      <AnimatePresence>
        {isCollapsed && (
          <motion.div
            className="nav-pill"
            initial={{ opacity: 0, scale: 0.4, x: '-50%', y: -20 }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: 0 }}
            exit={{ opacity: 0, scale: 0.4, x: '-50%', y: -20 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <Link href="/" className="pill-logo">
              <span className="pill-star">✦</span>
              <span className="pill-text">AURAH</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .navbar-root {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          pointer-events: none; /* let pill / full nav handle their own */
        }

        /* ── FULL NAV ── */
        .nav-full {
          pointer-events: all;
          padding: 1.6rem 0;
          transition: opacity 0.35s ease, transform 0.35s ease;
          background: transparent;
        }
        .nav-full--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .nav-full--hidden {
          opacity: 0;
          transform: translateY(-120%);
          pointer-events: none;
        }
        .nav-wrapper {
          max-width: var(--container-max);
          margin: 0 auto;
          padding: 0 3rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        /* Logo */
        .nav-logo-group {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          text-decoration: none;
          flex-shrink: 0;
        }
        .logo-star { font-size: 1rem; color: var(--gold); flex-shrink: 0; }
        .logo-stack { display: flex; flex-direction: column; }
        .logo-main {
          font-family: var(--font-cinzel);
          font-size: 1.5rem;
          font-weight: 900;
          letter-spacing: 0.35em;
          color: #2C1A0E;
          line-height: 1;
        }
        .logo-sub {
          font-family: var(--font-cinzel);
          font-size: 0.36rem;
          letter-spacing: 0.5em;
          color: var(--muted);
          margin-top: 0.2rem;
        }

        /* ── Nav links: flip-up roll hover effect ── */
        .nav-desktop-links {
          display: flex;
          align-items: center;
          gap: 2.5rem;
          flex: 1;
          justify-content: center;
        }
        .nav-link {
          text-decoration: none;
          overflow: hidden;
          display: block;
          height: 1.2rem;
          position: relative;
        }
        .nav-link-inner {
          display: flex;
          flex-direction: column;
          transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .nav-link:hover .nav-link-inner {
          transform: translateY(-50%);
        }
        .nav-link-text {
          font-family: var(--font-cinzel);
          font-size: 0.62rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 600;
          white-space: nowrap;
          line-height: 1.2rem;
          height: 1.2rem;
          display: block;
        }
        /* base state: subdued */
        .nav-link-text:first-child { color: var(--muted); }
        /* clone (shown on hover via translateY): gold + italic */
        .nav-link-clone {
          color: var(--gold);
          font-style: italic;
          font-weight: 900;
          letter-spacing: 0.25em;
        }

        /* ── Action buttons ── */
        .nav-desktop-actions {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          flex-shrink: 0;
        }
        .btn-nav {
          position: relative;
          background: transparent;
          border: none;
          color: var(--gold);
          padding: 8px 0;
          font-family: var(--font-cinzel);
          font-size: 0.6rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          min-height: 36px;
          display: inline-flex;
          align-items: center;
          overflow: hidden;
          transition: color 0.3s;
        }
        /* Wipe underline effect */
        .btn-nav::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 0;
          width: 0%;
          height: 1.5px;
          background: var(--gold);
          transition: width 0.35s cubic-bezier(0.23,1,0.32,1);
        }
        .btn-nav:hover::after { width: 100%; }
        .btn-nav:hover { color: var(--gold-shimmer, #e8c46a); }

        /* ── Mobile cart button ── */
        .mobile-cart-btn {
          display: none;
          position: relative;
          color: var(--gold-dark);
          text-decoration: none;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(192, 82, 42, 0.07);
          border: 1.5px solid rgba(192, 82, 42, 0.2);
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.3s;
          -webkit-tap-highlight-color: transparent;
        }
        .mobile-cart-btn:hover { border-color: var(--primary); background: rgba(192,82,42,0.13); }
        .mobile-cart-badge {
          position: absolute;
          top: -3px; right: -3px;
          background: var(--primary);
          color: white;
          font-size: 0.5rem;
          font-weight: 800;
          width: 17px; height: 17px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }

        /* ── COLLAPSED PILL ── */
        .nav-pill {
          pointer-events: all;
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(250, 244, 232, 0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(192, 82, 42, 0.25);
          border-radius: 100px;
          box-shadow: 0 8px 32px rgba(44, 26, 14, 0.12);
          padding: 10px 22px;
          cursor: pointer;
          z-index: 1001;
        }
        .pill-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }
        .pill-star { font-size: 0.75rem; color: var(--gold); }
        .pill-text {
          font-family: var(--font-cinzel);
          font-size: 0.8rem;
          font-weight: 900;
          letter-spacing: 0.35em;
          color: #2C1A0E;
          line-height: 1;
        }

        /* ── Breakpoints ── */
        @media (min-width: 1025px) {
          .mobile-cart-btn { display: none; }
        }
        @media (max-width: 1024px) {
          .nav-desktop-links, .nav-desktop-actions { display: none; }
          .mobile-cart-btn { display: flex; }
          .nav-wrapper { padding: 0 1.5rem; padding-right: 7.5rem; }
        }
        @media (max-width: 640px) {
          .nav-full { padding: 0.8rem 0; }
          .logo-main { font-size: 1.3rem; }
          .nav-wrapper { padding: 0 1rem; padding-right: 7rem; }
        }
        @media (max-width: 380px) {
          .logo-sub { display: none; }
          .logo-main { font-size: 1.2rem; }
        }
      `}</style>
    </motion.nav>
  );
}
