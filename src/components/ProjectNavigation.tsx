"use client";

import Link from "next/link";
import { Project } from "@/lib/data";

interface ProjectNavigationProps {
    nextProject: Project;
}

export default function ProjectNavigation({ nextProject }: ProjectNavigationProps) {
    return (
        <div className="w-full py-20 border-t border-white/10 mt-20 flex justify-center">
            <Link href={`/work/${nextProject.slug}`} className="group flex flex-col items-center">
                <span className="font-mono text-xs uppercase text-gray-500 mb-2 tracking-widest">Siguiente Proyecto</span>
                <h2 className="text-4xl md:text-6xl font-sans font-bold uppercase text-white group-hover:text-accent transition-colors duration-300">
                    {nextProject.title}
                </h2>
            </Link>
        </div>
    );
}
