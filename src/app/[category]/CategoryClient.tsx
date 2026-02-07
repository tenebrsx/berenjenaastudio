"use client";

import { useEffect, useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { slugify } from "@/lib/utils";

interface Project {
    id: string;
    title: string;
    category: string;
    year: string;
    thumbnail: string;
    videoUrl?: string | null;
    slug: string;
}

export default function CategoryClient({ category }: { category: string }) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "projects"));
                const allProjects = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Project[];

                // Filter by category slug
                const filtered = allProjects.filter(p => slugify(p.category) === category);
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
    const categoryTitle = category
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    return (
        <main className="min-h-screen pt-40 pb-20 px-4 md:px-10 bg-black">
            <div className="max-w-[1920px] mx-auto">
                <h1 className="text-4xl md:text-6xl font-sans font-bold uppercase mb-20 text-white">
                    {categoryTitle}
                </h1>

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
