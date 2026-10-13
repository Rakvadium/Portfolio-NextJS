"use client";
// PROTOTYPE G · Glass shell, labeled active. E's shell, but the active tab springs open into an
// icon + label pill so the current section is named without reading the top bar.
import { ActLink, GlassShell, NavIconLink, SectionTabs } from "./glass-shell";
import { useActive, type MobileNavProps } from "./shared";

export const name = "Glass shell, labeled active";

export function VariantG({ brand, sections, social }: MobileNavProps) {
  const { active } = useActive(sections);
  const email = social.find((c) => c.kind === "email")!;
  return (
    <GlassShell
      brand={brand}
      sections={sections}
      topRight={social.filter((c) => c.kind !== "email").map((c) => <NavIconLink key={c.kind} channel={c} />)}
      tabs={<SectionTabs sections={sections} active={active} labeled />}
      act={<ActLink channel={email} tone="primary" />}
    />
  );
}
