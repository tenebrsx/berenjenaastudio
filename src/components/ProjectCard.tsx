"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Project } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useCursor } from "@/context/CursorContext";

interface ProjectCardProps {
    project: Project;
    layoutId?: string;
    className?: string;
}

export default function ProjectCard({ project, layoutId, className }: ProjectCardProps) {
    const { setCursor } = useCursor();

    return (
        <motion.div
            layoutId={layoutId}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn("relative group block w-full", className)}
            onMouseEnter={() => setCursor("text", "VER")}
            onMouseLeave={() => setCursor("default")}
        >
            <Link href={`/project?slug=${project.slug}`} className="block w-full">
                {/* Aspect Ratio Container */}
                <div className="relative w-full aspect-video overflow-hidden bg-gray-900 video-container">
                    {/* Thumbnail: Video or Image */}
                    {project.thumbnail && (project.thumbnail.includes(".mp4") || project.thumbnail.includes(".webm")) ? (
                        <video
                            src={project.thumbnail}
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 ease-out"
                            muted
                            loop
                            playsInline
                            // Autoplay Logic: Play when visible, Pause when out of view
                            // Works on both Desktop and Mobile to mimic "GIF" behavior
                            ref={(el) => {
                                if (!el) return;
                                const observer = new IntersectionObserver(
                                    (entries) => {
                                        entries.forEach((entry) => {
                                            if (entry.isIntersecting) {
                                                el.play().catch(() => {
                                                    // Auto-play might be blocked (e.g. low power mode)
                                                });
                                            } else {
                                                el.pause();
                                            }
                                        });
                                    },
                                    {
                                        threshold: 0.5 // Play when 50% visible
                                    }
                                );
                                observer.observe(el);
                            }}
                        />
                    ) : (
                        <motion.img
                            src={project.thumbnail}
                            alt={project.title || "Project Thumbnail"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 ease-out"
                        />
                    )}

                    {/* Overlay (Optional: can be used for playing video on hover) */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
                </div>

                {/* Info label below (Desktop style) */}
                <div className="mt-4 flex justify-between items-start text-xs font-mono uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                    <div>
                        <h3 className="text-white group-hover:text-accent transition-colors min-h-[1.2em]">
                            {project.title || "\u00A0"}
                        </h3>
                        <span className="text-gray-500">{project.category}</span>
                    </div>
                    <span className="text-gray-500">{project.year}</span>
                </div>
            </Link>
        </motion.div>
    );
}
