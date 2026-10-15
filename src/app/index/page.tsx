"use client";

import { useState, useEffect } from "react";
import { getProjectsSnapshot } from "@/lib/projects";
import ProjectGrid from "@/components/ProjectGrid";

interface Project {
    id: string;
    title: string;
    slug: string;
    category: string;
    year: string;
    thumbnail: string;
}

export default function IndexPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const querySnapshot = await getProjectsSnapshot();
                const projectsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Project[];
                setProjects(projectsData);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return (
        <main className="min-h-screen pt-32 pb-20 px-4 md:px-10 bg-black">
            <div className="max-w-[1920px] mx-auto">
                <h1 className="text-4xl md:text-6xl font-sans font-bold uppercase mb-20 text-white">
                    Todos los Proyectos
                </h1>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="aspect-video bg-zinc-800 animate-pulse rounded" />
                        ))}
                    </div>
                ) : (
                    <ProjectGrid projects={projects} />
                )}
            </div>
        </main>
    );
}
