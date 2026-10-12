// Every pill CTA on the page: hero (View work / Email me / Experience), projects (Visit host /
// Source code), contact (Email me). One component, three tones.
import type { ReactNode } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonTone =
  | "brand" // gradient fill, charcoal text, hover scale
  | "ghost" // glass outline
  | "quiet"; // text link, underline on hover

/** Trailing arrows nudge on hover in their own direction. */
export type TrailingArrow = "down" | "right" | "up-right";

export type ButtonLinkProps = {
  href: string;
  tone: ButtonTone;
  children: ReactNode;
  /** Leading icon. */
  icon?: LucideIcon;
  /** Trailing arrow. */
  arrow?: TrailingArrow;
  className?: string;
  /** Accessible name when the visible label is not enough. */
  "aria-label"?: string;
};

const toneClass: Record<ButtonTone, string> = {
  brand:
    "bg-brand h-11 gap-2 rounded-full px-5 font-semibold text-canvas transition-transform hover:scale-[1.03] active:scale-[0.98]",
  ghost:
    "h-11 gap-2 rounded-full border border-white/15 bg-white/[0.05] px-5 font-semibold text-white transition hover:border-white/35 hover:bg-white/10",
  quiet: "h-11 gap-1.5 px-2 font-medium text-body underline-offset-4 hover:text-white hover:underline",
};

const arrowIcon: Record<TrailingArrow, { Icon: LucideIcon; nudge: string }> = {
  down: { Icon: ArrowDown, nudge: "group-hover/button:translate-y-0.5" },
  right: { Icon: ArrowRight, nudge: "group-hover/button:translate-x-0.5" },
  "up-right": { Icon: ArrowUpRight, nudge: "group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5" },
};

/** http(s) hrefs open in a new tab; "#id", mailto: and tel: stay in the tab. */
export function ButtonLink({ href, tone, children, icon: Icon, arrow, className, ...aria }: ButtonLinkProps) {
  const external = /^https?:/.test(href);
  const trailing = arrow ? arrowIcon[arrow] : undefined;
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn("group/button inline-flex items-center text-[15px]", toneClass[tone], className)}
      {...aria}
    >
      {Icon && <Icon aria-hidden className="h-4 w-4" />}
      {children}
      {trailing && <trailing.Icon aria-hidden className={cn("h-4 w-4 transition-transform", trailing.nudge)} />}
    </a>
  );
}
