"use client";
import { useMemo, type ReactNode } from "react";
import type { SectionView } from "@/app/data/site";
import { mapNonEmpty } from "@/lib/non-empty";
import { useActiveSection } from "@/components/top-bar/use-active-section";
import { MobileTopBar, type MobileTopBarProps } from "./mobile-top-bar";
import { SectionTabs } from "./section-tabs";

export function MobileNavigation({
  brand,
  portrait,
  sections,
  children,
}: Omit<MobileTopBarProps, "active" | "sections"> & {
  sections: readonly [SectionView, ...SectionView[]];
  children: ReactNode;
}) {
  const ids = useMemo(() => mapNonEmpty(sections, (s) => s.id), [sections]);
  const active = useActiveSection(ids);
  return (
    <>
      <MobileTopBar brand={brand} portrait={portrait} sections={sections} active={active} />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex items-center gap-(--dock-gap) px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 lg:hidden">
        <div className="min-w-0 flex-1">
          <SectionTabs sections={sections} active={active} />
        </div>
        <div className="pointer-events-auto shrink-0">{children}</div>
      </div>
    </>
  );
}
