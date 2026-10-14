import mediaMap from "@/data/media-map.json";

const map = mediaMap as Record<string, string>;

/** Same-origin copy of a Storage preview/poster if it was mirrored at build time. */
export function localMedia(url?: string | null): string | undefined {
    if (!url) return undefined;
    return map[url.split("?")[0]] ?? url;
}
