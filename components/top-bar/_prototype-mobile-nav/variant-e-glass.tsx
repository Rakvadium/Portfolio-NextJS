"use client";
// PROTOTYPE E · Glass shell. The closest 1:1 of the uvsdecks.gg mobile shell: slim glass bar (brand,
// collapsing section title, GitHub + LinkedIn), icon-only section tab capsule bottom-left, and a
// round Email act capsule bottom-right.
import { ActLink, GlassShell, NavIconLink, SectionTabs } from "./glass-shell";
import { useActive, type MobileNavProps } from "./shared";

export const name = "Glass shell";

export function VariantE({ brand, sections, social }: MobileNavProps) {
  const { active } = useActive(sections);
  const email = social.find((c) => c.kind === "email")!;
  return (
    <GlassShell
      brand={brand}
      sections={sections}
      topRight={social.filter((c) => c.kind !== "email").map((c) => <NavIconLink key={c.kind} channel={c} />)}
      tabs={<SectionTabs sections={sections} active={active} />}
      act={<ActLink channel={email} tone="primary" />}
    />
  );
}
