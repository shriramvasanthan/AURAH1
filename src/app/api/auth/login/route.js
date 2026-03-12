import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';

// POST /api/auth/login
// Verifies a Firebase ID token and returns the Firestore user profile.
// Used optionally for server-side token verification.
export async function POST(request) {
    try {
        const { idToken } = await request.json();

        if (!idToken) {
            return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
        }

        // Verify token with Firebase Admin
        const decoded = await adminAuth.verifyIdToken(idToken);

        // Fetch Firestore profile
        const doc = await adminDb.collection('users').doc(decoded.uid).get();
        if (!doc.exists) {
            return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
        }

        const profile = doc.data();
        return NextResponse.json({ user: { id: decoded.uid, ...profile } });
    } catch (error) {
        console.error('[Login verify error]', error?.message || error);
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
}
