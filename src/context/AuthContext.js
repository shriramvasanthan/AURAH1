'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Listen to Firebase auth state — fires on page load, login, and logout
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Fetch the Firestore profile (role, phone, address, etc.)
                try {
                    const res = await fetch(`/api/user/profile?uid=${firebaseUser.uid}`);
                    if (res.ok) {
                        const { user: profile } = await res.json();
                        setUser(profile);
                    } else if (res.status === 404) {
                        // [AUTO-SYNC] If Auth exists but profile doesn't, create it now!
                        // This handles cases where initial registration sync failed.
                        const syncRes = await fetch('/api/auth/register', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                uid: firebaseUser.uid,
                                name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                                email: firebaseUser.email
                            }),
                        });
                        if (syncRes.ok) {
                            const { user: profile } = await syncRes.json();
                            setUser(profile);
                        } else {
                            // Fallback if sync fails
                            setUser({
                                id: firebaseUser.uid,
                                uid: firebaseUser.uid,
                                name: firebaseUser.displayName || '',
                                email: firebaseUser.email,
                                role: 'customer',
                            });
                        }
                    } else {
                        // Other error fallback
                        setUser({
                            id: firebaseUser.uid,
                            uid: firebaseUser.uid,
                            name: firebaseUser.displayName || '',
                            email: firebaseUser.email,
                            role: 'customer',
                        });
                    }
                } catch {
                    setUser({
                        id: firebaseUser.uid,
                        uid: firebaseUser.uid,
                        name: firebaseUser.displayName || '',
                        email: firebaseUser.email,
                        role: 'customer',
                    });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Sign in with Firebase Auth, then load Firestore profile
    const login = async (email, password) => {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = credential.user;

        const res = await fetch(`/api/user/profile?uid=${firebaseUser.uid}`);
        if (!res.ok) {
            if (res.status === 404) {
                // [AUTO-SYNC] Try to sync on-the-fly during login
                const syncRes = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        uid: firebaseUser.uid,
                        name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                        email: firebaseUser.email
                    }),
                });
                if (syncRes.ok) {
                    const { user: profile } = await syncRes.json();
                    setUser(profile);
                    return profile;
                }
            }
            throw new Error('Failed to load user profile');
        }
        const { user: profile } = await res.json();
        setUser(profile);
        return profile;
    };

    // Create Firebase Auth user, save Firestore profile, return profile
    const register = async (name, email, password) => {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = credential.user;

        // Set display name on the Firebase Auth user
        await updateProfile(firebaseUser, { displayName: name });

        // Create Firestore user profile via API
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid: firebaseUser.uid, name, email }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        setUser(data.user);
        return data.user;
    };

    const logout = () => signOut(auth);

    const refreshUser = async () => {
        if (!user?.uid && !user?.id) return;
        const uid = user?.uid || user?.id;
        try {
            const res = await fetch(`/api/user/profile?uid=${uid}`);
            if (res.ok) {
                const { user: profile } = await res.json();
                setUser(profile);
            }
        } catch { }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
