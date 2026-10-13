"use client";
// PROTOTYPE (throwaway, branch prototype/mobile-nav): four mobile navigation designs switchable via
// `?nav=current|A..I` on the existing `/` route. Below lg the chosen variant replaces the top bar;
// lg+ always renders the existing TopBar (passed in as children), unchanged.
import { Suspense, type ComponentType, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { PrototypeSwitcher } from "./switcher";
import type { MobileNavProps } from "./shared";
import { VariantA, name as nameA } from "./variant-a-dock";
import { VariantB, name as nameB } from "./variant-b-island";
import { VariantC, name as nameC } from "./variant-c-fullscreen";
import { VariantD, name as nameD } from "./variant-d-rail";
import { VariantE, name as nameE } from "./variant-e-glass";
import { VariantF, name as nameF } from "./variant-f-glass-docked";
import { VariantG, name as nameG } from "./variant-g-glass-labeled";
import { VariantH, name as nameH } from "./variant-h-morph";
import { VariantI, name as nameI } from "./variant-i-handoff";

export const variants = [
  { key: "current", name: "Today's header", Component: undefined },
  { key: "A", name: nameA, Component: VariantA },
  { key: "B", name: nameB, Component: VariantB },
  { key: "C", name: nameC, Component: VariantC },
  { key: "D", name: nameD, Component: VariantD },
  { key: "E", name: nameE, Component: VariantE },
  { key: "F", name: nameF, Component: VariantF },
  { key: "G", name: nameG, Component: VariantG },
  { key: "H", name: nameH, Component: VariantH },
  { key: "I", name: nameI, Component: VariantI },
] as const satisfies readonly { key: string; name: string; Component: ComponentType<MobileNavProps> | undefined }[];

const showSwitcher = process.env.NEXT_PUBLIC_VERCEL_ENV !== "production";

export function MobileNavPrototype({ children, ...props }: MobileNavProps & { children: ReactNode }) {
  return (
    <Suspense fallback={children}>
      <Chosen {...props}>{children}</Chosen>
    </Suspense>
  );
}

function Chosen({ children, ...props }: MobileNavProps & { children: ReactNode }) {
  const param = useSearchParams().get("nav");
  const variant = variants.find((v) => v.key === param) ?? variants[0];
  const { Component } = variant;
  return (
    <>
      {Component ? <div className="max-lg:hidden">{children}</div> : children}
      {Component && (
        <div className="lg:hidden">
          <Component {...props} />
        </div>
      )}
      {showSwitcher && <PrototypeSwitcher variants={variants} current={variant.key} />}
    </>
  );
}
