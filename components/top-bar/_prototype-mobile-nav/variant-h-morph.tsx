"use client";
// PROTOTYPE H · Morph. F's shell plus the hero masthead, with an iOS-large-title style shared-element
// morph: over the first stretch of scroll the masthead's avatar, name and title travel and shrink
// into their spots in the top bar, and the bar's glass fades in. Scrolling back reverses it exactly.
//
// How: the masthead's three pieces ([data-m] in components/hero/hero.tsx) stay in the page for
// layout and a11y but go transparent; fixed-position clones (aria-hidden) are drawn in the bar.
// Each clone interpolates between "where the masthead piece is right now" (its document rect minus
// scrollY) and its invisible slot in the bar, with p = scrollY / range. Both rects are re-measured
// on mount, resize, orientation change, font load, and masthead resize. Reduced motion: no clones;
// the masthead scrolls normally and the bar identity crossfades in.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { BAR_AVATAR, BAR_H, BAR_NAME, BAR_TITLE, IdentityShell } from "./identity-shell";
import type { MobileNavProps } from "./shared";

export const name = "Masthead morph";

type Key = "avatar" | "name" | "title";
const KEYS: readonly Key[] = ["avatar", "name", "title"];
type Box = { x: number; y: number; w: number; h: number; fs: number };
type Geo = { range: number; from: Record<Key, Box>; to: Record<Key, Box> };

const INK = [243, 237, 230];
const SOFT = [201, 197, 207];
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function box(el: Element, scrollY: number): Box {
  const r = el.getBoundingClientRect();
  return { x: r.left, y: r.top + scrollY, w: r.width, h: r.height, fs: parseFloat(getComputedStyle(el).fontSize) };
}

export function VariantH(props: MobileNavProps) {
  const { brand, portrait } = props;
  const reduce = usePrefersReducedMotion();
  const { scrollY } = useScroll();
  const slots = { avatar: useRef<HTMLSpanElement>(null), name: useRef<HTMLSpanElement>(null), title: useRef<HTMLSpanElement>(null) };
  const [geo, setGeo] = useState<Geo | null>(null);
  const geoRef = useRef<Geo | null>(null);

  const progress = useMotionValue(0);
  const barOpacity = useTransform(progress, [0.35, 1], [0, 1]);
  const slotOpacity = useTransform(progress, [0.5, 1], [0, 1]);
  const mv = {
    avatar: { x: useMotionValue(0), y: useMotionValue(0), scale: useMotionValue(1) },
    name: { x: useMotionValue(0), y: useMotionValue(0), scale: useMotionValue(1) },
    title: { x: useMotionValue(0), y: useMotionValue(0), scale: useMotionValue(1) },
  };
  const titleColor = useMotionValue(`rgb(${INK.join(" ")})`);

  const apply = useCallback(
    (sy: number) => {
      const g = geoRef.current;
      const p = g ? clamp01(sy / g.range) : clamp01(sy / 160);
      progress.set(p);
      const underline = document.querySelector<HTMLElement>("[data-proto-masthead] [data-m-underline]");
      if (underline) underline.style.opacity = String(clamp01(1 - p * 2.5));
      if (!g) return;
      // Staggered easing so the pieces never collide on the way up: the avatar shrinks and docks
      // early (ease-out), the text slides right early to clear it, but rises and shrinks later
      // (ease-in), riding the page like an iOS large title before it lifts into the bar.
      const early = 1 - Math.pow(1 - p, 3);
      const late = Math.pow(p, 1.6);
      for (const k of KEYS) {
        const a = g.from[k];
        const b = g.to[k];
        const end = k === "avatar" ? b.w / a.w : b.fs / a.fs;
        const t = k === "avatar" ? early : late;
        const scale = lerp(1, end, t);
        // Avatar: top-left to top-left. Text: line centres meet, so differing line-heights don't jump.
        const yEnd = k === "avatar" ? b.y : b.y + b.h / 2 - (a.h * end) / 2;
        mv[k].x.set(lerp(a.x, b.x, early));
        mv[k].y.set(lerp(a.y - sy, yEnd, t));
        mv[k].scale.set(scale);
      }
      titleColor.set(`rgb(${INK.map((c, i) => Math.round(lerp(c, SOFT[i], p))).join(" ")})`);
    },
    // Motion values are stable for the component's life.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const measure = useCallback(() => {
    const block = document.querySelector("[data-proto-masthead]");
    if (!block || getComputedStyle(block).display === "none") return;
    const sy = window.scrollY;
    const from = {} as Record<Key, Box>;
    const to = {} as Record<Key, Box>;
    for (const k of KEYS) {
      const el = block.querySelector(`[data-m="${k}"]`);
      const slot = slots[k].current;
      if (!el || !slot) return;
      from[k] = box(el, sy);
      to[k] = box(slot, 0); // the bar is fixed: viewport coords are its coords at any scroll
    }
    // Finish as the masthead's title line would slide under the bar.
    const range = Math.max(96, from.title.y + from.title.h - BAR_H);
    geoRef.current = { range, from, to };
    setGeo(geoRef.current);
    apply(sy);
    // slots holds refs only; stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apply]);

  useLayoutEffect(() => {
    measure();
    const block = document.querySelector("[data-proto-masthead]");
    const ro = new ResizeObserver(() => measure());
    if (block) ro.observe(block);
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    document.fonts?.ready.then(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, [measure]);

  useMotionValueEvent(scrollY, "change", apply);
  useEffect(
    () => () => void document.querySelector<HTMLElement>("[data-proto-masthead] [data-m-underline]")?.style.removeProperty("opacity"),
    [],
  );

  const morphing = Boolean(geo) && !reduce;

  return (
    <IdentityShell
      {...props}
      barOpacity={barOpacity}
      extraCss={morphing ? `@media (max-width: 1023.98px) { [data-proto-masthead] [data-m] { opacity: 0; } }` : ""}
      left={
        <>
          <a href="#home" aria-label={`${brand.name}, back to top`} className="flex min-w-0 items-center gap-2.5">
            {/* Slots: the morph's targets. Invisible while morphing; the reduced-motion crossfade otherwise. */}
            <motion.span ref={slots.avatar} style={{ opacity: morphing ? 0 : slotOpacity }} className={BAR_AVATAR}>
              <span className="relative block h-full w-full overflow-hidden rounded-[9px] bg-canvas">
                <Image src={portrait.src} alt="" fill sizes="32px" className="object-cover" />
              </span>
            </motion.span>
            <motion.span style={{ opacity: morphing ? 0 : slotOpacity }} className="flex min-w-0 flex-col">
              <span ref={slots.name} className={BAR_NAME}>
                {brand.name}
              </span>
              <span ref={slots.title} className={BAR_TITLE}>
                {brand.title}
              </span>
            </motion.span>
          </a>
          {morphing && (
            <div aria-hidden className="pointer-events-none fixed left-0 top-0">
              <motion.div
                style={{ ...mv.avatar, transformOrigin: "0 0" }}
                className="absolute left-0 top-0 h-20 w-20 rounded-[24px] bg-[linear-gradient(135deg,var(--color-amber),var(--color-coral)_50%,var(--color-magenta))] p-[2px] will-change-transform"
              >
                <div className="relative h-full w-full overflow-hidden rounded-[22px] bg-canvas">
                  <Image src={portrait.src} alt="" fill sizes="80px" className="object-cover" />
                </div>
              </motion.div>
              <motion.span
                style={{ ...mv.name, transformOrigin: "0 0" }}
                className="absolute left-0 top-0 inline-block whitespace-nowrap font-display text-[44px] font-extrabold leading-[0.95] tracking-[-0.035em] text-ink will-change-transform"
              >
                {brand.name}
              </motion.span>
              <motion.span
                style={{ ...mv.title, color: titleColor, transformOrigin: "0 0" }}
                className="absolute left-0 top-0 inline-block whitespace-nowrap text-lg font-semibold tracking-tight will-change-transform"
              >
                {brand.title}
              </motion.span>
            </div>
          )}
        </>
      }
    />
  );
}

/** Read after mount (not during render), so server and first client render agree. */
function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduce;
}
