import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Página no encontrada", robots: { index: false, follow: true } };

export default function NotFound() {
    return (
        <main className="min-h-screen pt-40 pb-20 px-4 md:px-10 bg-black text-white">
            <div className="max-w-[1400px] mx-auto">
                <h1 className="text-6xl md:text-9xl font-sans font-bold uppercase mb-6">404</h1>
                <p className="text-xl font-light text-zinc-400 mb-10">Esta página no existe o fue movida.</p>
                <Link href="/" className="font-mono text-xs uppercase hover:text-accent transition-colors">← Volver al inicio</Link>
            </div>
        </main>
    );
}
