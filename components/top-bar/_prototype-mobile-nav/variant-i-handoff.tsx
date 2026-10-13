"use client";
// PROTOTYPE I · Handoff. F's shell plus the hero masthead (portrait, name, title above the intro
// card). The masthead scrolls away naturally; as it passes under the bar, the bar's small avatar,
// name and title spring in (staggered) and the glass background fades in. No measuring.
import { useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { BAR_AVATAR, BAR_NAME, BAR_TITLE, IdentityShell } from "./identity-shell";
import { useScrolledPast, type MobileNavProps } from "./shared";

export const name = "Masthead handoff";

/** Roughly where the masthead title passes under the 56px bar (with #home padded 60px). */
const HANDOFF_Y = 185;
const SPRING = { type: "spring", stiffness: 420, damping: 32 } as const;

export function VariantI(props: MobileNavProps) {
  const { brand, portrait } = props;
  const shown = useScrolledPast(HANDOFF_Y);
  const { scrollY } = useScroll();
  const barOpacity = useTransform(scrollY, [HANDOFF_Y - 50, HANDOFF_Y], [0, 1]);
  useEffect(() => () => void document.querySelector<HTMLElement>("[data-proto-masthead]")?.style.removeProperty("opacity"), []);
  // Fade the masthead as it slides under the still-transparent bar, so no half-clipped name shows.
  useMotionValueEvent(scrollY, "change", (y) => {
    const el = document.querySelector<HTMLElement>("[data-proto-masthead]");
    if (el) el.style.opacity = String(Math.min(1, Math.max(0, 1 - (y - (HANDOFF_Y - 90)) / 90)));
  });

  const enter = (delay: number) => ({
    initial: false as const,
    animate: shown ? { opacity: 1, y: 0, transition: { ...SPRING, delay } } : { opacity: 0, y: 10, transition: { duration: 0.15 } },
  });

  return (
    <IdentityShell
      {...props}
      barOpacity={barOpacity}
      left={
        <a
          href="#home"
          aria-label={`${brand.name}, back to top`}
          tabIndex={shown ? undefined : -1}
          className="flex min-w-0 items-center gap-2.5"
          style={{ pointerEvents: shown ? "auto" : "none" }}
        >
          <motion.span
            initial={false}
            animate={shown ? { opacity: 1, scale: 1, transition: SPRING } : { opacity: 0, scale: 0.6, transition: { duration: 0.15 } }}
            className={BAR_AVATAR}
          >
            <span className="relative block h-full w-full overflow-hidden rounded-[9px] bg-canvas">
              <Image src={portrait.src} alt="" fill sizes="32px" className="object-cover" />
            </span>
          </motion.span>
          <span className="flex min-w-0 flex-col">
            <motion.span {...enter(0.04)} className={BAR_NAME}>
              {brand.name}
            </motion.span>
            <motion.span {...enter(0.09)} className={BAR_TITLE}>
              {brand.title}
            </motion.span>
          </span>
        </a>
      }
    />
  );
}
