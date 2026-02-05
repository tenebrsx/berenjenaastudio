"use client";

import { motion } from "framer-motion";

interface HeroVideoProps {
    videoUrl?: string;
}

export default function HeroVideo({ videoUrl }: HeroVideoProps) {
    const src = videoUrl || "https://videos.pexels.com/video-files/3121459/3121459-hd_1920_1080_25fps.mp4";
    return (
        <div className="absolute top-0 left-0 w-full h-[80vh] md:h-screen w-full overflow-hidden z-0">
            {/* Overlay Gradient for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />

            <video
                key={src}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover opacity-60"
            >
                {/* Fallback/Placeholder: A neon/rain cinematic clip */}
                <source src={src} type="video/mp4" />
            </video>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white font-mono text-xs uppercase tracking-widest animate-bounce"
            >
                Scroll
            </motion.div>
        </div>
    );
}
