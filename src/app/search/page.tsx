"use client";

import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import { PROJECTS } from "@/lib/data";

export default function SearchPage() {
    const [query, setQuery] = useState("");

    const filteredProjects = PROJECTS.filter((project) =>
        project.title.toLowerCase().includes(query.toLowerCase()) ||
        project.description?.toLowerCase().includes(query.toLowerCase()) ||
        project.category.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <main className="min-h-screen pt-32 pb-20 px-4 md:px-10 bg-black text-white">
            <div className="max-w-[1920px] mx-auto">
                {/* Search Header */}
                <div className="mb-20">
                    <h1 className="text-4xl md:text-6xl font-sans font-bold uppercase mb-10">
                        Buscar Proyectos
                    </h1>

                    <input
                        type="text"
                        placeholder="Buscar por nombre, categoría, descripción..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full md:w-2/3 px-6 py-4 bg-zinc-900 text-white border border-zinc-800 focus:border-white transition-colors outline-none font-mono text-sm"
                    />
                </div>

                {/* Results */}
                <div className="mb-10">
                    <p className="font-mono text-xs uppercase text-gray-500">
                        {filteredProjects.length} Resultado{filteredProjects.length !== 1 ? 's' : ''}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>

                {filteredProjects.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-xl">
                            No se encontraron proyectos
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
