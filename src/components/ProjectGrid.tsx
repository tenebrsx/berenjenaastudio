import { Project } from "@/lib/data";
import ProjectCard from "./ProjectCard";

interface ProjectGridProps {
    projects: Project[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-10 gap-y-12 md:gap-y-20 w-full">
            {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
    );
}
