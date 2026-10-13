"use client";
// PROTOTYPE (throwaway): the frame H and I share. F's bottom row (section tab capsule + GitHub |
// LinkedIn | Email act capsule) under a 56px top bar that is transparent at the top of the page
// and turns into glass once the hero masthead has handed the identity up to it. The masthead
// itself lives in components/hero/hero.tsx (ProtoMasthead); MASTHEAD_CSS reveals it below lg.
import type { ReactNode } from "react";
import { motion, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { ScrollProgress } from "../scroll-motion";
import { ActLink, CapsuleDivider, GlassShell, SectionTabs, useCollapsedTitle } from "./glass-shell";
import { useActive, type MobileNavProps } from "./shared";

export const BAR_H = 56;

/** Below lg: show the breakout masthead, drop the in-card identity, and give the card a lead-in. */
export const MASTHEAD_CSS = `@media (max-width: 1023.98px) {
  [data-proto-masthead] { display: block !important; }
  [data-proto-incard-identity] { display: none !important; }
  [data-proto-eyebrow] { display: block !important; }
  #home { padding-top: 60px !important; }
  [data-proto-lead] { font-size: 17px !important; line-height: 1.6 !important; color: var(--color-ink) !important; }
}`;

export function IdentityShell({
  brand,
  sections,
  social,
  left,
  barOpacity,
  extraCss = "",
}: MobileNavProps & { left: ReactNode; barOpacity: MotionValue<number>; extraCss?: string }) {
  const { active } = useActive(sections);
  const title = useCollapsedTitle(sections, BAR_H);
  const email = social.find((c) => c.kind === "email")!;
  return (
    <GlassShell
      dense
      brand={brand}
      sections={sections}
      scrollPaddingTop="4.5rem"
      extraCss={MASTHEAD_CSS + extraCss}
      header={
        <header className="fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)]">
          <motion.div
            aria-hidden
            style={{ opacity: barOpacity }}
            className="absolute inset-0 border-b border-white/[0.08] bg-canvas/80 backdrop-blur-xl"
          />
          <div className="relative flex items-center justify-between gap-3 px-4" style={{ height: BAR_H }}>
            {left}
            <p
              aria-hidden
              className={cn(
                "shrink-0 text-[13px] font-medium text-soft",
                "motion-safe:transition-[opacity,transform] motion-safe:duration-200",
                title.visible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
              )}
            >
              {title.label}
            </p>
          </div>
          <div className="absolute inset-x-0 -bottom-px">
            <ScrollProgress />
          </div>
        </header>
      }
      tabs={<SectionTabs sections={sections} active={active} />}
      act={
        <>
          {social
            .filter((c) => c.kind !== "email")
            .map((c) => (
              <ActLink key={c.kind} channel={c} />
            ))}
          <CapsuleDivider />
          <ActLink channel={email} tone="primary" />
        </>
      }
    />
  );
}

/** Classes shared by the bar's small identity (I's visible copy, H's measuring slots). */
export const BAR_AVATAR = "relative h-8 w-8 shrink-0 rounded-[10px] bg-[linear-gradient(135deg,var(--color-amber),var(--color-coral)_50%,var(--color-magenta))] p-px";
export const BAR_NAME = "whitespace-nowrap font-display text-[16px] font-extrabold leading-[1.1] tracking-[-0.02em]";
export const BAR_TITLE = "whitespace-nowrap text-[12px] font-semibold leading-[1.2] tracking-tight text-soft";
