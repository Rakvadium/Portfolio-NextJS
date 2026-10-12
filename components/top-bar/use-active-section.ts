"use client";
import { useEffect, useState } from "react";
import { pickActiveSection, type SectionBox } from "./active-section";

/**
 * The current section id. Starts at ids[0] on server and client alike (no hydration mismatch); the
 * first effect run corrects it (e.g. after a deep link to #projects). rAF-throttled scroll + resize
 * listeners. Ids missing from the document are skipped.
 */
export function useActiveSection<Id extends string>(ids: readonly [Id, ...Id[]]): Id {
  const [active, setActive] = useState<Id>(ids[0]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const boxes: SectionBox[] = [];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) boxes.push({ id, top: el.getBoundingClientRect().top });
      }
      const next = pickActiveSection(boxes, {
        height: window.innerHeight,
        scrollY: window.scrollY,
        scrollHeight: document.documentElement.scrollHeight,
      });
      if (next) setActive(next as Id);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [ids]);

  return active;
}
