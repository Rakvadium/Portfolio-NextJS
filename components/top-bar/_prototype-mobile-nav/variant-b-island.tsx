"use client";
// PROTOTYPE B · Dynamic island. No top bar: one floating glass pill at the top shows the monogram,
// the current section with a scroll-progress ring, and the social icons. Tapping the section morphs
// the pill into a card listing every section; choosing one, Escape, or a tap outside morphs it back.
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, MotionConfig, motion, useScroll } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import { channelIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { MobileScrollPadding, useActive, type MobileNavProps } from "./shared";

export const name = "Dynamic island";

const SPRING = { type: "spring", stiffness: 420, damping: 34, mass: 0.9 } as const;

export function VariantB({ brand, sections, social }: MobileNavProps) {
  const { active, label } = useActive(sections);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    firstLink.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      requestAnimationFrame(() => trigger.current?.focus());
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
    <MotionConfig reducedMotion="user">
      <MobileScrollPadding top="5rem" />
      <AnimatePresence>
        {open && (
          <motion.div
            key="scrim"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[3px]"
          />
        )}
      </AnimatePresence>

      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-40 h-28 bg-gradient-to-b from-canvas from-40% to-transparent" />
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3">
        <LayoutGroup id="proto-island">
          <motion.div
            ref={root}
            layout
            transition={SPRING}
            style={{ borderRadius: open ? 30 : 999 }}
            className={cn(
              "pointer-events-auto overflow-hidden border border-white/[0.11] bg-[#18161c]/85 shadow-[0_18px_44px_-14px_rgb(0_0_0/0.95),inset_0_1px_0_0_rgb(255_255_255/0.07)] backdrop-blur-2xl",
              open ? "w-full max-w-[420px]" : "w-auto",
            )}
          >
            {open ? (
              <div className="p-2.5">
                <div className="flex items-center gap-3 px-1.5 pb-2 pt-1">
                  <Monogram monogram={brand.monogram} large />
                  <motion.div
                    layout="position"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.08 } }}
                    className="min-w-0 flex-1 leading-tight"
                  >
                    <p className="truncate font-display text-[17px] font-bold tracking-tight">{brand.name}</p>
                    <p className="truncate text-xs text-soft">{brand.title}</p>
                  </motion.div>
                  <motion.button
                    layoutId="island-toggle"
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      trigger.current?.focus();
                    }}
                    aria-label="Close section menu"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-white"
                  >
                    <X aria-hidden className="h-[18px] w-[18px]" />
                  </motion.button>
                </div>
                <nav aria-label="Sections">
                  <ul className="flex flex-col">
                    {sections.map((s, i) => {
                      const isActive = s.id === active;
                      return (
                        <motion.li
                          key={s.id}
                          layout="position"
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0, transition: { delay: 0.05 + i * 0.035 } }}
                        >
                          <a
                            ref={i === 0 ? firstLink : undefined}
                            href={s.href}
                            aria-current={isActive ? "true" : undefined}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "flex items-center gap-3.5 rounded-2xl px-3 py-3 outline-offset-[-2px]",
                              isActive ? "bg-white/[0.07]" : "active:bg-white/[0.05]",
                            )}
                          >
                            <span className="w-5 font-mono text-[11px] tabular-nums text-soft/80">{String(i + 1).padStart(2, "0")}</span>
                            <span
                              className={cn(
                                "flex-1 font-display text-[20px] font-semibold tracking-tight",
                                isActive ? "text-brand" : "text-ink",
                              )}
                            >
                              {s.label}
                            </span>
                            {isActive && <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-soft">You&apos;re here</span>}
                          </a>
                        </motion.li>
                      );
                    })}
                  </ul>
                </nav>
                <motion.div
                  layout="position"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.18 } }}
                  className="mt-2 grid grid-cols-3 gap-2 border-t border-white/[0.08] px-0.5 pt-2.5"
                >
                  {social.map((c) => {
                    const Icon = channelIcon[c.kind];
                    return (
                      <a
                        key={c.kind}
                        href={c.href}
                        target={c.external ? "_blank" : undefined}
                        rel={c.external ? "noopener noreferrer" : undefined}
                        aria-label={c.accessibleName}
                        className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-white/[0.06] text-sm font-medium text-chip"
                      >
                        <Icon aria-hidden className="h-4 w-4" />
                        {c.label}
                      </a>
                    );
                  })}
                </motion.div>
              </div>
            ) : (
              <div className="flex h-[52px] items-center gap-1 pl-1.5 pr-1.5">
                <a href="#home" aria-label={`${brand.name}, back to top`} className="shrink-0">
                  <Monogram monogram={brand.monogram} />
                </a>
                <motion.button
                  ref={trigger}
                  layoutId="island-toggle"
                  type="button"
                  aria-expanded={false}
                  onClick={() => setOpen(true)}
                  className="flex h-10 items-center gap-2 rounded-full pl-2 pr-2.5 text-[15px] font-semibold text-white active:bg-white/[0.06]"
                >
                  <ProgressRing />
                  <span className="sr-only">Jump to section. Current section: </span>
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={label}
                      initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                      transition={{ duration: 0.22 }}
                      className="whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  </AnimatePresence>
                  <ChevronDown aria-hidden className="h-4 w-4 text-soft" />
                </motion.button>
                <span aria-hidden className="mx-1 h-6 w-px bg-white/10" />
                <ul className="flex items-center">
                  {social.map((c) => {
                    const Icon = channelIcon[c.kind];
                    return (
                      <li key={c.kind}>
                        <a
                          href={c.href}
                          aria-label={c.accessibleName}
                          title={c.accessibleName}
                          target={c.external ? "_blank" : undefined}
                          rel={c.external ? "noopener noreferrer" : undefined}
                          className="flex h-10 w-10 items-center justify-center rounded-full text-chip active:bg-white/[0.08]"
                        >
                          <Icon aria-hidden className="h-[17px] w-[17px]" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </motion.div>
        </LayoutGroup>
      </header>
    </MotionConfig>
  );
}

function Monogram({ monogram, large }: { monogram: string; large?: boolean }) {
  return (
    <motion.span
      layoutId="island-mark"
      aria-hidden
      transition={SPRING}
      className={cn(
        "bg-brand flex shrink-0 items-center justify-center font-display font-extrabold text-canvas",
        large ? "h-11 w-11 rounded-[14px] text-[15px]" : "h-10 w-10 rounded-full text-[13px]",
      )}
    >
      {monogram}
    </motion.span>
  );
}

/** Page scroll progress as a gradient ring. */
function ProgressRing() {
  const { scrollYProgress } = useScroll();
  return (
    <svg aria-hidden viewBox="0 0 20 20" className="h-5 w-5 -rotate-90">
      <defs>
        <linearGradient id="proto-island-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-amber)" />
          <stop offset="50%" stopColor="var(--color-coral)" />
          <stop offset="100%" stopColor="var(--color-magenta)" />
        </linearGradient>
      </defs>
      <circle cx="10" cy="10" r="7.5" fill="none" stroke="rgb(255 255 255 / 0.14)" strokeWidth="2.5" />
      <motion.circle
        cx="10"
        cy="10"
        r="7.5"
        fill="none"
        stroke="url(#proto-island-ring)"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{ pathLength: scrollYProgress }}
      />
    </svg>
  );
}
