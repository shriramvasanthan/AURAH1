'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const [tab, setTab] = useState('customer'); // 'customer' | 'admin'
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
      
      // Map Firebase error codes to user-friendly messages
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
        {/* Background decoration */}
        <div className="login-bg-orb orb1" />
        <div className="login-bg-orb orb2" />
        <div className="login-bg-grid" />

        <div className="login-card">
          {/* Logo */}
          <Link href="/" className="login-logo">AURAH</Link>
          <p className="login-tagline">SPICES & NUTS</p>
          <div className="gold-divider" />

          {/* Role Tabs */}
          <div className="role-tabs">
            <button
              className={`role-tab ${tab === 'customer' ? 'active' : ''}`}
              onClick={() => { setTab('customer'); setError(''); setEmail(''); setPassword(''); }}
            >
              <span className="role-icon">🛒</span>
              Customer
            </button>
            <button
              className={`role-tab ${tab === 'admin' ? 'active' : ''}`}
              onClick={() => { setTab('admin'); setError(''); setEmail(''); setPassword(''); }}
            >
              <span className="role-icon">⚙️</span>
              Admin
            </button>
          </div>

          <p className="login-hint">
            {tab === 'customer'
              ? 'Sign in to view your orders and track deliveries'
              : 'Admin access — manage products and orders'}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={tab === 'admin' ? 'admin@aurah.com' : 'you@example.com'}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={3}
              />
            </div>

            {error && <div className="login-error">⚠ {error}</div>}

            <button type="submit" className="btn-gold" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>

          {tab === 'customer' && (
            <p className="register-link">
              New here?{' '}
              <Link href="/register" className="register-anchor">Create a free account</Link>
            </p>
          )}

          <div className="back-link-wrap">
            <Link href="/" className="back-link">← Back to Store</Link>
          </div>
        </div>
      </div>
    </>
  );
}
