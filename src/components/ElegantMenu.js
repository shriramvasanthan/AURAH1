'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function ElegantMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const router = useRouter();

  // Close menu on route change / escape key
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    router.push('/');
  };

  const menuItems = [
    { name: 'Home', href: '/', subtitle: 'Our Philosophy' },
    { name: 'Products', href: '/products', subtitle: 'Browse Specimens' },
    { name: 'Heritage', href: '/story', subtitle: 'A 25 Year Journey' },
    { name: 'Contact', href: '/contact', subtitle: 'Reach Out' },
    { name: 'Cart', href: '/cart', subtitle: `${itemCount} item${itemCount !== 1 ? 's' : ''}` },
  ];

  return (
    <>
      {/* Menu Toggle Button */}
      <button
        className={`menu-toggle ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        <span className="toggle-text">{isOpen ? 'Close' : 'Menu'}</span>
        <div className="toggle-icon">
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="menu-overlay"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Decorative Sidebar — desktop only */}
            <div className="menu-sidebar">
              <div className="sidebar-line-container">
                <div className="sidebar-line">
                  <motion.div
                    className="sidebar-line-fill"
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    transition={{ delay: 0.6, duration: 1.2 }}
                  />
                </div>
              </div>
              <div className="sidebar-footer">
                <span className="sidebar-est">EST. 1998</span>
              </div>
            </div>

            {/* Menu Links */}
            <div className="menu-content">
              <nav className="menu-nav">
                <ul className="menu-list">
                  {menuItems.map((item, i) => (
                    <motion.li
                      key={item.name}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + i * 0.08, duration: 0.7 }}
                      className="menu-item"
                    >
                      <Link
                        href={item.href}
                        className="menu-link"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="menu-link-subtitle">{item.subtitle}</span>
                        <span className="menu-link-name">{item.name}</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                {/* Auth actions */}
                <motion.div
                  className="menu-auth"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  {user ? (
                    <>
                      <Link href="/dashboard" className="menu-auth-link" onClick={() => setIsOpen(false)}>
                        Dashboard
                      </Link>
                      <button className="menu-auth-btn" onClick={handleLogout}>
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link href="/login" className="menu-auth-link" onClick={() => setIsOpen(false)}>
                      Sign In
                    </Link>
                  )}
                </motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .menu-toggle {
          position: fixed;
          top: 2rem;
          right: 2rem;
          z-index: 1000001;
          background: var(--bg-warm);
          border: 1px solid rgba(139, 69, 19, 0.2);
          border-radius: 50px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 1rem 0.6rem 0.6rem;
          cursor: pointer;
          outline: none;
          transition: all 0.3s ease;
          box-shadow: 0 2px 12px rgba(44, 26, 14, 0.08);
        }
        .menu-toggle:hover {
          border-color: var(--primary);
          box-shadow: 0 4px 20px rgba(192, 82, 42, 0.15);
        }
        .menu-toggle.active {
          border-color: var(--primary);
          background: var(--primary);
          color: white;
        }
        .toggle-text {
          font-family: var(--font-display);
          font-size: 0.55rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: var(--primary);
          font-weight: 700;
          transition: color 0.3s;
        }
        .menu-toggle.active .toggle-text {
          color: white;
        }
        .toggle-icon {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          transition: all 0.3s ease;
          flex-shrink: 0;
        }
        .menu-toggle.active .toggle-icon {
          color: white;
        }
        .menu-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000000;
          background: var(--bg-warm);
          display: flex;
        }
        .menu-sidebar {
          width: 30%;
          height: 100%;
          background: rgba(139, 69, 19, 0.03);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
          border-right: 1px solid rgba(139, 69, 19, 0.06);
        }
        .sidebar-line-container {
          height: 50%;
          width: 1px;
          background: rgba(139, 69, 19, 0.05);
          position: relative;
        }
        .sidebar-line-fill {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          background: var(--primary);
        }
        .sidebar-footer {
          position: absolute;
          bottom: 3rem;
          left: 3rem;
        }
        .sidebar-est {
          font-family: var(--font-display);
          font-size: 2.5rem;
          color: rgba(139, 69, 19, 0.1);
          letter-spacing: 0.2em;
        }
        .menu-content {
          flex: 1;
          background: white;
          display: flex;
          align-items: center;
          padding: 0 6rem;
          overflow-y: auto;
        }
        .menu-nav {
          width: 100%;
        }
        .menu-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .menu-item {
          margin-bottom: 3rem;
        }
        .menu-link {
          text-decoration: none;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .menu-link-subtitle {
          font-family: var(--font-display);
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.5em;
          color: var(--primary);
          opacity: 0.5;
          transition: opacity 0.3s;
        }
        .menu-link:hover .menu-link-subtitle {
          opacity: 1;
        }
        .menu-link-name {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 5vw, 5rem);
          color: var(--black);
          transition: all 0.4s ease;
          line-height: 1;
        }
        .menu-link:hover .menu-link-name {
          font-style: italic;
          padding-left: 1.5rem;
          color: var(--primary);
        }
        .menu-auth {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding-top: 2.5rem;
          border-top: 1px solid rgba(139, 69, 19, 0.1);
          margin-top: 1rem;
        }
        .menu-auth-link,
        .menu-auth-btn {
          font-family: var(--font-display);
          font-size: 0.7rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--gold-dark);
          text-decoration: none;
          border: 1.5px solid rgba(192, 82, 42, 0.3);
          padding: 12px 24px;
          border-radius: 4px;
          transition: all 0.3s;
          background: none;
          cursor: pointer;
          font-weight: 700;
          min-height: 44px;
          display: inline-flex;
          align-items: center;
        }
        .menu-auth-link:hover,
        .menu-auth-btn:hover {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        /* Hide on desktop — ElegantMenu is mobile/tablet only */
        @media (min-width: 1025px) {
          .menu-toggle {
            display: none;
          }
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .menu-sidebar {
            display: none;
          }
          .menu-content {
            padding: 6rem 3rem 3rem;
            align-items: flex-start;
          }
          .menu-nav {
            padding-top: 2rem;
          }
          .menu-item {
            margin-bottom: 2rem;
          }
        }

        /* Mobile */
        @media (max-width: 640px) {
          .menu-toggle {
            top: 1.25rem;
            right: 1.25rem;
            padding: 0.5rem 0.8rem 0.5rem 0.5rem;
            gap: 0.5rem;
          }
          .toggle-icon {
            width: 1.8rem;
            height: 1.8rem;
          }
          .menu-content {
            padding: 5rem 1.5rem 2rem;
          }
          .menu-link-name {
            font-size: clamp(2rem, 10vw, 3.5rem);
          }
          .menu-item {
            margin-bottom: 1.5rem;
          }
          .menu-auth {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
        }
      `}</style>
    </>
  );
}
