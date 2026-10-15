"use client";

import { useEffect, useState } from "react";
import { getProjectsSnapshot } from "@/lib/projects";
import { localMedia } from "@/lib/media";
import { projectPath, displayTitle } from "@/lib/seo";

interface Project {
    id: string;
    title: string;
    slug: string;
    category: string;
    gallery?: string[];
}

interface GalleryImage {
    url: string;
    projectTitle: string;
    projectSlug: string;
}

export default function GalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const querySnapshot = await getProjectsSnapshot();
            const projects = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Project[];

            // Flatten all gallery images
            const allImages: GalleryImage[] = [];
            projects.forEach(project => {
                if (project.gallery && project.gallery.length > 0) {
                    project.gallery.forEach(url => {
                        allImages.push({
                            url,
                            projectTitle: project.title,
                            projectSlug: project.slug
                        });
                    });
                }
            });

            // Randomize order for a more "collage" feel
            setImages(allImages.sort(() => Math.random() - 0.5));
        } catch (error) {
            console.error("Error fetching gallery:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen pt-40 pb-20 px-4 md:px-10 bg-black">
            <div className="max-w-[1920px] mx-auto">
                <h1 className="text-4xl md:text-8xl font-sans font-bold uppercase leading-none mb-20 text-white mix-blend-difference">
                    Archivo<br />Visual
                </h1>

                {loading ? (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="aspect-[4/5] bg-zinc-800 animate-pulse rounded break-inside-avoid" />
                        ))}
                    </div>
                ) : images.length === 0 ? (
                    <div className="text-zinc-500 text-xl font-mono uppercase tracking-widest text-center py-20">
                        Archive Empty
                    </div>
                ) : (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {images.map((img, idx) => (
                            <div key={idx} className="break-inside-avoid group relative mb-6">
                                <a href={projectPath({ slug: img.projectSlug, id: img.projectSlug })} className="block">
                                    <img
                                        src={localMedia(img.url)}
                                        // Hide the whole tile if the image can't load (no "?" icon).
                                        onError={(e) => { const t = e.currentTarget.closest(".break-inside-avoid") as HTMLElement | null; if (t) t.style.display = "none"; }}
                                        alt={`${displayTitle({ slug: img.projectSlug, title: img.projectTitle })}: fotograma · Berenjena Studio`}
                                        className="w-full h-auto rounded-sm hover:-translate-y-2 transition-transform duration-500 ease-out"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <span className="text-white font-mono text-xs uppercase tracking-widest border border-white px-3 py-1">
                                            {displayTitle({ slug: img.projectSlug, title: img.projectTitle })}
                                        </span>
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
