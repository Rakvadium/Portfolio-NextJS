// Section body for #projects: cards stacked, alternating the image side.
import type { ProjectView } from "@/app/data/site";
import { ProjectCard } from "./project-card";

export function Projects({ projects }: { projects: readonly ProjectView[] }) {
  return (
    <div className="flex flex-col gap-4">
      {projects.map((project, i) => (
        <ProjectCard key={project.slug} project={project} flip={i % 2 === 1} />
      ))}
    </div>
  );
}
