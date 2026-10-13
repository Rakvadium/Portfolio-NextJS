import type { ReactNode } from "react";
import type { SectionView } from "@/app/data/site";

export function Section({ section, lead, children }: { section: SectionView; lead: boolean; children: ReactNode }) {
  const headingId = section.heading ? `${section.id}-heading` : undefined;
  return (
    <section
      id={section.id}
      aria-labelledby={headingId}
      className={lead ? "pt-[60px] lg:pt-24" : "pt-20 sm:pt-28"}
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
