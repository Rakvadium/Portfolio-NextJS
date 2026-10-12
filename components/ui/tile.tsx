"use client";
// The glass tile. A client component only for the pointer handler; children stay server-rendered
// (passed through as props). Chrome and glow live in globals.css `.tile`; entrance/reveal in motion.css.
import type { ComponentPropsWithoutRef, PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Glow = "amber" | "coral" | "magenta";
/** Which motion.css class the tile carries. "none" for tiles inside something that already moves. */
export type TileMotion = "none" | "enter" | "enter-fade" | "reveal";

export type TileProps = {
  children: ReactNode;
  /** Cursor-glow color. Default "coral". */
  glow?: Glow;
  /** Hover lift + shadow. Default false: G turned it off for every tile on the page. */
  lift?: boolean;
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

/** Writes --x/--y on the tile; `.tile::before/::after` read them. */
function trackPointer(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--x", `${e.clientX - r.left}px`);
  el.style.setProperty("--y", `${e.clientY - r.top}px`);
}

export function Tile({
  children,
  glow = "coral",
  lift = false,
  motion = "none",
  as: As = "div",
  className,
  ...rest
}: TileProps) {
  return (
    <As
      className={cn("tile", motionClass[motion], className)}
      data-tone={glow}
      data-lift={lift || undefined}
      onPointerMove={trackPointer}
      {...rest}
    >
      <div className="relative h-full">{children}</div>
    </As>
  );
}
