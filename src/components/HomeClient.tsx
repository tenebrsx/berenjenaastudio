"use client";

import { useEffect, useState } from "react";
import ProjectGrid from "@/components/ProjectGrid";
import buildProjects from "@/data/projects-build.json";

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  year: string;
  thumbnail: string;
  thumbnailPoster?: string;
  videoUrl?: string | null;
  credits?: string | null;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// Same order getDocs() returns (document id), so the background refresh does not reshuffle the grid.
function sortById<T extends { id: string }>(list: T[]): T[] {
  return [...list].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

export default function HomeClient() {
  // Projects baked in at build time render immediately (no Firestore round-trip before
  // the first video request); Firestore then refreshes them in the background.
  const initial = sortById(buildProjects as unknown as Project[]);
  const [projects, setProjects] = useState<Project[]>(initial);
  const [loading, setLoading] = useState(initial.length === 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Firebase SDK loaded lazily after first paint (keeps it out of the critical JS).
        await new Promise((r) => setTimeout(r, 1500));
        const [{ collection, getDocs }, { db }] = await Promise.all([import("firebase/firestore"), import("@/lib/firebase")]);
        const projectsSnap = await getDocs(collection(db, "projects"));
        const projectsData = projectsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
        // Offline/blocked Firestore resolves with an empty cache snapshot; keep the baked list then.
        if (!projectsSnap.metadata.fromCache && projectsData.length) setProjects(sortById(projectsData));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="min-h-screen pt-40 pb-20 px-4 md:px-10 bg-black">
      <div className="max-w-[1920px] mx-auto">
        <header className="mb-16 md:mb-24 max-w-4xl">
          <h1 className="font-sans font-bold uppercase tracking-tighter text-3xl md:text-6xl leading-none text-white">
            Cine y video desde Santo Domingo, República Dominicana
          </h1>
          <p className="mt-6 text-base md:text-xl font-light leading-relaxed text-zinc-400">
            Jonathan Matos, director, director de fotografía y editor.
            Comerciales, narrativa y reels con una mirada cinematográfica y una identidad visual caribeña.
          </p>
        </header>
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
