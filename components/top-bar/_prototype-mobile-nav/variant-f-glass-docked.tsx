"use client";
// PROTOTYPE F · Glass shell, socials docked. The top bar is only brand + collapsing title; GitHub,
// LinkedIn and Email live in the bottom act capsule next to the section tabs (tighter metrics).
import { ActLink, CapsuleDivider, GlassShell, SectionTabs } from "./glass-shell";
import { useActive, type MobileNavProps } from "./shared";

export const name = "Glass shell, socials docked";

export function VariantF({ brand, sections, social }: MobileNavProps) {
  const { active } = useActive(sections);
  const email = social.find((c) => c.kind === "email")!;
  return (
    <GlassShell
      dense
      brand={brand}
      sections={sections}
      tabs={<SectionTabs sections={sections} active={active} />}
      act={
        <>
          {social
            .filter((c) => c.kind !== "email")
            .map((c) => (
              <ActLink key={c.kind} channel={c} />
            ))}
          <CapsuleDivider />
          <ActLink channel={email} tone="primary" />
        </>
      }
    />
  );
}
