"use client";
// PROTOTYPE (throwaway, branch prototype/mobile-nav). Bits every mobile-nav variant reuses.
import { useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, House, LayoutGrid, Send, Sparkles, type LucideIcon } from "lucide-react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import type { Image as PortraitImage, SectionId } from "@/app/data/portfolio";
import type { Brand, Channel, SectionView } from "@/app/data/site";
import { BrandReveal } from "../scroll-motion";
import { useActiveSection } from "../use-active-section";

export type MobileNavProps = {
  brand: Brand;
  sections: readonly [SectionView, ...SectionView[]];
  social: readonly Channel[];
  /** The hero portrait, for the H/I bar avatar. */
  portrait: PortraitImage;
};

export const sectionIcon = {
  home: House,
  skills: Sparkles,
  experience: BriefcaseBusiness,
  projects: LayoutGrid,
  contact: Send,
} as const satisfies Record<SectionId, LucideIcon>;

export function useActive(sections: MobileNavProps["sections"]) {
  const ids = useMemo(() => sections.map((s) => s.id) as [SectionId, ...SectionId[]], [sections]);
  const active = useActiveSection(ids);
  const index = Math.max(0, sections.findIndex((s) => s.id === active));
  return { active, index, label: sections[index].label };
}

/** Below lg only: where native hash navigation lands for this variant. lg+ keeps globals.css 5rem. */
export function MobileScrollPadding({ top, extra = "" }: { top: string; extra?: string }) {
  return <style>{`@media (max-width: 1023.98px) { html { scroll-padding-top: ${top}; } ${extra} }`}</style>;
}

/** True once the page has scrolled past `threshold` px. */
export function useScrolledPast(threshold: number) {
  const { scrollY } = useScroll();
  const [past, setPast] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setPast(y > threshold));
  useEffect(() => setPast(window.scrollY > threshold), [threshold]);
  return past;
}

/** Monogram + name/title that fade in after the hero handoff, shown on phones too (unlike BrandMark). */
export function MobileBrand({ brand, size = 36, nameOnly = false }: { brand: Brand; size?: number; nameOnly?: boolean }) {
  return (
    <a href="#home" aria-label={`${brand.name}, back to top`} className="flex min-w-0 items-center gap-2.5">
      <span
        aria-hidden
        style={{ width: size, height: size }}
        className="bg-brand flex shrink-0 items-center justify-center rounded-xl font-display text-sm font-extrabold text-canvas"
      >
        {brand.monogram}
      </span>
      <BrandReveal className="flex min-w-0 flex-col leading-tight">
        <span className="truncate font-display text-[16px] font-bold tracking-tight">{brand.name}</span>
        {!nameOnly && <span className="truncate text-[11.5px] text-soft">{brand.title}</span>}
      </BrandReveal>
    </a>
  );
}
