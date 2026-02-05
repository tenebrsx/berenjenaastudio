"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useCursor } from "@/context/CursorContext";

interface VideoPlayerProps {
    thumbnail: string;
    videoUrl?: string;
}

export default function VideoPlayer({ thumbnail, videoUrl }: VideoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const { setCursor } = useCursor();

    return (
        <div
            className="w-full aspect-video bg-gray-900 relative overflow-hidden group cursor-pointer"
            onClick={() => setIsPlaying(true)}
            onMouseEnter={() => setCursor("video", "VER")}
            onMouseLeave={() => setCursor("default")}
        >
            {!isPlaying ? (
                <>
                    <img
                        src={thumbnail}
                        alt="Video Thumbnail"
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                    />
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <div className="w-20 h-20 rounded-full border border-white/30 bg-black/50 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Play className="w-8 h-8 text-white fill-white ml-1" />
                        </div>
                    </motion.div>
                </>
            ) : (
                <div className="w-full h-full bg-black flex items-center justify-center">
                    {videoUrl ? (
                        <video
                            src={videoUrl}
                            controls
                            autoPlay
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <p className="font-mono text-accent">No hay video disponible.</p>
                    )}
                </div>
            )}
        </div>
    );
}
