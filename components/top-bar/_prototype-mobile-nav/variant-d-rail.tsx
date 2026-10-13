"use client";
// PROTOTYPE D · Section rail. A slim brand + socials bar with a horizontally scrollable chip rail
// under it. The active chip wears the gradient pill and scrolls itself into view; the rail tucks
// under the bar on scroll down and comes back on scroll up.
import { useEffect, useRef, useState } from "react";
import { LayoutGroup, MotionConfig, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";
import { ScrollProgress } from "../scroll-motion";
import { SocialLinks } from "../social-links";
import { MobileBrand, MobileScrollPadding, sectionIcon, useActive, useScrolledPast, type MobileNavProps } from "./shared";

export const name = "Section rail";

const RAIL_H = 50;

export function VariantD({ brand, sections, social }: MobileNavProps) {
  const { active } = useActive(sections);
  const scrolled = useScrolledPast(8);
  const [hidden, setHidden] = useState(false);
  const rail = useRef<HTMLUListElement>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (y < 120) setHidden(false);
    else if (y > prev + 4) setHidden(true);
    else if (y < prev - 4) setHidden(false);
  });

  // Keep the active chip centred in the rail without moving the page.
  useEffect(() => {
    const el = rail.current?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!rail.current || !el) return;
    const left = el.offsetLeft - (rail.current.clientWidth - el.offsetWidth) / 2;
    rail.current.scrollTo({ left, behavior: "smooth" });
  }, [active]);

  return (
    <MotionConfig reducedMotion="user">
      <MobileScrollPadding top="7.25rem" extra="#home { padding-top: 124px; }" />
      <header className="fixed inset-x-0 top-0 z-50">
        <div
          className={cn(
            "relative z-10 flex h-14 items-center justify-between gap-3 px-4 transition-colors duration-300",
            scrolled ? "bg-canvas/80 backdrop-blur-xl" : "bg-canvas/0",
          )}
        >
          <MobileBrand brand={brand} />
          <SocialLinks channels={social} />
        </div>
        <motion.div
          animate={{ y: hidden ? -RAIL_H : 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 40 }}
          onFocusCapture={() => setHidden(false)}
          className={cn(
            "relative border-b transition-colors duration-300",
            scrolled ? "border-white/[0.07] bg-canvas/80 backdrop-blur-xl" : "border-transparent bg-canvas/0",
          )}
        >
          <motion.nav
            aria-label="Sections"
            animate={{ opacity: hidden ? 0 : 1 }}
            transition={{ duration: 0.18 }}
            style={{ height: RAIL_H }}
            className="flex items-center"
          >
            <LayoutGroup id="proto-rail">
              <ul
                ref={rail}
                className="flex w-full snap-x snap-mandatory scroll-px-4 gap-2 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                style={{ maskImage: "linear-gradient(90deg, transparent 0, #000 16px, #000 calc(100% - 28px), transparent 100%)" }}
              >
                {sections.map((s) => {
                  const Icon = sectionIcon[s.id];
                  const isActive = s.id === active;
                  return (
                    <li key={s.id} data-id={s.id} className="shrink-0 snap-start">
                      <a
                        href={s.href}
                        aria-current={isActive ? "true" : undefined}
                        className={cn(
                          "relative flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[14px] font-medium transition-colors",
                          isActive ? "border-transparent text-canvas" : "border-white/10 bg-white/[0.04] text-chip",
                        )}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="proto-rail-pill"
                            aria-hidden
                            className="bg-brand absolute inset-[-1px] rounded-full shadow-[0_6px_20px_-8px_rgb(255_106_85/0.9)]"
                            transition={{ type: "spring", stiffness: 460, damping: 36 }}
                          />
                        )}
                        <Icon aria-hidden strokeWidth={isActive ? 2.4 : 2} className="relative h-4 w-4" />
                        <span className={cn("relative", isActive && "font-semibold")}>{s.label}</span>
                      </a>
                    </li>
                  );
                })}
                <li aria-hidden className="w-2 shrink-0" />
              </ul>
            </LayoutGroup>
          </motion.nav>
          <ScrollProgress />
        </motion.div>
      </header>
    </MotionConfig>
  );
}
