"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    User,
    signInWithPopup,
    signOut as firebaseSignOut,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isWhitelisted: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    error: string | null;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    isWhitelisted: false,
    signInWithGoogle: async () => { },
    signOut: async () => { },
    error: null,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isWhitelisted, setIsWhitelisted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Check if email is whitelisted
    const checkWhitelist = async (email: string): Promise<boolean> => {
        try {
            const whitelistDoc = await getDoc(doc(db, 'whitelist', email));
            return whitelistDoc.exists() && whitelistDoc.data()?.active === true;
        } catch (err) {
            console.error("Error checking whitelist:", err);
            return false;
        }
    };

    // Sign in with Google
    const signInWithGoogle = async () => {
        try {
            setError(null);
            const result = await signInWithPopup(auth, googleProvider);
            const email = result.user.email;

            if (!email) {
                throw new Error("No email found in Google account");
            }

            // Check if email is whitelisted
            const whitelisted = await checkWhitelist(email);

            if (!whitelisted) {
                // Sign out immediately if not whitelisted
                await firebaseSignOut(auth);
                setError("Access denied. Your email is not authorized for this admin panel.");
                return;
            }

            setIsWhitelisted(true);
            router.push('/admin');
        } catch (err: any) {
            console.error("Sign in error:", err);
            if (err.code === 'auth/popup-closed-by-user') {
                setError("Sign-in cancelled");
            } else {
                setError(err.message || "Failed to sign in");
            }
        }
    };

    // Sign out
    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            setIsWhitelisted(false);
            router.push('/admin/login');
        } catch (err: any) {
            console.error("Sign out error:", err);
            setError(err.message || "Failed to sign out");
        }
    };

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);

            if (user?.email) {
                const whitelisted = await checkWhitelist(user.email);
                setIsWhitelisted(whitelisted);

                // If not whitelisted, sign them out
                if (!whitelisted && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
                    await firebaseSignOut(auth);
                    router.push('/admin/login');
                }
            } else {
                setIsWhitelisted(false);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isWhitelisted,
            signInWithGoogle,
            signOut,
            error,
        }}>
            {children}
        </AuthContext.Provider>
    );
}
