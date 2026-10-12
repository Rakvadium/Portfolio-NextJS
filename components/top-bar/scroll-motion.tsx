"use client";
// Scroll-position-linked motion in the top bar (framer; see the mechanism split in app/motion.css).
// Both start at the at-top pose on server and client, so hydration matches.
import type { ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * The brand name and title fade and slide in over scrollY 200-330px while the hero h1 fades out over
 * 150-300px (components/hero/scroll-motion.tsx). The slide is a transform, cancelled for reduced
 * motion by `motion-static`; the fade runs for everyone, as in G.
 */
export function BrandReveal({ children, className }: { children: ReactNode; className?: string }) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [200, 330], [0, 1]);
  const x = useTransform(scrollY, [200, 330], [-8, 0]);
  return (
    <motion.span style={{ opacity, x }} className={cn("motion-static", className)}>
      {children}
    </motion.span>
  );
}

/** 1px gradient line under the bar, scaled to page scroll progress. Runs under reduced motion, as in G. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return <motion.div aria-hidden style={{ scaleX: scrollYProgress }} className="bg-brand h-px origin-left" />;
}
