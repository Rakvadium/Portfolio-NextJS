"use client";
// DOM side of the masthead morph: measures the masthead pieces and the bar slots, then writes
// morphFrame (morph.ts) into motion values on every scroll. All of the math is in morph.ts.
//
// Re-measures on resize, orientation change, fonts ready, and masthead or bar resize. Masthead
// rects are stored in page coordinates, so a deep link or mid-page reload lands in the docked frame.
//
// While a measurement is live, the masthead gets `data-morphing` and a `--masthead-opacity` custom
// property, and its underline's opacity is written directly. app/motion.css turns those into: no
// reduced-motion preference, the masthead pieces are transparent and the bar draws flying copies;
// reduced motion, the copies are display:none and the masthead pieces fade out while the bar's
// identity fades in (a crossfade, no movement).
import { createRef, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { useMotionValue, type MotionValue } from "framer-motion";
import { DOCKED_FRAME, MORPH_PIECES, morphFrame, morphGeometry, type Box, type MorphGeometry, type MorphPiece } from "./morph";

type PieceValues = { x: MotionValue<number>; y: MotionValue<number>; scale: MotionValue<number> };

export type MastheadMorph = {
  bar: RefObject<HTMLElement | null>;
  slots: Record<MorphPiece, RefObject<HTMLElement | null>>;
  /** True while a masthead is on screen and measured: the bar shows the flying copies. */
  measured: boolean;
  barOpacity: MotionValue<number>;
  slotOpacity: MotionValue<number>;
  /** 0 ink -> 1 soft: the flying title's colour on its way to the bar's muted title. */
  progress: MotionValue<number>;
  pieces: Record<MorphPiece, PieceValues>;
};

function measureBox(el: Element, scrollY: number): Box {
  const r = el.getBoundingClientRect();
  return { x: r.left, y: r.top + scrollY, width: r.width, height: r.height, fontSize: parseFloat(getComputedStyle(el).fontSize) };
}

function usePieceValues(): PieceValues {
  return { x: useMotionValue(0), y: useMotionValue(0), scale: useMotionValue(1) };
}

export function useMastheadMorph(): MastheadMorph {
  const bar = useRef<HTMLElement>(null);
  const slots = useRef({ avatar: createRef<HTMLElement>(), name: createRef<HTMLElement>(), title: createRef<HTMLElement>() }).current;
  const [measured, setMeasured] = useState(false);
  const barOpacity = useMotionValue(0);
  const slotOpacity = useMotionValue(0);
  const progress = useMotionValue(0);
  const pieces = { avatar: usePieceValues(), name: usePieceValues(), title: usePieceValues() };
  const values = useRef({ barOpacity, slotOpacity, progress, pieces }).current;

  useLayoutEffect(() => {
    const masthead = document.querySelector<HTMLElement>("[data-masthead]");
    const underline = masthead?.querySelector<HTMLElement>("[data-masthead-underline]");
    let geometry: MorphGeometry | undefined;

    const apply = () => {
      if (!geometry) return;
      const frame = morphFrame(geometry, window.scrollY);
      values.progress.set(frame.progress);
      values.barOpacity.set(frame.barOpacity);
      values.slotOpacity.set(frame.slotOpacity);
      for (const key of MORPH_PIECES) {
        values.pieces[key].x.set(frame.pieces[key].x);
        values.pieces[key].y.set(frame.pieces[key].y);
        values.pieces[key].scale.set(frame.pieces[key].scale);
      }
      masthead?.style.setProperty("--masthead-opacity", String(frame.mastheadOpacity));
      if (underline) underline.style.opacity = String(frame.underlineOpacity);
    };

    const reset = () => {
      masthead?.removeAttribute("data-morphing");
      masthead?.style.removeProperty("--masthead-opacity");
      underline?.style.removeProperty("opacity");
    };
    const release = () => {
      geometry = undefined;
      reset();
      setMeasured(false);
    };

    const measure = () => {
      const barEl = bar.current;
      const pieceEls = masthead && MORPH_PIECES.map((k) => masthead.querySelector(`[data-morph-piece="${k}"]`));
      const slotEls = MORPH_PIECES.map((k) => slots[k].current);
      if (!barEl || !masthead || !pieceEls?.every(Boolean) || !slotEls.every(Boolean)) {
        // Nothing to morph from: the bar is simply docked.
        release();
        values.barOpacity.set(DOCKED_FRAME.barOpacity);
        values.slotOpacity.set(DOCKED_FRAME.slotOpacity);
        return;
      }
      if (getComputedStyle(masthead).display === "none") return release(); // lg+: the bar is hidden too
      const scrollY = window.scrollY;
      const box = (els: (Element | null)[], y: number) =>
        Object.fromEntries(MORPH_PIECES.map((k, i) => [k, measureBox(els[i]!, y)])) as Record<MorphPiece, Box>;
      geometry = morphGeometry(box(pieceEls, scrollY), box(slotEls, 0), barEl.getBoundingClientRect().bottom);
      masthead.setAttribute("data-morphing", "");
      setMeasured(true);
      apply();
    };

    measure();
    const resize = new ResizeObserver(measure);
    if (masthead) resize.observe(masthead);
    if (bar.current) resize.observe(bar.current);
    let alive = true;
    document.fonts?.ready.then(() => alive && measure());
    window.addEventListener("scroll", apply, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      alive = false;
      resize.disconnect();
      window.removeEventListener("scroll", apply);
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
      reset();
    };
  }, [values, slots]);

  return { bar, slots, measured, ...values };
}
