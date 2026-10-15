import mediaMap from "@/data/media-map.json";
import buildProjects from "@/data/projects-build.json";

const map = mediaMap as Record<string, string>;

/** Same-origin copy of a Storage file if it was mirrored at build time. */
export function localMedia(url?: string | null): string | undefined {
    if (!url) return undefined;
    return map[url.split("?")[0]] ?? url;
}

/** Projects baked in at build time (render instantly, survive blocked/offline Firestore). */
export function getBuildProjects<T>(): T[] {
    return buildProjects as unknown as T[];
}

/** Hide a broken image instead of showing the browser's "?" icon. */
export function hideOnError(e: { currentTarget: HTMLElement }) {
    e.currentTarget.style.visibility = "hidden";
}
