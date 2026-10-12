// One project: a 16:10 screenshot link and the text column (kind, title, what it is, what I built,
// built with, links). `flip` swaps the columns at lg; DOM order stays image-then-text.
import Image from "next/image";
import { Github } from "lucide-react";
import type { ProjectView } from "@/app/data/site";
import { ButtonLink } from "@/components/ui/button-link";
import { Chip } from "@/components/ui/chip";
import { Tile } from "@/components/ui/tile";
import { cn } from "@/lib/utils";

export function ProjectCard({ project, flip = false }: { project: ProjectView; flip?: boolean }) {
  const titleId = `${project.slug}-title`;
  return (
    <Tile as="article" glow={flip ? "magenta" : "amber"} motion="reveal" aria-labelledby={titleId}>
      <div className="grid lg:grid-cols-12">
        <div className={cn("p-3 sm:p-4 lg:col-span-7", flip && "lg:order-2")}>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${project.title} (${project.host})`}
            className="group/image relative block aspect-[16/10] overflow-hidden rounded-[20px] border border-white/[0.08] bg-black/40"
          >
            <Image
              src={project.screenshot.src}
              alt={project.screenshot.alt}
              fill
              sizes="(min-width: 1024px) 680px, 100vw"
              className="object-cover object-top transition-transform duration-[1200ms] ease-out group-hover/image:scale-[1.03]"
            />
          </a>
        </div>
        <div className={cn("flex flex-col gap-5 p-5 sm:p-8 lg:col-span-5", flip && "lg:order-1")}>
          <div>
            <p className="text-sm text-soft">{project.kind}</p>
            <h3 id={titleId} className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {project.title}
            </h3>
          </div>
          <Detail title="What it is">{project.summary}</Detail>
          <Detail title="What I built">{project.contribution}</Detail>
          <div>
            <h4 className="text-sm font-semibold text-white">Built with</h4>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <li key={tech}>
                  <Chip>{tech}</Chip>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-auto flex flex-wrap gap-2.5 pt-1">
            <ButtonLink tone="brand" href={project.url} arrow="up-right">
              Visit {project.host}
            </ButtonLink>
            {project.repoUrl && (
              <ButtonLink tone="ghost" href={project.repoUrl} icon={Github}>
                Source code
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    </Tile>
  );
}

function Detail({ title, children }: { title: string; children: string }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-white">{title}</h4>
      <p className="mt-1 text-[15px] leading-relaxed text-body">{children}</p>
    </div>
  );
}
