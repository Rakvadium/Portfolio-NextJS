"use client";
// PROTOTYPE (throwaway): the uvsdecks.gg mobile shell ("liquid glass") mapped onto the portfolio
// palette. Pieces for variants E, F, G: a slim glass top bar with a collapsing centred title, a
// left-aligned icon-only tab capsule, and a round "act" capsule on the right.
// Reference: uvs-decks-gg/src/components/shell/{mobile-glass.ts,mobile-tab-bar/*,mobile-nav-bar/*}.
import { useEffect, useState, type ReactNode } from "react";
import { LayoutGroup, MotionConfig, motion } from "framer-motion";
import type { Brand, Channel, SectionView } from "@/app/data/site";
import { channelIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { ScrollProgress } from "../scroll-motion";
import { MobileScrollPadding, sectionIcon, type MobileNavProps } from "./shared";

/* ------------------------------------------------------------------ tokens (uvs mobile-glass.ts) */

const GLASS_RING =
  "bg-[linear-gradient(115deg,color-mix(in_oklch,var(--color-amber)_45%,transparent),rgb(255_255_255/0.1)_28%,rgb(255_255_255/0.1)_72%,color-mix(in_oklch,var(--color-magenta)_45%,transparent))]";
const GLASS_SURFACE = "bg-canvas/80 backdrop-blur-xl";
const FLOATING_SHADOW = "shadow-[0_12px_36px_-16px_rgb(0_0_0/0.75)]";
const ICON = "h-[var(--g-icon)] w-[var(--g-icon)]";
const ACTIVE_ICON_GLOW = "[filter:drop-shadow(0_0_4px_rgb(255_106_85/0.55))]";
export const NAV_ICON_BUTTON =
  "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink transition-[color,background-color,transform] duration-150 hover:bg-white/[0.08] motion-safe:active:scale-95";
const ACT_BUTTON =
  "relative flex h-[var(--g-act)] w-[var(--g-act)] shrink-0 items-center justify-center rounded-full text-ink transition-[color,background-color,transform] duration-150 hover:bg-white/[0.08] motion-safe:active:scale-95";

/**
 * Metrics as CSS vars (uvs metrics.ts), with a tighter set under 380px so the bottom row never
 * overflows a 360px phone. `dense` is F's set: five tabs plus a three-button act capsule.
 */
function metricsCss(dense: boolean) {
  const wide = dense ? { tab: 42, act: 38 } : { tab: 44, act: 42 };
  const narrow = dense ? { tab: 38, act: 36 } : { tab: 38, act: 40 };
  return `[data-glass-shell]{--g-row:48px;--g-icon:20px;--g-gap:8px;--g-tab:${wide.tab}px;--g-act:${wide.act}px}
@media (max-width: 379.98px){[data-glass-shell]{--g-tab:${narrow.tab}px;--g-act:${narrow.act}px;--g-gap:6px}}`;
}

/* ------------------------------------------------------------------ shell */

export function GlassShell({
  brand,
  sections,
  topRight,
  tabs,
  act,
  dense = false,
}: {
  brand: Brand;
  sections: MobileNavProps["sections"];
  topRight?: ReactNode;
  tabs: ReactNode;
  act: ReactNode;
  dense?: boolean;
}) {
  const title = useCollapsedTitle(sections);
  return (
    <MotionConfig reducedMotion="user">
      <MobileScrollPadding top="3.75rem" extra={metricsCss(dense)} />
      <div data-glass-shell>
        <header className="fixed inset-x-0 top-0 z-50 flex flex-col border-b border-white/[0.08] bg-canvas/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
          <div className="grid h-11 grid-cols-[minmax(2.5rem,1fr)_minmax(0,auto)_minmax(2.5rem,1fr)] items-center px-1.5">
            <div className="flex min-w-0 items-center justify-start">
              <a href="#home" aria-label={`${brand.name}, back to top`} className="flex min-w-0 items-center gap-2 rounded-full pl-1.5 pr-2">
                <span
                  aria-hidden
                  className="bg-brand flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] font-display text-[11px] font-extrabold text-canvas"
                >
                  {brand.monogram}
                </span>
                <span className="truncate font-display text-[15px] font-bold tracking-tight">{brand.name}</span>
              </a>
            </div>
            <div className="flex min-w-0 items-center justify-center">
              <p
                aria-hidden
                className={cn(
                  "min-w-0 truncate px-1 text-center text-[15px] font-semibold text-ink",
                  "motion-safe:transition-[opacity,transform] motion-safe:duration-200",
                  title.visible ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0",
                )}
              >
                {title.label}
              </p>
            </div>
            <div className="flex min-w-0 items-center justify-end gap-0.5">{topRight}</div>
          </div>
          <div className="absolute inset-x-0 -bottom-px">
            <ScrollProgress />
          </div>
        </header>

        <div
          className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex items-center gap-[var(--g-gap)] px-3 pt-3"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <div className="min-w-0 flex-1">
            <nav aria-label="Sections" className="pointer-events-auto w-fit max-w-full">
              <GlassCapsule bodyClassName="h-[var(--g-row)] items-stretch gap-0.5 p-0.5">{tabs}</GlassCapsule>
            </nav>
          </div>
          <div role="group" aria-label="Contact" className="pointer-events-auto shrink-0">
            <GlassCapsule bodyClassName="h-[var(--g-row)] items-center gap-0.5 p-0.5">{act}</GlassCapsule>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}

export function GlassCapsule({ children, bodyClassName }: { children: ReactNode; bodyClassName?: string }) {
  return (
    <div className={cn("relative rounded-full p-px", GLASS_RING, FLOATING_SHADOW)}>
      <div className={cn("relative flex items-center rounded-full", GLASS_SURFACE, bodyClassName)}>{children}</div>
    </div>
  );
}

export function CapsuleDivider() {
  return <span aria-hidden className="mx-0.5 h-6 w-px shrink-0 self-center bg-white/15" />;
}

/* ------------------------------------------------------------------ tabs */

/** Icon-only tabs; the tinted active pill slides between them. `labeled` widens the active tab into icon + label. */
export function SectionTabs({
  sections,
  active,
  labeled = false,
}: {
  sections: readonly SectionView[];
  active: SectionView["id"];
  labeled?: boolean;
}) {
  return (
    <LayoutGroup id={labeled ? "glass-tabs-labeled" : "glass-tabs"}>
      {sections.map((s) => {
        const Icon = sectionIcon[s.id];
        const isActive = s.id === active;
        const showLabel = labeled && isActive;
        return (
          <motion.a
            key={s.id}
            href={s.href}
            aria-label={s.label}
            aria-current={isActive ? "true" : undefined}
            layout={labeled}
            transition={{ type: "spring", stiffness: 520, damping: 40 }}
            className={cn(
              "group relative flex min-w-[var(--g-tab)] shrink-0 items-center justify-center rounded-full",
              isActive ? "text-coral" : "text-soft hover:text-ink",
              showLabel && "gap-1.5 pl-3 pr-3.5 max-[379.98px]:pl-2.5 max-[379.98px]:pr-3",
            )}
          >
            {isActive && (
              <motion.span
                layoutId="glass-tab-pill"
                aria-hidden
                className="absolute inset-0 rounded-full bg-coral/20"
                transition={{ type: "spring", stiffness: 520, damping: 40 }}
              />
            )}
            <motion.span layout={labeled ? "position" : false} className="relative flex">
              <Icon
                aria-hidden
                strokeWidth={isActive ? 2.25 : 2}
                className={cn(ICON, "shrink-0 motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-active:scale-90", isActive && ACTIVE_ICON_GLOW)}
              />
            </motion.span>
            {showLabel && (
              <motion.span
                layout="position"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.08 } }}
                className="relative whitespace-nowrap text-[13px] font-semibold tracking-tight max-[379.98px]:text-[12px]"
              >
                {s.label}
              </motion.span>
            )}
          </motion.a>
        );
      })}
    </LayoutGroup>
  );
}

/* ------------------------------------------------------------------ act + nav buttons */

function linkProps(c: Channel) {
  return {
    href: c.href,
    "aria-label": c.accessibleName,
    title: c.accessibleName,
    target: c.external ? "_blank" : undefined,
    rel: c.external ? "noopener noreferrer" : undefined,
  };
}

export function ActLink({ channel, tone = "default" }: { channel: Channel; tone?: "default" | "primary" }) {
  const Icon = channelIcon[channel.kind];
  return (
    <a {...linkProps(channel)} className={cn(ACT_BUTTON, tone === "primary" && "text-amber hover:bg-amber/10")}>
      <Icon aria-hidden strokeWidth={2.25} className={ICON} />
    </a>
  );
}

export function NavIconLink({ channel }: { channel: Channel }) {
  const Icon = channelIcon[channel.kind];
  return (
    <a {...linkProps(channel)} className={NAV_ICON_BUTTON}>
      <Icon aria-hidden className="h-[18px] w-[18px]" />
    </a>
  );
}

/* ------------------------------------------------------------------ collapsing title */

/**
 * uvs's MobileNavTitle collapsible: the bar title appears once the page's large heading has
 * scrolled under the bar. Here: the last section whose h2 has passed the bar's bottom edge. Home
 * (the h1) never produces a title.
 */
function useCollapsedTitle(sections: readonly SectionView[]) {
  const [state, setState] = useState<{ label: string; visible: boolean }>({ label: "", visible: false });
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const barBottom = 44;
      let label = "";
      for (const s of sections) {
        if (s.id === "home") continue;
        const h = document.querySelector(`#${s.id} h2`);
        // Mostly under the bar counts, so the short last section (Contact) still gets its title at the page bottom.
        if (h && h.getBoundingClientRect().top + 8 < barBottom) label = s.label;
      }
      setState((prev) => (label ? { label, visible: true } : { label: prev.label, visible: false }));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [sections]);
  return state;
}
