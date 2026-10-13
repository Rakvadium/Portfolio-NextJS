"use client";
import type { ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

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

export function HeroPortraitImage({ children }: { children: ReactNode }) {
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 700], [1.08, 1]);
  return (
    <motion.div style={{ scale }} className="motion-static absolute inset-0">
      {children}
    </motion.div>
  );
}
