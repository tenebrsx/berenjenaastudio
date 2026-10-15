import type { Metadata } from "next";
import { slugify } from "@/lib/utils";
import { getBuildProjects, localMedia } from "@/lib/media";

export const SITE = "https://berenjenastudio.com";
export const SITE_NAME = "Berenjena Studio";
export const DEFAULT_OG = "/og-default.jpg";
export const DEFAULT_DESCRIPTION =
    "Berenjena Studio: cine y video desde Santo Domingo, República Dominicana. Comerciales, narrativa y reels de Jonathan Matos, director, director de fotografía y editor.";
export const SOCIAL = ["https://www.instagram.com/berenjena.___/", "https://www.youtube.com/@berenjenastudios"];

export interface SeoProject {
    id: string;
    slug: string;
    title?: string;
    category?: string;
    thumbnail?: string;
    thumbnailPoster?: string;
    videoUrl?: string | null;
    description?: string | null;
    credits?: { role: string; name: string }[] | null;
    gallery?: string[] | null;
    createdAt?: unknown;
    updatedAt?: unknown;
}

// Clean public URLs/titles without renaming Firestore data (keyed by the stored slug).
const OVERRIDES: Record<string, { slug: string; title: string }> = {
    "nike-sb-comerical": { slug: "nike-sb-comercial", title: "Nike SB Comercial" },
    COMERCIAL: { slug: "comercial", title: "Comercial" },
    berenjenaxekibol: { slug: "ekibol-rd-x-berenjena", title: "Ekibol RD x Berenjena" },
    "spec-ad-adidas": { slug: "spec-ad-adidas", title: "Spec Ad Adidas" },
};

const CATEGORIES: Record<string, { slug: string; label: string }> = {
    commercial: { slug: "comercial", label: "Comercial" },
    comercial: { slug: "comercial", label: "Comercial" },
    narrative: { slug: "narrativa", label: "Narrativa" },
    narrativa: { slug: "narrativa", label: "Narrativa" },
    reels: { slug: "reels", label: "Reels" },
    "music-video": { slug: "videos-musicales", label: "Videos musicales" },
    "videos-musicales": { slug: "videos-musicales", label: "Videos musicales" },
    spec: { slug: "spec", label: "Spec" },
};
/** Old English category URLs → Spanish ones (also used for firebase.json redirects). */
export const CATEGORY_REDIRECTS = { commercial: "comercial", narrative: "narrativa", "music-video": "videos-musicales" };

export function categoryInfo(category?: string | null) {
    const key = slugify(category || "");
    if (CATEGORIES[key]) return CATEGORIES[key];
    const label = (category || "").trim();
    return { slug: key, label: label.charAt(0).toUpperCase() + label.slice(1).toLowerCase() };
}

export const cleanSlug = (p: Pick<SeoProject, "slug" | "title" | "id">) =>
    OVERRIDES[p.slug]?.slug ?? (slugify(p.slug || p.title || p.id) || p.id);

export const displayTitle = (p: Pick<SeoProject, "slug" | "title">) =>
    OVERRIDES[p.slug]?.title ?? (p.title?.trim() || "Proyecto");

export const buildProjects = () => getBuildProjects<SeoProject>().filter((p) => p.slug);

/** Pre-rendered page if the project existed at build time; client page otherwise (new uploads). */
export function projectPath(p: Pick<SeoProject, "slug" | "title" | "id">) {
    return buildProjects().some((b) => b.slug === p.slug)
        ? `/proyectos/${cleanSlug(p)}`
        : `/project?slug=${encodeURIComponent(p.slug)}`;
}

export const findByCleanSlug = (s: string) => buildProjects().find((p) => cleanSlug(p) === s);

export function projectDescription(p: SeoProject) {
    if (p.description?.trim()) return p.description.trim();
    const cat = categoryInfo(p.category).label.toLowerCase();
    const people = Array.from(new Set((p.credits || []).map((c) => c.name))).join(", ");
    return `${displayTitle(p)}: proyecto de ${cat || "video"} de Berenjena Studio, Santo Domingo, República Dominicana${people ? `, con ${people}` : ""}.`;
}

export function toISO(ts: unknown): string | undefined {
    if (!ts) return undefined;
    if (typeof ts === "string") return new Date(ts).toISOString();
    const s = (ts as { _seconds?: number; seconds?: number })._seconds ?? (ts as { seconds?: number }).seconds;
    return typeof s === "number" ? new Date(s * 1000).toISOString() : undefined;
}

export function posterUrl(p: SeoProject): string | undefined {
    const poster = p.thumbnailPoster || (/\.(mp4|webm)/.test(p.thumbnail || "") ? undefined : p.thumbnail);
    return localMedia(poster);
}

export function videoEmbed(url?: string | null): { embedUrl: string; platform: string } | null {
    if (!url) return null;
    const yt = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
    if (yt && yt[2].length === 11) return { embedUrl: `https://www.youtube.com/embed/${yt[2]}`, platform: "youtube" };
    const vm = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/);
    if (vm) return { embedUrl: `https://player.vimeo.com/video/${vm[1]}`, platform: "vimeo" };
    return null;
}

/** Per-page metadata with canonical + matching Open Graph / Twitter tags. */
export function pageMeta(opts: { title?: string; description?: string; path: string; image?: string; noindex?: boolean; type?: "website" | "video.other" | "profile" }): Metadata {
    const description = opts.description ?? DEFAULT_DESCRIPTION;
    const ogTitle = opts.title ? `${opts.title} · ${SITE_NAME}` : `${SITE_NAME} · Cine y video en Santo Domingo`;
    const images = [{ url: opts.image || DEFAULT_OG }];
    return {
        ...(opts.title ? { title: opts.title } : {}),
        description,
        alternates: { canonical: opts.path },
        openGraph: { type: (opts.type as "website") ?? "website", locale: "es_DO", siteName: SITE_NAME, url: opts.path, title: ogTitle, description, images },
        twitter: { card: "summary_large_image", title: ogTitle, description, images: images.map((i) => i.url) },
        ...(opts.noindex ? { robots: { index: false, follow: true } } : {}),
    };
}
