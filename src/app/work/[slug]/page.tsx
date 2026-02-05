"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";

interface Project {
    id: string;
    title: string;
    slug: string;
    category: string;
    year: string;
    thumbnail: string;
    videoUrl?: string | null;
    credits?: string | null;
    description?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export default function WorkPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProject();
    }, [slug]);

    const fetchProject = async () => {
        try {
            const res = await fetch("https://us-central1-berenjenastudiofinal.cloudfunctions.net/getProjects");
            const projects = await res.json();
            const found = projects.find((p: Project) => p.slug === slug);

            if (!found) {
                notFound();
            }

            setProject(found);
        } catch (error) {
            console.error("Error fetching project:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen pt-32 pb-20 px-4 md:px-10 bg-black text-white">
                <div className="max-w-[1400px] mx-auto">
                    <div className="mb-20">
                        <div className="h-16 bg-zinc-800 animate-pulse rounded mb-6" />
                        <div className="h-4 w-32 bg-zinc-800 animate-pulse rounded" />
                    </div>
                    <div className="mb-20 aspect-video bg-zinc-800 animate-pulse rounded" />
                </div>
            </main>
        );
    }

    if (!project) {
        notFound();
    }

    return (
        <main className="min-h-screen pt-32 pb-20 px-4 md:px-10 bg-black text-white">
            <div className="max-w-[1400px] mx-auto">
                {/* Project Header */}
                <div className="mb-20">
                    <h1 className="text-4xl md:text-7xl font-sans font-bold uppercase mb-6">
                        {project.title}
                    </h1>
                    <div className="flex gap-6 font-mono text-xs uppercase text-gray-500">
                        <span>#{project.category}</span>
                    </div>
                </div>

                {/* Project Thumbnail */}
                <div className="mb-20 aspect-video bg-zinc-900 rounded-sm overflow-hidden">
                    <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Project Description */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                    <div className="md:col-span-4">
                        <h2 className="font-mono text-xs uppercase text-gray-500 tracking-widest">Detalles</h2>
                    </div>
                    <div className="md:col-span-8 md:col-start-5">
                        <p className="text-xl md:text-2xl font-light leading-relaxed">
                            {project.description}
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
