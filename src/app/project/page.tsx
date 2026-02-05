"use client";

import { useEffect, useState, Suspense } from "react";
import { notFound, useSearchParams } from "next/navigation";

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
    gallery?: string[] | null;
}

function ProjectViewer() {
    const searchParams = useSearchParams();
    const slug = searchParams.get("slug");
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            fetchProject(slug);
        } else {
            setLoading(false);
        }
    }, [slug]);

    const fetchProject = async (slugToFind: string) => {
        setLoading(true);
        try {
            const res = await fetch("https://us-central1-berenjenastudiofinal.cloudfunctions.net/getProjects");
            if (!res.ok) {
                console.error("Failed to fetch projects");
                return;
            }
            const projects = await res.json();
            const found = projects.find((p: Project) => p.slug === slugToFind);

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

    if (!slug || !project) {
        // If loaded without slug, or project not found (and notFound() didn't trigger yet? notFound throws)
        // If notFound throws, we don't reach here. 
        // If no slug, we might want to show "Project not specified" or notFound.
        if (!slug) return null; // or notFound()
        return null;
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

                {/* YouTube Video (if available) */}
                {project.videoUrl && (() => {
                    // Extract YouTube video ID from various URL formats
                    const getYouTubeId = (url: string) => {
                        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                        const match = url.match(regExp);
                        return (match && match[2].length === 11) ? match[2] : null;
                    };

                    const videoId = getYouTubeId(project.videoUrl);

                    return videoId ? (
                        <div className="mb-20">
                            <div className="aspect-video bg-zinc-900 rounded-sm overflow-hidden">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${videoId}`}
                                    title={project.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                />
                            </div>
                        </div>
                    ) : null;
                })()}

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

                {/* Gallery Section */}
                {project.gallery && project.gallery.length > 0 && (
                    <div className="mt-32 space-y-10">
                        <div className="flex items-center gap-4">
                            <span className="h-px flex-1 bg-zinc-900" />
                            <h3 className="font-mono text-xs uppercase text-zinc-500 tracking-widest">Gallery & Moments</h3>
                            <span className="h-px flex-1 bg-zinc-900" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {project.gallery.map((image, index) => (
                                <div key={index} className="group relative aspect-[4/5] bg-zinc-900 overflow-hidden rounded-sm hover:-translate-y-2 transition-transform duration-500 ease-out">
                                    <img
                                        src={image}
                                        alt={`${project.title} gallery ${index + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

export default function ProjectPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <ProjectViewer />
        </Suspense>
    );
}
