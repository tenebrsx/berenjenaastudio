import type { MetadataRoute } from "next";
import { SITE, buildProjects, categoryInfo, cleanSlug, displayTitle, posterUrl, projectDescription, toISO, videoEmbed } from "@/lib/seo";
import { localMedia } from "@/lib/media";

export const dynamic = "force-static";

const abs = (u: string) => (u.startsWith("http") ? u : `${SITE}${u}`);

export default function sitemap(): MetadataRoute.Sitemap {
    const projects = buildProjects();
    const dates = projects.map((p) => toISO(p.updatedAt) ?? toISO(p.createdAt)).filter(Boolean) as string[];
    const latest = dates.sort().at(-1) ?? new Date().toISOString();

    const pages = ["", "/work", "/index", "/gallery", "/sobre-mi"].map((path) => ({
        url: `${SITE}${path}`,
        lastModified: latest,
        priority: path === "" ? 1 : 0.7,
    }));
    const categories = Array.from(new Set(projects.map((p) => categoryInfo(p.category).slug).filter(Boolean))).map((c) => ({
        url: `${SITE}/${c}`,
        lastModified: latest,
        priority: 0.6,
    }));
    const projectPages = projects.map((p) => {
        const poster = posterUrl(p);
        const embed = videoEmbed(p.videoUrl);
        const preview = /\.(mp4|webm)/.test(p.thumbnail || "") ? localMedia(p.thumbnail) : undefined;
        return {
            url: `${SITE}/proyectos/${cleanSlug(p)}`,
            lastModified: toISO(p.updatedAt) ?? toISO(p.createdAt) ?? latest,
            priority: 0.8,
            ...(poster && (embed || preview)
                ? {
                      videos: [
                          {
                              title: displayTitle(p),
                              thumbnail_loc: abs(poster),
                              description: projectDescription(p),
                              ...(embed ? { player_loc: embed.embedUrl } : { content_loc: abs(preview!) }),
                              publication_date: toISO(p.createdAt),
                          },
                      ],
                  }
                : {}),
        };
    });
    return [...pages, ...categories, ...projectPages];
}
