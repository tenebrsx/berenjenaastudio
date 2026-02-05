"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Chrome } from "lucide-react";
import Image from "next/image";

export default function AdminLogin() {
    const { user, isWhitelisted, signInWithGoogle, loading, error } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // If user is authenticated and whitelisted, redirect to admin
        if (user && isWhitelisted) {
            router.push("/admin");
        }
    }, [user, isWhitelisted, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-pulse">
                    <div className="w-12 h-12 border-4 border-zinc-700 border-t-[#FF8562] rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Branding */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold text-white mb-2">
                        BEREJENA STUDIO
                    </h1>
                    <p className="text-sm text-zinc-400">Panel de Administración</p>
                </div>

                {/* Login Card */}
                <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-800 p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-semibold text-white mb-2">
                            Inicia sesión para continuar
                        </h2>
                        <p className="text-sm text-zinc-400">
                            Usa tu cuenta de Google autorizada
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-950/50 border border-red-800 rounded-xl">
                            <p className="text-sm text-red-400 text-center font-medium">
                                {error}
                            </p>
                            {error.includes("not authorized") && (
                                <p className="text-xs text-red-500 text-center mt-2">
                                    Por favor contacta al administrador para acceso.
                                </p>
                            )}
                        </div>
                    )}

                    {/* Google Sign-In Button */}
                    <button
                        onClick={signInWithGoogle}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-[#FF8562] border-2 border-[#FF8562] rounded-xl font-medium text-white hover:bg-[#ff9575] hover:border-[#ff9575] transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Chrome className="w-5 h-5" />
                        Iniciar sesión con Google
                    </button>

                    {/* Decorative Elements */}
                    <div className="mt-8 pt-6 border-t border-zinc-800">
                        <p className="text-xs text-zinc-500 text-center">
                            Solo personal autorizado
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-xs text-zinc-600">
                        © {new Date().getFullYear()} Berejena Studio. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
}
