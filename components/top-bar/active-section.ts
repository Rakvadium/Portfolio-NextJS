export type SectionBox = { readonly id: string; readonly top: number };
type ScrollViewport = { readonly height: number; readonly scrollY: number; readonly scrollHeight: number };

export function pickActiveSection(boxes: readonly SectionBox[], viewport: ScrollViewport, lineRatio = 0.35): string | undefined {
  if (viewport.height + viewport.scrollY >= viewport.scrollHeight - 4) return boxes.at(-1)?.id;
  const line = viewport.height * lineRatio;
  let current = boxes[0]?.id;
  for (const box of boxes) if (box.top <= line) current = box.id;
  return current;
}
