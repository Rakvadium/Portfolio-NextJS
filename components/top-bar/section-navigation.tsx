"use client";
// The section navigation island. Owns the active section (one listener) and renders both:
// - lg+: <nav aria-label="Sections"> with aria-current and a spring underline under the active link;
// - below lg: a dropdown button labelled with the active section, and its menu.
// `children` (the server-rendered social links) sits next to the dropdown, so the bar keeps one
// three-part layout: brand | nav | dropdown + socials.
//
// Links are plain <a href="#id">: the browser scrolls (smooth unless reduced motion, offset by
// scroll-padding-top) and the URL hash updates. Menu links only close the menu.
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { SectionView } from "@/app/data/site";
import { cn } from "@/lib/utils";
import { useActiveSection } from "./use-active-section";

type SectionId = SectionView["id"];

export type SectionNavigationProps = {
  sections: readonly [SectionView, ...SectionView[]];
  /** Rendered after the dropdown, in the bar's right-hand group. */
  children?: ReactNode;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function SectionNavigation({ sections, children }: SectionNavigationProps) {
  const ids = useMemo(() => sections.map((s) => s.id) as [SectionId, ...SectionId[]], [sections]);
  const active = useActiveSection(ids);
  const activeLabel = sections.find((s) => s.id === active)?.label ?? sections[0].label;
  const groupId = useId();

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup id={groupId}>
        <nav aria-label="Sections" className="hidden items-center gap-1 lg:flex">
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
        <div className="flex items-center gap-2">
          <SectionMenu sections={sections} active={active} activeLabel={activeLabel} />
          {children}
        </div>
      </LayoutGroup>
    </MotionConfig>
  );
}

/**
 * Below lg. Dismissed by Escape (focus returns to the button), a pointerdown outside the menu and
 * button, or choosing a link. G's transparent full-screen "Close section menu" button is dropped:
 * it was a stray tab stop with no visible affordance.
 */
function SectionMenu({
  sections,
  active,
  activeLabel,
}: {
  sections: readonly SectionView[];
  active: SectionId;
  activeLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div ref={root} className="relative lg:hidden">
      <button
        ref={button}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={menuId}
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.06] pl-3.5 pr-2.5 text-sm font-medium text-white"
      >
        <span className="sr-only">Jump to section. Current section: </span>
        {activeLabel}
        <ChevronDown aria-hidden className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            id={menuId}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: EASE }}
            className="absolute right-0 top-11 z-10 w-56 origin-top-right rounded-2xl border border-white/12 bg-raised/95 p-1.5 shadow-[0_20px_50px_-12px_rgb(0_0_0/0.8)] backdrop-blur-xl"
          >
            {sections.map((s) => {
              const isActive = s.id === active;
              return (
                <li key={s.id}>
                  <a
                    href={s.href}
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[15px]",
                      isActive ? "bg-white/[0.08] text-white" : "text-body hover:bg-white/[0.05]",
                    )}
                  >
                    {s.label}
                    {isActive && <span aria-hidden className="bg-brand h-2 w-2 rounded-full" />}
                  </a>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
