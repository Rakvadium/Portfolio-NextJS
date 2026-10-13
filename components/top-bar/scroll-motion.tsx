"use client";
import type { ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

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

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return <motion.div aria-hidden style={{ scaleX: scrollYProgress }} className="bg-brand h-px origin-left" />;
}
