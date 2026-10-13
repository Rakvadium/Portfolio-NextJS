"use client";
// Desktop two-pane explorer: a vertical tablist and the selected role's panel. Layout and behavior
// only: the tab and panel content are server-rendered slots (experience.tsx), so this imports no data.
//
// Selection starts at 0 on server and client, so SSR shows the newest role and hydration matches.
// Only the selected panel is in the DOM; the accordion (lg:hidden) carries every role for small screens.
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { NonEmpty } from "@/lib/non-empty";
import { Tile } from "@/components/ui/tile";

export type ExplorerItem = {
  /** Stable key; also the DOM id stem for the tab. */
  readonly id: string;
  readonly tab: ReactNode;
  readonly panel: ReactNode;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function RoleExplorer({ items }: { items: NonEmpty<ExplorerItem> }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();
  const n = items.length;
  const panelId = `${uid}-panel`;
  const tabId = (i: number) => `${uid}-tab-${items[i].id}`;

  const select = (i: number, focus: boolean) => {
    setActive(i);
    if (focus) tabs.current[i]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const target = { ArrowDown: (i + 1) % n, ArrowUp: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
    if (target === undefined) return;
    e.preventDefault();
    select(target, true);
  };

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup id={uid}>
        <div className="grid grid-cols-12 gap-4">
          <Tile glow="amber" motion="reveal" className="col-span-4 self-start">
            <div role="tablist" aria-orientation="vertical" aria-label="Roles, newest first" className="relative p-3">
              <span aria-hidden className="absolute bottom-8 left-[27px] top-8 w-px bg-white/10" />
              {items.map((item, i) => {
                const selected = i === active;
                return (
                  <button
                    key={item.id}
                    ref={(el) => {
                      tabs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={tabId(i)}
                    aria-selected={selected}
                    aria-controls={panelId}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => select(i, false)}
                    onKeyDown={(e) => onKeyDown(e, i)}
                    className="group relative flex w-full items-start gap-4 rounded-2xl px-3 py-3.5 text-left"
                  >
                    {selected && (
                      <motion.span
                        layoutId="role-active"
                        aria-hidden
                        className="absolute inset-0 rounded-2xl border border-white/12 bg-white/[0.07]"
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      />
                    )}
                    <span
                      aria-hidden
                      className="relative mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full border border-white/30 bg-canvas transition-all group-aria-selected:border-transparent group-aria-selected:bg-brand group-aria-selected:shadow-[0_0_14px_rgb(255_106_85/0.7)]"
                    />
                    {item.tab}
                  </button>
                );
              })}
            </div>
          </Tile>

          <Tile glow="coral" motion="reveal" className="col-span-8">
            <div role="tabpanel" id={panelId} aria-labelledby={tabId(active)} className="flex min-h-[440px] flex-col p-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={items[active].id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="flex-1"
                >
                  {items[active].panel}
                </motion.div>
              </AnimatePresence>
              <div className="mt-8 flex items-center justify-between border-t border-white/[0.08] pt-5">
                <span className="text-sm text-soft">
                  Role {active + 1} of {n}, newest first
                </span>
                <div className="flex gap-2">
                  <StepButton onClick={() => select(active - 1, false)} disabled={active === 0} className="pl-2.5 pr-3.5">
                    <ChevronLeft aria-hidden className="h-4 w-4" /> Newer
                  </StepButton>
                  <StepButton onClick={() => select(active + 1, false)} disabled={active === n - 1} className="pl-3.5 pr-2.5">
                    Older <ChevronRight aria-hidden className="h-4 w-4" />
                  </StepButton>
                </div>
              </div>
            </div>
          </Tile>
        </div>
      </LayoutGroup>
    </MotionConfig>
  );
}

function StepButton({
  onClick,
  disabled,
  className,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  className: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-9 items-center gap-1 rounded-full border border-white/12 bg-white/[0.05] text-sm text-white transition hover:bg-white/10 disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}
