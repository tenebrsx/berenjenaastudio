import type { Metadata } from "next";
import CategoryClient from "./CategoryClient";
import { buildProjects, categoryInfo, pageMeta } from "@/lib/seo";

export const dynamicParams = false;

const INTROS: Record<string, string> = {
    comercial: "Comerciales y spots para marcas, dirigidos, filmados y editados por Berenjena Studio en Santo Domingo, República Dominicana.",
    narrativa: "Proyectos narrativos de Berenjena Studio: historias filmadas en Santo Domingo, República Dominicana.",
    reels: "Reels y piezas cortas para redes de Berenjena Studio, desde Santo Domingo, República Dominicana.",
};
const intro = (slug: string) =>
    INTROS[slug] ?? `${categoryInfo(slug).label}: proyectos de Berenjena Studio en Santo Domingo, República Dominicana.`;

export function generateStaticParams() {
    const slugs = new Set(buildProjects().map((p) => categoryInfo(p.category).slug).filter(Boolean));
    ["comercial", "narrativa", "reels"].forEach((c) => slugs.add(c));
    return Array.from(slugs).map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
    const { category } = await params;
    return pageMeta({ title: categoryInfo(category).label, description: intro(category), path: `/${category}` });
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;
    return <CategoryClient category={category} intro={intro(category)} />;
}
