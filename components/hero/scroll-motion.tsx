"use client";
// Scroll-position-linked motion in the hero (framer; see the mechanism split in app/motion.css).
// Every motion value starts at the at-top pose on server and client, so hydration matches. Transforms
// carry `motion-static`, which app/motion.css cancels for reduced-motion users; the h1 fade still runs,
// so the name hands off to the top bar for everyone.
import type { ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/** The hero h1: shrinks over scrollY 0-320px and fades over 150-300px as the top-bar name fades in. */
export function HeroName({ children, className }: { children: ReactNode; className?: string }) {
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 320], [1, 0.62]);
  const y = useTransform(scrollY, [0, 320], [0, -18]);
  const opacity = useTransform(scrollY, [150, 300], [1, 0]);
  return (
    <motion.h1 style={{ scale, y, opacity, transformOrigin: "left top" }} className={cn("motion-static", className)}>
      {children}
    </motion.h1>
  );
}

/** The portrait column: drifts down 50px and shrinks to 0.95 over scrollY 0-700px. */
export function HeroPortrait({ children, className }: { children: ReactNode; className?: string }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, 50]);
  const scale = useTransform(scrollY, [0, 700], [1, 0.95]);
  return (
    <motion.div style={{ y, scale }} className={cn("motion-static", className)}>
      {children}
    </motion.div>
  );
}

/** The image inside the portrait tile: settles from 1.08 to 1 over scrollY 0-700px. */
export function HeroPortraitImage({ children }: { children: ReactNode }) {
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 700], [1.08, 1]);
  return (
    <motion.div style={{ scale }} className="motion-static absolute inset-0">
      {children}
    </motion.div>
  );
}
