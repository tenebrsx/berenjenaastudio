"use client";

import { useEffect, useRef } from "react";

interface PreviewVideoProps {
    src: string;
    poster?: string;
    /** Above-the-fold: fetch right away instead of waiting for the viewport. */
    priority?: boolean;
}

// Off-screen previews load one at a time so they don't compete with visible ones.
let queue: Promise<void> = Promise.resolve();
function enqueue(load: () => Promise<void>) {
    queue = queue.then(load, load);
}

/**
 * GIF-like looping preview: muted, looped, inline, plays only while visible.
 * The poster shows instantly; the video file is fetched when the card is near the
 * viewport (or immediately for priority cards) and played once it is half visible.
 */
export default function PreviewVideo({ src, poster, priority = false }: PreviewVideoProps) {
    const ref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        // iOS/Safari require the muted *property*, which React's attribute alone may not set.
        el.muted = true;
        el.defaultMuted = true;

        let loaded = priority;
        const startLoad = () => {
            if (loaded) return;
            loaded = true;
            enqueue(() => new Promise<void>((resolve) => {
                const done = () => { el.removeEventListener("canplay", done); el.removeEventListener("error", done); resolve(); };
                el.addEventListener("canplay", done);
                el.addEventListener("error", done);
                setTimeout(done, 4000); // never let one slow file block the rest
                el.preload = "auto";
                el.load();
            }));
        };

        const nearObserver = new IntersectionObserver(
            (entries) => { if (entries.some((e) => e.isIntersecting)) { startLoad(); nearObserver.disconnect(); } },
            { rootMargin: "400px 0px" }
        );
        const playObserver = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) {
                        startLoad();
                        el.play().catch(() => { /* autoplay may be blocked (e.g. Low Power Mode) */ });
                    } else {
                        el.pause();
                    }
                }
            },
            { threshold: 0.5 }
        );
        nearObserver.observe(el);
        playObserver.observe(el);
        return () => { nearObserver.disconnect(); playObserver.disconnect(); };
    }, [src, priority]);

    return (
        <video
            ref={ref}
            // Without a poster, #t=0.1 makes mobile browsers paint a first frame.
            src={poster ? src : `${src}#t=0.1`}
            poster={poster}
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 ease-out"
            muted
            loop
            playsInline
            autoPlay={priority}
            // With a poster nothing needs downloading until the card is near the viewport.
            preload={priority ? "auto" : poster ? "none" : "metadata"}
        />
    );
}
