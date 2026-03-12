'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirm) { setError('Passwords do not match'); return; }
        setLoading(true);
        try {
            await register(name, email, password);
            router.push('/dashboard');
        } catch (err) {
            console.error('Registration error details:', err);
            
            // Map Firebase error codes to user-friendly messages
            let message = err.message;
            if (err.code === 'auth/email-already-in-use') {
                message = 'This email is already registered. Please try logging in instead.';
            } else if (err.code === 'auth/invalid-email') {
                message = 'Please enter a valid email address.';
            } else if (err.code === 'auth/weak-password') {
                message = 'Password should be at least 6 characters.';
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
            <div className="register-page">
                <div className="reg-bg-orb orb1" />
                <div className="reg-bg-orb orb2" />
                <div className="reg-bg-grid" />

                <div className="reg-card">
                    <Link href="/" className="reg-logo">AURAH</Link>
                    <p className="reg-tagline">Create your account</p>
                    <div className="gold-divider" style={{ margin: '0 0 28px' }} />

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input className="form-input" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" required minLength={6} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <input className="form-input" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" required />
                        </div>

                        {error && <div className="reg-error">⚠ {error}</div>}

                        <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                            {loading ? 'Creating Account...' : 'Create Account →'}
                        </button>
                    </form>

                    <p className="login-cta">
                        Already have an account?{' '}
                        <Link href="/login" className="login-cta-link">Sign in</Link>
                    </p>
                    <div style={{ textAlign: 'center', marginTop: '12px' }}>
                        <Link href="/" className="back-link">← Back to Store</Link>
                    </div>
                </div>
            </div>

        </>
    );
}
