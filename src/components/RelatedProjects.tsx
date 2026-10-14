"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import PreviewVideo from "./PreviewVideo";
import { localMedia } from "@/lib/media";
import buildProjects from "@/data/projects-build.json";

interface Project {
    id: string;
    title: string;
    slug: string;
    category: string;
    year: string;
    thumbnail: string;
    thumbnailPoster?: string;
}

const isVideo = (u?: string) => !!u && (u.includes(".mp4") || u.includes(".webm"));
const pick = (all: Project[], currentId: string) =>
    all.filter(p => p.id !== currentId).sort(() => 0.5 - Math.random()).slice(0, 3);

interface RelatedProjectsProps {
    currentProjectId: string;
}

export default function RelatedProjects({ currentProjectId }: RelatedProjectsProps) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [failed, setFailed] = useState<Record<string, boolean>>({});

    useEffect(() => {
        // Build-time list first (works even if Firestore is unreachable), then refresh.
        Promise.resolve().then(() => setProjects(pick(buildProjects as unknown as Project[], currentProjectId)));
        const fetchProjects = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "projects"));
                const allProjects = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Project[];

                if (!querySnapshot.metadata.fromCache && allProjects.length) setProjects(pick(allProjects, currentProjectId));
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
                <h3 className="font-mono text-xs uppercase text-zinc-500 tracking-widest">Más Proyectos</h3>
                <span className="h-px flex-1 bg-zinc-900" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <Link href={`/project?slug=${project.slug}`} key={project.id} className="block group">
                        <div className="relative aspect-video bg-zinc-900 overflow-hidden rounded-sm mb-3">
                            {isVideo(project.thumbnail) ? (
                                <PreviewVideo src={project.thumbnail} poster={project.thumbnailPoster} />
                            ) : !failed[project.id] && project.thumbnail ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={localMedia(project.thumbnail)}
                                    alt=""
                                    loading="lazy"
                                    decoding="async"
                                    onError={() => setFailed(f => ({ ...f, [project.id]: true }))}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            ) : null}
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
