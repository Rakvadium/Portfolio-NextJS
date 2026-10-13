"use client";
import { motion, useTransform } from "framer-motion";
import type { Image as ImageData } from "@/app/data/portfolio";
import type { Brand, SectionView } from "@/app/data/site";
import { Avatar, identityType } from "@/components/ui/identity";
import { ScrollProgress } from "@/components/top-bar/scroll-motion";
import { cn } from "@/lib/utils";
import { useMastheadMorph, type MastheadMorph } from "./use-masthead-morph";

export type MobileTopBarProps = {
  brand: Brand;
  portrait: ImageData;
  sections: readonly SectionView[];
  active: SectionView["id"];
};

export function MobileTopBar({ brand, portrait, sections, active }: MobileTopBarProps) {
  const morph = useMastheadMorph();
  const slotClass = cn(morph.measured && "motion-safe:opacity-0!");

  return (
    <header ref={morph.bar} className="fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] lg:hidden">
      <motion.div
        aria-hidden
        style={{ opacity: morph.barOpacity }}
        className="absolute inset-0 border-b border-white/[0.08] bg-canvas/80 backdrop-blur-xl"
      />
      <div className="relative flex h-(--bar-h) items-center justify-between gap-3 px-4">
        <a href="#home" aria-label={`${brand.name}, back to top`} className="flex min-w-0 items-center gap-2.5">
          <motion.span ref={morph.slots.avatar} data-morph-slot="avatar" style={{ opacity: morph.slotOpacity }} className={cn("shrink-0", slotClass)}>
            <Avatar portrait={portrait} size="bar" />
          </motion.span>
          <motion.span style={{ opacity: morph.slotOpacity }} className={cn("flex min-w-0 flex-col", slotClass)}>
            <span ref={morph.slots.name} data-morph-slot="name" className={cn("whitespace-nowrap", identityType.bar.name)}>
              {brand.name}
            </span>
            <span ref={morph.slots.title} data-morph-slot="title" className={cn("whitespace-nowrap", identityType.bar.title)}>
              {brand.title}
            </span>
          </motion.span>
        </a>
        <SectionTitle sections={sections} active={active} />
      </div>
      <div className="absolute inset-x-0 -bottom-px">
        <ScrollProgress />
      </div>
      {morph.measured && <FlyingIdentity brand={brand} portrait={portrait} morph={morph} />}
    </header>
  );
}

function SectionTitle({ sections, active }: { sections: readonly SectionView[]; active: SectionView["id"] }) {
  return (
    <p aria-hidden className="grid shrink-0 justify-items-end text-[13px] font-medium text-soft">
      {sections
        .filter((s) => s.id !== "home")
        .map((s) => (
          <span
            key={s.id}
            data-active={s.id === active || undefined}
            className="col-start-1 row-start-1 translate-y-1 opacity-0 motion-safe:transition-[opacity,transform] motion-safe:duration-200 data-active:translate-y-0 data-active:opacity-100"
          >
            {s.label}
          </span>
        ))}
    </p>
  );
}

function FlyingIdentity({ brand, portrait, morph }: { brand: Brand; portrait: ImageData; morph: MastheadMorph }) {
  const { avatar, name, title } = morph.pieces;
  const titleColor = useTransform(morph.progress, (p) => `color-mix(in srgb, var(--color-soft) ${(p * 100).toFixed(1)}%, var(--color-ink))`);
  return (
    <div aria-hidden className="pointer-events-none fixed left-0 top-0 motion-reduce:hidden">
      <motion.span data-morph-copy="avatar" style={{ ...avatar, transformOrigin: "0 0" }} className="absolute left-0 top-0 block will-change-transform">
        <Avatar portrait={portrait} size="masthead" />
      </motion.span>
      <motion.span
        data-morph-copy="name"
        style={{ ...name, transformOrigin: "0 0" }}
        className={cn("absolute left-0 top-0 inline-block whitespace-nowrap text-ink will-change-transform", identityType.masthead.name)}
      >
        {brand.name}
      </motion.span>
      <motion.span
        data-morph-copy="title"
        style={{ ...title, color: titleColor, transformOrigin: "0 0" }}
        className={cn("absolute left-0 top-0 inline-block whitespace-nowrap will-change-transform", identityType.masthead.title)}
      >
        {brand.title}
      </motion.span>
    </div>
  );
}
