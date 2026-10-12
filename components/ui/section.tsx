// The <section> shell every page section sits in, and the heading block.
import type { ReactNode } from "react";
import type { SectionView } from "@/app/data/site";
import { cn } from "@/lib/utils";

/**
 * <section id={section.id}>. The lead section (Home) sits closer to the top bar. No scroll-mt:
 * html scroll-padding-top handles the fixed bar. When `section.heading` is set it renders the
 * SectionHeading first and points aria-labelledby at it, so the id convention lives here only.
 */
export function Section({ section, lead, children }: { section: SectionView; lead: boolean; children: ReactNode }) {
  const headingId = section.heading ? `${section.id}-heading` : undefined;
  return (
    <section
      id={section.id}
      aria-labelledby={headingId}
      className={cn(lead ? "pt-[76px] sm:pt-24" : "pt-20 sm:pt-28")}
    >
      {section.heading && <SectionHeading id={headingId} {...section.heading} />}
      {children}
    </section>
  );
}

export function SectionHeading({ id, title, intro }: { id?: string; title: string; intro: string }) {
  return (
    <div className="mb-6 sm:mb-8">
      <h2 id={id} className="font-display text-3xl font-bold tracking-tight sm:text-5xl">
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-body sm:text-base">{intro}</p>
    </div>
  );
}
