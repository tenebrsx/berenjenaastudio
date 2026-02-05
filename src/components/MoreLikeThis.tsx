"use client";

import { Project } from "@/lib/data";
import ProjectCard from "./ProjectCard";
import { useRef } from "react";
import { motion } from "framer-motion";

interface MoreLikeThisProps {
    projects: Project[];
}

export default function MoreLikeThis({ projects }: MoreLikeThisProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    if (projects.length === 0) return null;

    return (
        <section className="mb-32">
            <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-4">
                <h3 className="font-mono text-xs uppercase text-gray-500 tracking-widest">
                    Más como esto
                </h3>
            </div>

            {/* Horizontal Scroll Container */}
            <div
                ref={containerRef}
                className="overflow-x-auto pb-8 -mx-4 md:-mx-10 px-4 md:px-10 scrollbar-hide snap-x snap-mandatory"
            >
                <div className="flex gap-6 md:gap-10 w-max">
                    {projects.map((project) => (
                        <div key={project.id} className="w-[85vw] md:w-[600px] snap-center">
                            <ProjectCard project={project} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
