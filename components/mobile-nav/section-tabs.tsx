"use client";
import { useId } from "react";
import { LayoutGroup, MotionConfig, motion } from "framer-motion";
import type { SectionView } from "@/app/data/site";
import { sectionIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { GlassCapsule } from "./glass-capsule";

const SPRING = { type: "spring", stiffness: 520, damping: 40 } as const;

export function SectionTabs({ sections, active }: { sections: readonly SectionView[]; active: SectionView["id"] }) {
  const groupId = useId();
  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup id={groupId}>
        <nav aria-label="Sections" className="pointer-events-auto w-fit max-w-full">
          <GlassCapsule className="items-stretch gap-0.5">
            {sections.map((s) => {
              const Icon = sectionIcon[s.id];
              const isActive = s.id === active;
              return (
                <a
                  key={s.id}
                  href={s.href}
                  aria-label={s.label}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "group relative flex min-w-(--dock-tab) shrink-0 items-center justify-center rounded-full",
                    isActive ? "text-coral" : "text-soft hover:text-ink",
                  )}
                >
                  {isActive && <motion.span layoutId="tab-pill" aria-hidden className="absolute inset-0 rounded-full bg-coral/20" transition={SPRING} />}
                  <Icon
                    aria-hidden
                    strokeWidth={isActive ? 2.25 : 2}
                    className={cn(
                      "relative size-(--dock-icon) shrink-0 motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-active:scale-90",
                      isActive && "glow-coral",
                    )}
                  />
                </a>
              );
            })}
          </GlassCapsule>
        </nav>
      </LayoutGroup>
    </MotionConfig>
  );
}
