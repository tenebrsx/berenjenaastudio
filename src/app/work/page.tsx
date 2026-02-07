"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProjectGrid from "@/components/ProjectGrid";

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
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "projects"));
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Project[];
            setProjects(data);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen pt-40 pb-20 px-4 md:px-10 bg-black">
            <div className="max-w-[1920px] mx-auto">
                <h1 className="text-4xl md:text-8xl font-sans font-bold uppercase leading-none mb-20 text-white mix-blend-difference">
                    Trabajos<br />Seleccionados
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
