'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav className={`navbar-archival ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-wrapper">
        <Link href="/" className="nav-logo-group">
          <div className="logo-arch-symbol">✦</div>
          <div className="logo-stack">
            <span className="logo-main">AURAH</span>
            <span className="logo-sub">THE EARTHY ALCHEMIST</span>
          </div>
        </Link>
        
        <div className="nav-center-links">
           <Link href="/" className="nav-link-arch">Home</Link>
           <Link href="/products" className="nav-link-arch">Products</Link>
           <Link href="/cart" className="nav-link-arch">Cart ({itemCount})</Link>
        </div>

        <div className="nav-actions">
           {user ? (
             <>
               <Link href="/dashboard" className="btn-outline">Dashboard</Link>
               <button onClick={handleLogout} className="btn-outline">Logout</button>
             </>
           ) : (
             <>
               <Link href="/login" className="btn-outline">Sign In</Link>
             </>
           )}
        </div>
      </div>

      <style jsx>{`
        .navbar-archival {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 3.5rem 0;
          transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .scrolled {
          padding: 1.5rem 0;
          background: hsla(45, 61%, 90%, 0.96);
          backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(192, 82, 42, 0.1);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
        }
        .nav-wrapper {
          max-width: var(--container-max);
          margin: 0 auto;
          padding: 0 4rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-logo-group {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          text-decoration: none;
        }
        .logo-arch-symbol {
          font-size: 1.2rem;
          color: var(--gold);
        }
        .logo-main {
          font-family: var(--font-cinzel);
          font-size: 1.8rem;
          font-weight: 900;
          letter-spacing: 0.35em;
          color: var(--white);
          line-height: 1;
        }
        .logo-sub {
          font-family: var(--font-cinzel);
          font-size: 0.45rem;
          letter-spacing: 0.6em;
          text-transform: uppercase;
          color: var(--muted);
          margin-top: 0.4rem;
          display: block;
        }
        .nav-center-links {
          display: flex;
          align-items: center;
          gap: 3rem;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
        .nav-link-arch:hover {
          color: var(--gold);
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .btn-outline {
          background: transparent;
          border: 1.5px solid var(--gold);
          color: var(--gold);
          padding: 10px 24px;
          font-family: var(--font-display);
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 900;
          border-radius: 4px;
          text-decoration: none;
          transition: var(--transition);
        }
        .btn-outline:hover {
          background: var(--gold);
          color: var(--black);
        }
        @media (max-width: 1024px) {
          .nav-wrapper { padding: 0 2rem; }
          .nav-center-links { display: none; }
        }
      `}</style>
    </nav>
  );
}

