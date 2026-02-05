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
                <div className="relative w-full aspect-video overflow-hidden bg-gray-900">
                    {/* Thumbnail Image */}
                    <motion.img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-1000 ease-out"
                    />

                    {/* Overlay (Optional: can be used for playing video on hover) */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>

                {/* Info label below (Desktop style) */}
                <div className="mt-4 flex justify-between items-start text-xs font-mono uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                    <div>
                        <h3 className="text-white group-hover:text-accent transition-colors">
                            {project.title}
                        </h3>
                        <span className="text-gray-500">{project.category}</span>
                    </div>
                    <span className="text-gray-500">{project.year}</span>
                </div>
            </Link>
        </motion.div>
    );
}
