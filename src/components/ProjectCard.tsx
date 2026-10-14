"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Project } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useCursor } from "@/context/CursorContext";
import PreviewVideo from "./PreviewVideo";

interface ProjectCardProps {
    project: Project;
    layoutId?: string;
    className?: string;
    /** Above-the-fold card: start loading immediately. */
    priority?: boolean;
}

export default function ProjectCard({ project, layoutId, className, priority = false }: ProjectCardProps) {
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
                        <PreviewVideo src={project.thumbnail} poster={project.thumbnailPoster} priority={priority} />
                    ) : (
                        <motion.img
                            src={project.thumbnail}
                            alt={project.title || "Project Thumbnail"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 ease-out"
                            loading="lazy" // Optimization: Lazy load images
                            decoding="async"
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
