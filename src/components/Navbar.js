'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import CartButton from '@/components/CartButton';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const hoverTimerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const isScrolled = window.scrollY > 40;
      setScrolled(isScrolled);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
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

  const isCollapsed = scrolled;

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
                className={`nav-link-prime ${hoveredLink === link.href ? 'nav-link-prime--active' : ''}`}
                onMouseEnter={() => setHoveredLink(link.href)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <span className="nav-link-prime-text">{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="nav-desktop-actions">
            <CartButton />
            {user ? (
              <>
                <Link href="/dashboard" className="btn-nav">Dashboard</Link>
                <button onClick={handleLogout} className="btn-nav">Logout</button>
              </>
            ) : (
              <Link href="/login" className="btn-nav">Sign In</Link>
            )}
          </div>

          {/* Mobile cart button */}
          <div className="mobile-cart-btn">
            <CartButton />
          </div>
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
            <div className="pill-cart">
              <CartButton />
            </div>
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
          pointer-events: none;
        }

        /* ── FULL NAV ── */
        .nav-full {
          pointer-events: all;
          padding: 1rem 0;
          transition: all 0.4s ease;
          background: #FAF4E8;
          border-bottom: 1px solid rgba(139, 69, 19, 0.1);
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

        /* Nav links */
        .nav-desktop-links {
          display: flex;
          align-items: center;
          gap: 2.5rem;
          flex: 1;
          justify-content: center;
        }
        .nav-link-prime {
          text-decoration: none;
          display: block;
          position: relative;
          padding: 4px 8px;
        }
        .nav-link-prime-text {
          font-family: var(--font-cinzel);
          font-size: 13px;
          letter-spacing: 0.15rem;
          text-transform: uppercase;
          font-weight: 700;
          color: #666666;
          transition: all 0.3s ease;
          display: block;
        }
        .nav-link-prime:hover .nav-link-prime-text {
          color: var(--gold);
          transform: translateY(-2px);
        }
        .nav-link-prime--active .nav-link-prime-text {
          color: var(--gold);
        }

        /* Action buttons */
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

        /* Mobile cart */
        .mobile-cart-btn {
          display: none;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* Pill cart */
        .pill-cart {
          display: flex;
          align-items: center;
          margin-left: 12px;
          padding-left: 12px;
          border-left: 1px solid rgba(192,82,42,0.2);
        }

        /* COLLAPSED PILL */
        .nav-pill {
          pointer-events: auto;
          position: fixed;
          top: 15px;
          left: 50%;
          transform: translateX(-50%) !important;
          background: #FAF4E8 !important;
          border: 1.5px solid #C9A84C;
          border-radius: 40px;
          box-shadow: 0 10px 30px rgba(44, 26, 14, 0.2);
          padding: 8px 20px;
          cursor: pointer;
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 140px;
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

        /* Breakpoints */
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