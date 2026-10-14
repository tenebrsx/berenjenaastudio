"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
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

export default function Home() {
  // Projects baked in at build time render immediately (no Firestore round-trip before
  // the first video request); Firestore then refreshes them in the background.
  const initial = sortById(buildProjects as unknown as Project[]);
  const [projects, setProjects] = useState<Project[]>(initial);
  const [loading, setLoading] = useState(initial.length === 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsSnap = await getDocs(collection(db, "projects"));
        const projectsData = projectsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
        setProjects(sortById(projectsData));
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
