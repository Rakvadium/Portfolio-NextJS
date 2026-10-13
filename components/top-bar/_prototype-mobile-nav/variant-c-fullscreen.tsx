"use client";
// PROTOTYPE C · Full-screen menu. A minimal bar that blends into the canvas until scrolled: brand
// left, socials + a menu button right. The button morphs into a close X and opens a full-screen
// overlay with big numbered section links, then the contact channels large at the bottom.
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { channelIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { ScrollProgress } from "../scroll-motion";
import { SocialLinks } from "../social-links";
import { MobileBrand, MobileScrollPadding, useActive, useScrolledPast, type MobileNavProps } from "./shared";

export const name = "Full-screen menu";

const EASE = [0.22, 1, 0.36, 1] as const;

export function VariantC({ brand, sections, social }: MobileNavProps) {
  const { active } = useActive(sections);
  const scrolled = useScrolledPast(8);
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const email = social.find((c) => c.kind === "email");
  const others = social.filter((c) => c.kind !== "email");

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    firstLink.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <MotionConfig reducedMotion="user">
      <MobileScrollPadding top="4.75rem" />
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[70] border-b transition-[background-color,border-color] duration-300",
          scrolled && !open ? "border-white/[0.07] bg-canvas/75 backdrop-blur-xl" : "border-transparent",
        )}
      >
        <div className="flex h-16 items-center justify-between gap-3 px-4">
          <MobileBrand brand={brand} nameOnly />
          <div className="flex items-center gap-3">
            <motion.div animate={{ opacity: open ? 0 : 1, x: open ? 8 : 0 }} transition={{ duration: 0.2 }} className={cn(open && "pointer-events-none")}>
              <SocialLinks channels={social} />
            </motion.div>
            <span aria-hidden className={cn("h-6 w-px bg-white/12 transition-opacity", open && "opacity-0")} />
            <button
              ref={button}
              type="button"
              aria-expanded={open}
              aria-controls="proto-fullscreen-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
              className={cn(
                "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
                open ? "bg-white/[0.1] text-white" : "bg-ink text-canvas",
              )}
            >
              <motion.span
                aria-hidden
                className="absolute h-[2px] w-[16px] rounded-full bg-current"
                animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -3.5 }}
                transition={{ type: "spring", stiffness: 480, damping: 30 }}
              />
              <motion.span
                aria-hidden
                className="absolute h-[2px] w-[16px] rounded-full bg-current"
                animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 3.5 }}
                transition={{ type: "spring", stiffness: 480, damping: 30 }}
              />
            </button>
          </div>
        </div>
        {!open && <ScrollProgress />}
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="proto-fullscreen-menu"
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-canvas/[0.97] backdrop-blur-2xl"
          >
            <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full contact-glow opacity-80" />
            <div aria-hidden className="pointer-events-none absolute inset-0 backdrop-dots" />
            <nav aria-label="Sections" className="relative px-6 pt-24">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.05 } }}
                className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-soft"
              >
                Menu
              </motion.p>
              <ul className="flex flex-col">
                {sections.map((s, i) => {
                  const isActive = s.id === active;
                  return (
                    <motion.li
                      key={s.id}
                      initial={{ opacity: 0, y: 28 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: 0.06 + i * 0.05, duration: 0.5, ease: EASE } }}
                      exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
                      className="border-b border-white/[0.07]"
                    >
                      <a
                        ref={i === 0 ? firstLink : undefined}
                        href={s.href}
                        aria-current={isActive ? "true" : undefined}
                        onClick={() => setOpen(false)}
                        className="group flex items-baseline gap-4 py-3"
                      >
                        <span className={cn("w-6 font-mono text-xs tabular-nums", isActive ? "text-coral" : "text-soft/70")}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={cn(
                            "font-display text-[42px] font-bold leading-[1.05] tracking-[-0.03em]",
                            isActive ? "text-brand" : "text-ink",
                          )}
                        >
                          {s.label}
                        </span>
                        {isActive && <span aria-hidden className="bg-brand ml-auto h-2 w-2 self-center rounded-full" />}
                      </a>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.35, duration: 0.5, ease: EASE } }}
              className="relative mt-auto px-6 pt-10"
              style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 28px)" }}
            >
              {email && (
                <a href={email.href} className="group mb-4 flex items-center justify-between gap-3 rounded-[22px] border border-white/10 bg-white/[0.04] px-5 py-4">
                  <span className="min-w-0">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-soft">Email</span>
                    <span className="mt-1 block truncate font-display text-[19px] font-semibold tracking-tight text-ink">{email.display}</span>
                  </span>
                  <span className="bg-brand flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-canvas">
                    <ArrowUpRight aria-hidden className="h-5 w-5" />
                  </span>
                </a>
              )}
              <div className="grid grid-cols-2 gap-3">
                {others.map((c) => {
                  const Icon = channelIcon[c.kind];
                  return (
                    <a
                      key={c.kind}
                      href={c.href}
                      target={c.external ? "_blank" : undefined}
                      rel={c.external ? "noopener noreferrer" : undefined}
                      className="flex h-14 items-center justify-center gap-2.5 rounded-[18px] border border-white/10 bg-white/[0.04] text-[15px] font-semibold text-chip"
                    >
                      <Icon aria-hidden className="h-5 w-5" />
                      {c.label}
                    </a>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
