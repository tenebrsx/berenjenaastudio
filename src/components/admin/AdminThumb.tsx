"use client";

import { useState } from "react";
import { Film } from "lucide-react";
import { localMedia } from "@/lib/media";

type Props = {
    thumbnail?: string | null;
    thumbnailPoster?: string | null;
    alt?: string;
    className?: string;
};

const isVideo = (u?: string | null) => !!u && /\.(mp4|webm|mov|m4v)(\?|$)/i.test(u.split("?")[0]);

/**
 * Admin thumbnail: poster image if there is one, otherwise the first frame of the preview video.
 * Prefers the same-origin copy (works without a VPN) and falls back to an icon instead of a broken image.
 */
export default function AdminThumb({ thumbnail, thumbnailPoster, alt = "", className = "" }: Props) {
    const [failed, setFailed] = useState(false);
    const poster = thumbnailPoster || (isVideo(thumbnail) ? undefined : thumbnail);
    const video = isVideo(thumbnail) ? thumbnail : undefined;

    if (failed || (!poster && !video)) {
        return <Film className="h-6 w-6 text-zinc-600" />;
    }
    if (poster) {
        return <img src={localMedia(poster)} alt={alt} loading="lazy" className={className} onError={() => setFailed(true)} />;
    }
    return (
        <video
            src={`${localMedia(video)}#t=0.5`}
            muted
            playsInline
            preload="metadata"
            aria-label={alt}
            className={className}
            onError={() => setFailed(true)}
        />
    );
}
