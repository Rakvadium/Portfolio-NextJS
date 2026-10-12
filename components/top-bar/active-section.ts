// Pure: which section is "current" for a given layout. No DOM, no React; the only place the
// 35%-line rule lives.
export type SectionBox = { readonly id: string; readonly top: number };
type ScrollViewport = { readonly height: number; readonly scrollY: number; readonly scrollHeight: number };

/**
 * The last section whose top is at or above `lineRatio * viewport.height`, falling back to the first;
 * forced to the last section when scrolled to the bottom (within 4px), so a short final section
 * (Contact) still activates.
 */
export function pickActiveSection(boxes: readonly SectionBox[], viewport: ScrollViewport, lineRatio = 0.35): string | undefined {
  if (viewport.height + viewport.scrollY >= viewport.scrollHeight - 4) return boxes.at(-1)?.id;
  const line = viewport.height * lineRatio;
  let current = boxes[0]?.id;
  for (const box of boxes) if (box.top <= line) current = box.id;
  return current;
}
