"use client";
// lg+: the section navigation island. <nav aria-label="Sections"> with aria-current and a spring
// underline under the active link. Below lg the phone dock's tabs (components/mobile-nav) do this job.
//
// Links are plain <a href="#id">: the browser scrolls (smooth unless reduced motion, offset by
// scroll-padding-top) and the URL hash updates.
import { useId, useMemo } from "react";
import { LayoutGroup, MotionConfig, motion } from "framer-motion";
import type { SectionView } from "@/app/data/site";
import { cn } from "@/lib/utils";
import { useActiveSection } from "./use-active-section";

type SectionId = SectionView["id"];

export function SectionNavigation({ sections }: { sections: readonly [SectionView, ...SectionView[]] }) {
  const ids = useMemo(() => sections.map((s) => s.id) as [SectionId, ...SectionId[]], [sections]);
  const active = useActiveSection(ids);
  const groupId = useId();

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup id={groupId}>
        <nav aria-label="Sections" className="flex items-center gap-1">
          {sections.map((s) => {
            const isActive = s.id === active;
            return (
              <a
                key={s.id}
                href={s.href}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative px-3.5 py-2 text-[15px] font-medium transition-colors",
                  isActive ? "text-white" : "text-soft hover:text-white",
                )}
              >
                {s.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    aria-hidden
                    className="bg-brand absolute inset-x-3 -bottom-px h-[2px] rounded-full"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  />
                )}
              </a>
            );
          })}
        </nav>
      </LayoutGroup>
    </MotionConfig>
  );
}
