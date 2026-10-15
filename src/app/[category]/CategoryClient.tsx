"use client";

import { useEffect, useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import { getProjectsSnapshot } from "@/lib/projects";
import { categoryInfo } from "@/lib/seo";

interface Project {
    id: string;
    title: string;
    category: string;
    year: string;
    thumbnail: string;
    videoUrl?: string | null;
    slug: string;
}

export default function CategoryClient({ category, intro }: { category: string; intro: string }) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const querySnapshot = await getProjectsSnapshot();
                const allProjects = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Project[];

                // Filter by category slug
                const filtered = allProjects.filter(p => categoryInfo(p.category).slug === category);
                setProjects(filtered);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [category]);

    // Format category title from slug (e.g. "music-video" -> "Music Video")
    const categoryTitle = categoryInfo(category).label;

    return (
        <main className="min-h-screen pt-40 pb-20 px-4 md:px-10 bg-black">
            <div className="max-w-[1920px] mx-auto">
                <h1 className="text-4xl md:text-6xl font-sans font-bold uppercase mb-20 text-white">
                    {categoryTitle}
                </h1>
                <p className="-mt-12 mb-16 max-w-2xl text-lg font-light text-zinc-400">
                    {intro}
                </p>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-video bg-zinc-800 animate-pulse rounded" />
                        ))}
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-zinc-500 text-xl">No projects found in this category.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {projects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
