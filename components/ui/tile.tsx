"use client";
import type { ComponentPropsWithoutRef, PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Glow = "amber" | "coral" | "magenta";
export type TileMotion = "none" | "enter" | "enter-fade" | "reveal";

export type TileProps = {
  children: ReactNode;
  /** Cursor-glow color. Default "coral". */
  glow?: Glow;
  /** Default "none". */
  motion?: TileMotion;
  /** Rendered element. `li` lets list items be tiles without a wrapper. */
  as?: "div" | "li" | "article";
  className?: string;
} & Pick<ComponentPropsWithoutRef<"div">, "id" | "aria-labelledby" | "aria-label">;

const motionClass: Record<TileMotion, string | undefined> = {
  none: undefined,
  enter: "motion-enter",
  "enter-fade": "motion-enter-fade",
  reveal: "motion-reveal",
};

function trackPointer(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--x", `${e.clientX - r.left}px`);
  el.style.setProperty("--y", `${e.clientY - r.top}px`);
}

export function Tile({
  children,
  glow = "coral",
  motion = "none",
  as: As = "div",
  className,
  ...rest
}: TileProps) {
  return (
    <As
      className={cn("tile", motionClass[motion], className)}
      data-tone={glow}
      onPointerMove={trackPointer}
      {...rest}
    >
      <div className="relative h-full">{children}</div>
    </As>
  );
}
