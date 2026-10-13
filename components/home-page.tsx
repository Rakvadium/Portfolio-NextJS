// The page composition: section order comes from `site.sections`, bodies from an exhaustive record.
import type { ReactNode } from "react";
import type { SectionId } from "@/app/data/portfolio";
import type { Site } from "@/app/data/site";
import { Backdrop } from "./backdrop";
import { TopBar } from "./top-bar/top-bar";
import { MobileNavPrototype } from "./top-bar/_prototype-mobile-nav/mobile-nav-prototype";
import { Section } from "./ui/section";
import { Hero } from "./hero/hero";
import { Skills } from "./skills";
import { Experience } from "./experience/experience";
import { Projects } from "./projects/projects";
import { Contact } from "./contact";
import { SiteFooter } from "./site-footer";

export function HomePage({ site }: { site: Site }) {
  // An id in `sections` without a body here fails tsc (missing key), and a stray key fails too.
  const bodies = {
    home: <Hero hero={site.hero} />,
    skills: <Skills skills={site.skills} />,
    experience: <Experience roles={site.roles} />,
    projects: <Projects projects={site.projects} />,
    contact: <Contact contact={site.contact} />,
  } satisfies Record<SectionId, ReactNode>;

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <Backdrop />
      <MobileNavPrototype brand={site.brand} sections={site.sections} social={site.social}>
        <TopBar brand={site.brand} sections={site.sections} social={site.social} />
      </MobileNavPrototype>
      <main className="relative z-10 mx-auto max-w-[1200px] px-4 pb-36 sm:px-6">
        {site.sections.map((section, index) => (
          <Section key={section.id} section={section} lead={index === 0}>
            {bodies[section.id]}
          </Section>
        ))}
        <SiteFooter footer={site.footer} />
      </main>
    </div>
  );
}
