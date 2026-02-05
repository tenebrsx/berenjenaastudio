"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user, isWhitelisted, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // If not loading and user is not authenticated or not whitelisted, redirect to login
        if (!loading && (!user || !isWhitelisted)) {
            router.push('/admin/login');
        }
    }, [user, isWhitelisted, loading, router]);

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
                <div className="animate-pulse">
                    <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-800 rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    // Only render children if authenticated AND whitelisted
    if (!user || !isWhitelisted) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
