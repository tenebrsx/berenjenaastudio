import type { MetadataRoute } from "next";
import projects from "@/data/projects-build.json";

export const dynamic = "force-static";

const BASE = "https://berenjenastudio.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/gallery", "/search", "/index"].map((path) => ({
    url: `${BASE}${path}`,
  }));
  const projectRoutes = (projects as { slug?: string }[])
    .filter((p) => p.slug)
    .map((p) => ({ url: `${BASE}/project?slug=${encodeURIComponent(p.slug!)}` }));
  return [...staticRoutes, ...projectRoutes];
}
