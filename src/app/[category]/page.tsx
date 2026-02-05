import { PROJECTS } from "@/lib/data";
import ProjectCard from "@/components/ProjectCard";
import { notFound } from "next/navigation";

export function generateStaticParams() {
    const categories = [...new Set(PROJECTS.map(p => p.category))];
    return categories.map((category) => ({
        category,
    }));
}

export default function CategoryPage({ params }: { params: { category: string } }) {
    const { category } = params;

    const categoryProjects = PROJECTS.filter(p => p.category === category);

    if (categoryProjects.length === 0) {
        notFound();
    }

    return (
        <main className="min-h-screen pt-32 pb-20 px-4 md:px-10 bg-black">
            <div className="max-w-[1920px] mx-auto">
                <h1 className="text-4xl md:text-6xl font-sans font-bold uppercase mb-20 text-white">
                    {category}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {categoryProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            </div>
        </main>
    );
}
