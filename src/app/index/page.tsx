import ProjectGrid from "@/components/ProjectGrid";
import { PROJECTS } from "@/lib/data";

export default function IndexPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-4 md:px-10 bg-black">
            <div className="max-w-[1920px] mx-auto">
                <h1 className="text-4xl md:text-6xl font-sans font-bold uppercase mb-20 text-white">
                    Todos los Proyectos
                </h1>
                <ProjectGrid projects={PROJECTS} />
            </div>
        </main>
    );
}
