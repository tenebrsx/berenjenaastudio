"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProjectGrid from "@/components/ProjectGrid";
import HeroVideo from "@/components/HeroVideo";

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

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [videoUrl, setVideoUrl] = useState("https://videos.pexels.com/video-files/3121459/3121459-hd_1920_1080_25fps.mp4");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch projects
      const projectsSnap = await getDocs(collection(db, "projects"));
      const projectsData = projectsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
      setProjects(projectsData);

      // Fetch settings (for hero video URL)
      const settingsSnap = await getDoc(doc(db, "settings", "general"));
      if (settingsSnap.exists()) {
        const settingsData = settingsSnap.data();
        if (settingsData.heroVideoUrl) {
          setVideoUrl(settingsData.heroVideoUrl);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] md:h-screen w-full flex items-end pb-20 md:pb-32 px-4 md:px-10">
        <HeroVideo videoUrl={videoUrl} />
        <div className="relative z-10 w-full">
          <h1 className="text-4xl md:text-8xl font-sans font-bold uppercase leading-none text-center md:text-left mix-blend-difference text-white">
            Dirección<br />Cinematográfica
          </h1>
        </div>
      </section>

      {/* Projects Section */}
      <div className="relative z-10 px-4 md:px-10 pb-20 bg-black">
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
