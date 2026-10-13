// Pure: the masthead -> top bar shared-element morph on phones. No DOM, no React. Given where the
// masthead's avatar, name and title sit on the page, where their slots sit in the fixed bar, and the
// scroll position, it returns every piece's transform and the bar's fades. The hook
// (use-masthead-morph.ts) only measures and applies.

export const MORPH_PIECES = ["avatar", "name", "title"] as const;
export type MorphPiece = (typeof MORPH_PIECES)[number];

/** A measured element: its border box and computed font size (px). */
export type Box = { readonly x: number; readonly y: number; readonly width: number; readonly height: number; readonly fontSize: number };

export type MorphGeometry = {
  /** Scroll distance (px) over which the morph runs. */
  readonly range: number;
  /** Masthead pieces in page coordinates (viewport rect + scrollY at measure time). */
  readonly from: Readonly<Record<MorphPiece, Box>>;
  /** Bar slots in viewport coordinates (the bar is fixed, so they hold at every scroll position). */
  readonly to: Readonly<Record<MorphPiece, Box>>;
};

/** Translate in viewport px, scale about the top-left corner. */
export type PieceTransform = { readonly x: number; readonly y: number; readonly scale: number };

export type MorphFrame = {
  /** 0 at the top of the page, 1 once scrollY reaches the range. */
  readonly progress: number;
  readonly barOpacity: number;
  /** The bar's own identity copy; only shown when the flying copies are not (reduced motion). */
  readonly slotOpacity: number;
  /** The masthead's own pieces; only applied under reduced motion, where they fade instead of flying. */
  readonly mastheadOpacity: number;
  readonly underlineOpacity: number;
  readonly pieces: Readonly<Record<MorphPiece, PieceTransform>>;
};

/** Shortest morph, for a masthead that sits almost under the bar. */
export const MIN_RANGE = 96;
/** Progress windows for the bar glass and the reduced-motion crossfade of the bar identity. */
const BAR_FADE = [0.35, 1] as const;
const SLOT_FADE = [0.5, 1] as const;
/** Reduced motion: the masthead identity fades out ahead of the bar identity fading in. */
const MASTHEAD_FADE = [0.25, 0.75] as const;
/** The underline under the masthead title is gone by 40% progress. */
const UNDERLINE_FADE_RATE = 2.5;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const window01 = (p: number, [start, end]: readonly [number, number]) => clamp01((p - start) / (end - start));

/**
 * The morph ends as the masthead's title line would slide under the bar: from scrollY 0 to
 * (title bottom on the page - bar bottom), never shorter than MIN_RANGE.
 */
export function morphGeometry(from: MorphGeometry["from"], to: MorphGeometry["to"], barBottom: number): MorphGeometry {
  return { range: Math.max(MIN_RANGE, from.title.y + from.title.height - barBottom), from, to };
}

/**
 * The frame for one scroll position. Pure in scrollY, so scrolling back up replays it exactly.
 *
 * Staggered so the pieces never collide: the avatar shrinks and docks early (ease-out cubic), the
 * text slides right early (same curve) to clear it but rises and shrinks late (p^1.6), riding the
 * page like an iOS large title before it lifts into the bar. Text lines meet centre to centre, so
 * differing line heights do not jump; the avatar meets top-left to top-left.
 */
export function morphFrame(geometry: MorphGeometry, scrollY: number): MorphFrame {
  const progress = clamp01(scrollY / geometry.range);
  const early = 1 - Math.pow(1 - progress, 3);
  const late = Math.pow(progress, 1.6);

  const piece = (key: MorphPiece): PieceTransform => {
    const a = geometry.from[key];
    const b = geometry.to[key];
    if (key === "avatar") {
      return { x: lerp(a.x, b.x, early), y: lerp(a.y - scrollY, b.y, early), scale: lerp(1, b.width / a.width, early) };
    }
    const end = b.fontSize / a.fontSize;
    const yEnd = b.y + b.height / 2 - (a.height * end) / 2;
    return { x: lerp(a.x, b.x, early), y: lerp(a.y - scrollY, yEnd, late), scale: lerp(1, end, late) };
  };

  return {
    progress,
    barOpacity: window01(progress, BAR_FADE),
    slotOpacity: window01(progress, SLOT_FADE),
    mastheadOpacity: 1 - window01(progress, MASTHEAD_FADE),
    underlineOpacity: clamp01(1 - progress * UNDERLINE_FADE_RATE),
    pieces: { avatar: piece("avatar"), name: piece("name"), title: piece("title") },
  };
}

/** The bar with nothing to morph from (no masthead on the page): fully docked. */
export const DOCKED_FRAME = { barOpacity: 1, slotOpacity: 1 } as const;
