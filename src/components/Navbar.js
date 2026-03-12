'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/cart', label: 'Cart' },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="nav-container">
          <Link href="/" className="nav-logo">
            <span className="logo-symbol">✦</span>
            <span className="logo-text">AURAH</span>
            <span className="logo-tagline">SPICES & NUTS</span>
          </Link>

          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="nav-link">
                  {link.label}
                  {link.label === 'Cart' && itemCount > 0 && (
                    <span className="cart-badge">{itemCount}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav-right">
            <Link href="/cart" className="cart-icon-btn">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {itemCount > 0 && <span className="cart-badge cart-badge-abs">{itemCount}</span>}
            </Link>

            {user ? (
              <div className="user-menu">
                <Link
                  href={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="user-pill"
                >
                  <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                  <span className="user-name">{user.name.split(' ')[0]}</span>
                  {user.role === 'admin' && <span className="admin-badge">Admin</span>}
                </Link>
                <button className="logout-btn" onClick={handleLogout} title="Sign out">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                  </svg>
                </button>
              </div>
            ) : (
              <Link href="/login" className="btn-login">
                Sign In
              </Link>
            )}

            <button
              className={`hamburger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <ul>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="mobile-link" onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            </li>
          ))}
          {user ? (
            <>
              <li>
                <Link href={user.role === 'admin' ? '/admin' : '/dashboard'} className="mobile-link" onClick={() => setMenuOpen(false)}>
                  {user.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
                </Link>
              </li>
              <li>
                <button className="mobile-link mobile-logout" onClick={handleLogout}>Sign Out</button>
              </li>
            </>
          ) : (
            <li>
              <Link href="/login" className="mobile-link" onClick={() => setMenuOpen(false)}>Sign In</Link>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}

