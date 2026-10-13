import type { ComponentPropsWithoutRef } from "react";
import Image from "next/image";
import type { Image as ImageData } from "@/app/data/portfolio";
import { cn } from "@/lib/utils";

export const identityType = {
  masthead: {
    name: "font-display text-[44px] font-extrabold leading-[0.95] tracking-[-0.035em]",
    title: "text-lg font-semibold tracking-tight",
  },
  bar: {
    name: "font-display text-[16px] font-extrabold leading-[1.1] tracking-[-0.02em]",
    title: "text-[12px] font-semibold leading-[1.2] tracking-tight text-soft",
  },
} as const;

const avatarSize = {
  masthead: { ring: "h-20 w-20 rounded-[24px] p-[2px]", inner: "rounded-[22px]" },
  bar: { ring: "h-8 w-8 rounded-[10px] p-px", inner: "rounded-[9px]" },
} as const;

export function Avatar({
  portrait,
  size,
  alt = "",
  glow = false,
  className,
  ...rest
}: Omit<ComponentPropsWithoutRef<"span">, "children"> & {
  portrait: ImageData;
  size: keyof typeof avatarSize;
  alt?: string;
  glow?: boolean;
}) {
  const s = avatarSize[size];
  return (
    <span {...rest} className={cn("bg-brand-diagonal relative block shrink-0", s.ring, glow && "shadow-avatar", className)}>
      <span className={cn("relative block h-full w-full overflow-hidden bg-canvas", s.inner)}>
        <Image src={portrait.src} alt={alt} fill sizes="80px" className="object-cover" />
      </span>
    </span>
  );
}
