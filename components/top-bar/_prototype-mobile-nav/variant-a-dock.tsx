"use client";
// PROTOTYPE A · Bottom dock. The top strip keeps only the brand and the social icons; the five
// sections move to a floating glass tab bar above the home indicator, thumb-reachable.
import { LayoutGroup, MotionConfig, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ScrollProgress } from "../scroll-motion";
import { SocialLinks } from "../social-links";
import { MobileBrand, MobileScrollPadding, sectionIcon, useActive, useScrolledPast, type MobileNavProps } from "./shared";

export const name = "Bottom dock";

export function VariantA({ brand, sections, social }: MobileNavProps) {
  const { active } = useActive(sections);
  const scrolled = useScrolledPast(8);

  return (
    <MotionConfig reducedMotion="user">
      <MobileScrollPadding top="4.5rem" />
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300",
          scrolled ? "border-b border-white/[0.07] bg-canvas/75 backdrop-blur-xl" : "border-b border-transparent",
        )}
      >
        <div className="flex h-14 items-center justify-between gap-3 px-4">
          <MobileBrand brand={brand} />
          <SocialLinks channels={social} />
        </div>
        <ScrollProgress />
      </header>

      <nav
        aria-label="Sections"
        className="fixed inset-x-3 z-50"
        style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
      >
        <LayoutGroup id="proto-dock">
          <ul className="grid grid-cols-5 rounded-[24px] border border-white/10 bg-[#1a181e]/80 p-1.5 shadow-[0_18px_50px_-12px_rgb(0_0_0/0.9),inset_0_1px_0_0_rgb(255_255_255/0.07)] backdrop-blur-2xl">
            {sections.map((s) => {
              const Icon = sectionIcon[s.id];
              const isActive = s.id === active;
              return (
                <li key={s.id}>
                  <motion.a
                    href={s.href}
                    aria-current={isActive ? "true" : undefined}
                    whileTap={{ scale: 0.92 }}
                    className="flex flex-col items-center gap-1 rounded-2xl py-1.5"
                  >
                    <span className="relative flex h-8 w-14 items-center justify-center">
                      {isActive && (
                        <motion.span
                          layoutId="proto-dock-pill"
                          aria-hidden
                          className="bg-brand absolute inset-0 rounded-full shadow-[0_6px_18px_-6px_rgb(255_106_85/0.8)]"
                          transition={{ type: "spring", stiffness: 520, damping: 38 }}
                        />
                      )}
                      <Icon
                        aria-hidden
                        strokeWidth={isActive ? 2.4 : 2}
                        className={cn("relative h-[19px] w-[19px] transition-colors", isActive ? "text-canvas" : "text-soft")}
                      />
                    </span>
                    <span
                      className={cn(
                        "text-[11px] font-medium leading-none tracking-tight transition-colors",
                        isActive ? "text-white" : "text-soft",
                      )}
                    >
                      {s.label}
                    </span>
                  </motion.a>
                </li>
              );
            })}
          </ul>
        </LayoutGroup>
      </nav>
    </MotionConfig>
  );
}
