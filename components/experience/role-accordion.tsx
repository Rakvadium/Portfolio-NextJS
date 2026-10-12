"use client";
// Below-lg role accordion: one role open at a time, the newest open first. Layout and behavior only:
// the summary and body are server-rendered slots (experience.tsx).
//
// framer's height collapse (not native <details name> + interpolate-size, which only Chromium
// animates). Under reduced motion the toggle is instant: the preference is read in the click handler,
// never during render, so server and client render the same markup.
import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { NonEmpty } from "@/lib/non-empty";
import { Tile } from "@/components/ui/tile";
import { cn } from "@/lib/utils";

export type AccordionItem = {
  readonly id: string;
  readonly summary: ReactNode;
  readonly body: ReactNode;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function RoleAccordion({ items }: { items: NonEmpty<AccordionItem> }) {
  const [open, setOpen] = useState<number | null>(0);
  const [instant, setInstant] = useState(false);
  const uid = useId();

  const toggle = (i: number) => {
    setInstant(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setOpen((current) => (current === i ? null : i));
  };

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        const bodyId = `${uid}-${item.id}`;
        return (
          <Tile key={item.id} as="li" glow={i % 2 ? "magenta" : "amber"} motion="reveal">
            <h3>
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                aria-controls={bodyId}
                className="group flex w-full items-start gap-3 p-5 text-left"
              >
                <span className="min-w-0 flex-1">{item.summary}</span>
                <ChevronDown
                  aria-hidden
                  className={cn("mt-1 h-5 w-5 shrink-0 text-soft transition-transform duration-300", isOpen && "rotate-180")}
                />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={bodyId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={instant ? { duration: 0 } : { duration: 0.3, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-white/[0.08] px-5 pb-5 pt-4">{item.body}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </Tile>
        );
      })}
    </ul>
  );
}
