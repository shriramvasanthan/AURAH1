'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, Menu } from 'lucide-react';

export default function ElegantMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'The Essence', href: '/', subtitle: 'Our Philosophy' },
    { name: 'The Collection', href: '/products', subtitle: 'Browse Specimens' },
    { name: 'Our Heritage', href: '/story', subtitle: 'A 25 Year Journey' },
    { name: 'The Vault', href: '/admin', subtitle: 'Private Access' },
  ];

  return (
    <>
      {/* Elegant Menu Toggle */}
      <button 
        className={`menu-toggle ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="toggle-text">{isOpen ? 'Close' : 'Menu'}</span>
        <div className="toggle-icon">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="menu-overlay"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Visual Side (Hidden on Mobile) */}
            <div className="menu-sidebar">
                <div className="sidebar-line-container">
                    <div className="sidebar-line">
                        <motion.div 
                            className="sidebar-line-fill"
                            initial={{ height: 0 }}
                            animate={{ height: '100%' }}
                            transition={{ delay: 0.8, duration: 1.5 }}
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
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
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
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .menu-toggle {
            fixed;
            top: 2.5rem;
            right: 4rem;
            z-index: 1000001;
            background: none;
            border: none;
            display: flex;
            align-items: center;
            gap: 1.5rem;
            cursor: pointer;
            outline: none;
        }
        .toggle-text {
            font-size: 0.65rem;
            text-transform: uppercase;
            letter-spacing: 0.4em;
            color: var(--primary);
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        .menu-toggle:hover .toggle-text {
            opacity: 1;
        }
        .toggle-icon {
            width: 3.5rem;
            height: 3.5rem;
            border-radius: 50%;
            border: 1px solid rgba(139, 69, 19, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--bg-warm);
            color: var(--primary);
            transition: all 0.5s ease;
        }
        .menu-toggle:hover .toggle-icon {
            border-color: var(--primary);
            transform: scale(1.1);
        }
        .menu-overlay {
            position: fixed;
            inset: 0;
            z-index: 1000000;
            background: var(--bg-warm);
            display: flex;
        }
        .menu-sidebar {
            width: 35%;
            height: 100%;
            background: rgba(139, 69, 19, 0.03);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: relative;
        }
        .sidebar-line-container {
            height: 60%;
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
            bottom: 4rem;
            left: 4rem;
        }
        .sidebar-est {
            font-family: var(--font-display);
            font-size: 3rem;
            color: rgba(139, 69, 19, 0.1);
        }
        .menu-content {
            flex: 1;
            background: white;
            display: flex;
            align-items: center;
            padding: 0 8rem;
        }
        .menu-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .menu-item {
            margin-bottom: 4rem;
        }
        .menu-link {
            text-decoration: none;
            display: flex;
            flex-direction: column;
        }
        .menu-link-subtitle {
            font-size: 0.65rem;
            text-transform: uppercase;
            letter-spacing: 0.5em;
            color: var(--primary);
            margin-bottom: 1rem;
            opacity: 0.5;
            transition: opacity 0.5s;
        }
        .menu-link:hover .menu-link-subtitle {
            opacity: 1;
        }
        .menu-link-name {
            font-family: var(--font-display);
            font-size: clamp(3rem, 6vw, 6rem);
            color: var(--black);
            transition: all 0.5s ease;
        }
        .menu-link:hover .menu-link-name {
            font-style: italic;
            padding-left: 2rem;
            color: var(--primary);
        }
        @media (max-width: 1024px) {
            .menu-sidebar { display: none; }
            .menu-content { padding: 0 2rem; }
            .menu-toggle { right: 2rem; }
        }
        @media (min-width: 1025px) {
            .menu-toggle { display: none; }
        }
      `}</style>
    </>
  );
}
