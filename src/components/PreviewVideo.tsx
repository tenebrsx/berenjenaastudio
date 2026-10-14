"use client";

import { useEffect, useRef, useState } from "react";

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
    // Without a poster there is nothing underneath, so show the video right away.
    const [ready, setReady] = useState(!poster);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        // iOS/Safari require the muted *property*, which React's attribute alone may not set.
        el.muted = true;
        el.defaultMuted = true;

        let loaded = priority;
        let visible = false;
        const tryPlay = () => { if (visible) el.play().catch(() => { /* autoplay may be blocked (e.g. Low Power Mode) */ }); };
        const startLoad = () => {
            if (loaded) return;
            loaded = true;
            enqueue(() => new Promise<void>((resolve) => {
                const done = () => { el.removeEventListener("canplay", done); el.removeEventListener("error", done); resolve(); };
                el.addEventListener("canplay", done);
                el.addEventListener("error", done);
                setTimeout(done, 4000); // never let one slow file block the rest
                el.preload = "auto";
                // A play() call may already have started the fetch; only (re)load if idle.
                if (el.readyState === 0 && el.networkState !== el.NETWORK_LOADING) el.load();
                // load() aborts any pending play(), so resume once data is in.
                el.addEventListener("canplay", tryPlay, { once: true });
            }));
        };

        const nearObserver = new IntersectionObserver(
            (entries) => { if (entries.some((e) => e.isIntersecting)) { startLoad(); nearObserver.disconnect(); } },
            { rootMargin: "400px 0px" }
        );
        const playObserver = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    visible = e.isIntersecting;
                    if (visible) {
                        startLoad();
                        tryPlay();
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

    const cls = "absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 ease-out";
    return (
        <>
            {poster && (
                // Still frame underneath: paints instantly; the video fades in over it once it has data.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={poster}
                    alt=""
                    aria-hidden="true"
                    className={cls}
                    loading={priority ? "eager" : "lazy"}
                    decoding="async"
                    fetchPriority={priority ? "high" : "auto"}
                />
            )}
            <video
                ref={ref}
                // Without a poster, #t=0.1 makes mobile browsers paint a first frame.
                src={poster ? src : `${src}#t=0.1`}
                poster={poster}
                className={cls}
                style={{ opacity: ready ? 1 : 0, transition: "opacity 0.4s ease-in-out, transform 1s ease-out" }}
                onLoadedData={() => setReady(true)}
                muted
                loop
                playsInline
                autoPlay={priority}
                // With a poster nothing needs downloading until the card is near the viewport.
                preload={priority ? "auto" : poster ? "none" : "metadata"}
            />
        </>
    );
}
