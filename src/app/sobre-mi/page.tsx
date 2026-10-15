import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta, projectPath, SITE, SOCIAL } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
    title: "Sobre mí",
    description:
        "Jonathan Matos es un cineasta emergente de Santo Domingo, República Dominicana: director, director de fotografía y editor detrás de Berenjena Studio.",
    path: "/sobre-mi",
    type: "profile",
});

const disciplines = [
    { label: "Comercial", href: "/comercial" },
    { label: "Narrativa", href: "/narrativa" },
    { label: "Reels", href: "/reels" },
];

const projects = [
    { title: "Nike SB", detail: "Comercial", slug: "nike-sb-comerical" },
    { title: "Adidas", detail: "Spec ad", slug: "spec-ad-adidas" },
    { title: "Ekibol RD × Berenjena", detail: "Narrativa", slug: "berenjenaxekibol" },
    { title: "Recap Cosmic Reel", detail: "Reels", slug: "recap-cosmic-reel" },
];

const links = [
    { label: "Instagram", href: "https://www.instagram.com/berenjena.___/" },
    { label: "YouTube", href: "https://www.youtube.com/@berenjenastudios" },
];

function Section({ label, children, last = false }: { label: string; children: React.ReactNode; last?: boolean }) {
    return (
        <section className={`grid grid-cols-1 md:grid-cols-12 gap-10 ${last ? "mb-10" : "mb-32 border-b border-white/20 pb-20"}`}>
            <div className="md:col-span-4">
                <h2 className="font-mono text-xs uppercase text-gray-500 tracking-widest md:sticky md:top-32">{label}</h2>
            </div>
            <div className="md:col-span-8 md:col-start-5">{children}</div>
        </section>
    );
}

export default function SobreMiPage() {
    return (
        <main className="min-h-screen pt-40 pb-20 px-4 md:px-10 bg-black text-white">
            <div className="max-w-[1920px] mx-auto">
                <h1 className="font-sans font-bold uppercase tracking-tighter text-5xl md:text-8xl mb-24">Sobre mí</h1>

                <Section label="Biografía">
                    <div className="text-xl md:text-3xl font-light leading-relaxed">
                        <p className="mb-10">
                            Jonathan Matos es un cineasta emergente con base en Santo Domingo, República Dominicana. Detrás de Berenjena Studio, dirige, fotografía y edita sus propias piezas, cuidando cada historia desde la primera idea hasta el último corte.
                        </p>
                        <p className="mb-10">
                            Su trabajo se mueve entre el comercial, como el de Nike SB, la narrativa, como Ekibol RD, y los reels, siempre con una mirada cinematográfica y un ritmo propio.
                        </p>
                        <p>
                            Desde el Caribe, busca imágenes con luz, textura y movimiento que se sientan auténticas y cercanas: historias hechas aquí, con una identidad visual que no se parece a nadie más.
                        </p>
                    </div>
                </Section>

                <Section label="Disciplinas">
                    <div className="flex flex-wrap gap-x-12 gap-y-4 text-3xl md:text-5xl font-sans font-bold uppercase">
                        {disciplines.map((d) => (
                            <Link key={d.href} href={d.href} className="text-gray-600 hover:text-white transition-colors">
                                {d.label}
                            </Link>
                        ))}
                    </div>
                </Section>

                <Section label="Proyectos">
                    <ul className="divide-y divide-white/10 border-y border-white/10">
                        {projects.map((p) => (
                            <li key={p.slug}>
                                <Link
                                    href={projectPath({ slug: p.slug, id: p.slug })}
                                    className="flex justify-between items-baseline gap-6 py-6 hover:text-accent transition-colors"
                                >
                                    <span className="font-sans text-2xl md:text-4xl font-bold uppercase">{p.title}</span>
                                    <span className="font-mono text-xs uppercase text-gray-500 shrink-0">{p.detail}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </Section>

                <Section label="Síguenos" last>
                    <div className="flex gap-8">
                        {links.map((l) => (
                            <a
                                key={l.href}
                                href={l.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="uppercase font-mono text-xs tracking-widest hover:text-accent transition-colors"
                            >
                                {l.label}
                            </a>
                        ))}
                    </div>
                </Section>
            </div>
        </main>
    );
}
