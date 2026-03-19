'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Login error details:', err);
      let message = err.message;
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        message = 'Invalid email or password. Please try again.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (err.code === 'auth/too-many-requests') {
        message = 'Too many failed attempts. Please try again later or reset your password.';
      } else if (err.code === 'auth/network-request-failed') {
        message = 'Network error. Please check your internet connection.';
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-page">
        <div className="login-bg-orb orb1" />
        <div className="login-bg-orb orb2" />
        <div className="login-bg-grid" />

        <div className="login-card">
          {/* Logo */}
          <Link href="/" className="login-logo">AURAH</Link>
          <p className="login-tagline">SPICES &amp; NUTS</p>
          <div className="gold-divider" />

          <p className="login-hint">
            Sign in to view your orders and track deliveries
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                className="form-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                inputMode="email"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={3}
                autoComplete="current-password"
              />
            </div>

            {error && <div className="login-error" role="alert">⚠ {error}</div>}

            <button
              type="submit"
              className="btn-gold login-submit-btn"
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>

          <p className="register-link">
            New here?{' '}
            <Link href="/register" className="register-anchor">Create a free account</Link>
          </p>

          <div className="back-link-wrap">
            <Link href="/" className="back-link">← Back to Store</Link>
          </div>
        </div>
      </div>

      <style>{`
        .login-page {
          min-height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 20px 40px;
          position: relative;
          overflow: hidden;
          background: var(--black);
        }
        .login-bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }
        .orb1 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(192, 82, 42, 0.1) 0%, transparent 70%);
          top: -100px; right: -100px;
          animation: float 10s ease-in-out infinite;
        }
        .orb2 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(232, 160, 48, 0.07) 0%, transparent 70%);
          bottom: -80px; left: -80px;
          animation: float 8s ease-in-out infinite reverse;
        }
        .login-bg-grid {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(192, 82, 42, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(192, 82, 42, 0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          z-index: 0;
        }
        .login-card {
          width: 100%;
          max-width: 440px;
          background: #FAF4E8;
          border: 1px solid rgba(192, 82, 42, 0.2);
          border-radius: 12px;
          padding: 44px 40px;
          position: relative;
          z-index: 1;
          animation: fadeInUp 0.5s ease;
          box-shadow: 0 12px 60px rgba(44, 26, 14, 0.12);
        }
        .login-logo {
          display: block;
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 900;
          letter-spacing: 0.4em;
          background: linear-gradient(135deg, var(--gold-dark), var(--gold), var(--gold-shimmer));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-decoration: none;
          line-height: 1;
          margin-bottom: 4px;
        }
        .login-tagline {
          font-family: var(--font-display);
          font-size: 0.5rem;
          letter-spacing: 0.5em;
          color: var(--muted);
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .gold-divider {
          width: 48px;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          margin: 16px 0;
        }
        .login-hint {
          font-size: 0.85rem;
          color: var(--muted);
          line-height: 1.5;
          margin-bottom: 24px;
        }
        .login-error {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 6px;
          font-size: 0.83rem;
          margin-bottom: 16px;
          line-height: 1.5;
        }
        .login-submit-btn {
          width: 100%;
          justify-content: center;
          margin-top: 4px;
          font-size: 0.75rem;
          letter-spacing: 0.3em;
          padding: 16px 24px;
          min-height: 52px;
        }
        .register-link {
          margin-top: 20px;
          text-align: center;
          font-size: 0.82rem;
          color: var(--muted);
        }
        .register-anchor {
          color: var(--gold);
          font-weight: 700;
          text-decoration: none;
          transition: color 0.3s;
        }
        .register-anchor:hover { color: var(--gold-dark); text-decoration: underline; }
        .back-link-wrap {
          text-align: center;
          margin-top: 14px;
        }
        .back-link {
          font-family: var(--font-display);
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--muted);
          text-decoration: none;
          opacity: 0.7;
          transition: opacity 0.3s;
        }
        .back-link:hover { opacity: 1; }

        /* ===== Mobile ===== */
        @media (max-width: 480px) {
          .login-page { padding: 70px 16px 30px; }
          .login-card {
            padding: 32px 24px;
            border-radius: 10px;
          }
          .login-logo { font-size: 1.75rem; }
        }
        @media (max-width: 360px) {
          .login-card { padding: 28px 18px; }
          .login-logo { font-size: 1.5rem; }
        }
      `}</style>
    </>
  );
}
