"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { motion } from "framer-motion";

interface Project {
    id: string;
    title: string;
    slug: string;
    category: string;
    year: string;
    thumbnail: string;
}

interface RelatedProjectsProps {
    currentProjectId: string;
}

export default function RelatedProjects({ currentProjectId }: RelatedProjectsProps) {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "projects"));
                const allProjects = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Project[];

                // Filter out current project and random shuffle
                const others = allProjects.filter(p => p.id !== currentProjectId);
                const shuffled = others.sort(() => 0.5 - Math.random());

                // Take top 3
                setProjects(shuffled.slice(0, 3));
            } catch (error) {
                console.error("Error fetching related projects:", error);
            }
        };

        fetchProjects();
    }, [currentProjectId]);

    if (projects.length === 0) return null;

    return (
        <div className="mt-32 space-y-10">
            <div className="flex items-center gap-4">
                <span className="h-px flex-1 bg-zinc-900" />
                <h3 className="font-mono text-xs uppercase text-zinc-500 tracking-widest">More Projects</h3>
                <span className="h-px flex-1 bg-zinc-900" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                    <Link href={`/project?slug=${project.slug}`} key={project.id} className="block group">
                        <div className="aspect-video bg-zinc-900 overflow-hidden rounded-sm mb-3">
                            <motion.img
                                initial={{ scale: 1.1 }}
                                whileHover={{ scale: 1 }}
                                transition={{ duration: 0.6 }}
                                src={project.thumbnail}
                                alt={project.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex justify-between items-baseline">
                            <h4 className="font-sans font-bold text-lg uppercase text-white group-hover:text-zinc-400 transition-colors">
                                {project.title}
                            </h4>
                            <span className="font-mono text-xs text-zinc-600 uppercase">
                                {project.category}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
