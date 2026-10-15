import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetail, { type Project } from "@/components/ProjectDetail";
import {
    SITE, SITE_NAME, buildProjects, cleanSlug, displayTitle, findByCleanSlug, pageMeta,
    posterUrl, projectDescription, toISO, videoEmbed, categoryInfo,
} from "@/lib/seo";
import { localMedia } from "@/lib/media";

export const dynamicParams = false;

export function generateStaticParams() {
    return buildProjects().map((p) => ({ slug: cleanSlug(p) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const p = findByCleanSlug((await params).slug);
    if (!p) return { title: "Proyecto no encontrado" };
    return pageMeta({
        title: displayTitle(p),
        description: projectDescription(p),
        path: `/proyectos/${cleanSlug(p)}`,
        image: posterUrl(p),
        type: "video.other",
    });
}

export default async function ProyectoPage({ params }: { params: Promise<{ slug: string }> }) {
    const p = findByCleanSlug((await params).slug);
    if (!p) notFound();
    const url = `${SITE}/proyectos/${cleanSlug(p)}`;
    const poster = posterUrl(p);
    const embed = videoEmbed(p.videoUrl);
    const preview = /\.(mp4|webm)/.test(p.thumbnail || "") ? localMedia(p.thumbnail) : undefined;
    const abs = (u?: string) => (u ? (u.startsWith("http") ? u : `${SITE}${u}`) : undefined);
    const jsonLd = [
        {
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: displayTitle(p),
            description: projectDescription(p),
            thumbnailUrl: [abs(poster) ?? `${SITE}/og-default.jpg`],
            uploadDate: toISO(p.createdAt) ?? toISO(p.updatedAt),
            ...(embed ? { embedUrl: embed.embedUrl } : {}),
            ...(preview ? { contentUrl: abs(preview) } : {}),
            genre: categoryInfo(p.category).label,
            url,
            inLanguage: "es-DO",
            locationCreated: { "@type": "Place", name: "Santo Domingo, República Dominicana" },
            productionCompany: { "@type": "Organization", name: SITE_NAME, url: SITE },
            ...(p.credits?.length
                ? { contributor: p.credits.map((c) => ({ "@type": "Person", name: c.name, jobTitle: c.role })) }
                : {}),
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "Inicio", item: SITE },
                { "@type": "ListItem", position: 2, name: categoryInfo(p.category).label, item: `${SITE}/${categoryInfo(p.category).slug}` },
                { "@type": "ListItem", position: 3, name: displayTitle(p), item: url },
            ],
        },
    ];
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
            <ProjectDetail slug={p.slug} initialProject={p as unknown as Project} />
        </>
    );
}
