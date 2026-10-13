
export const MORPH_PIECES = ["avatar", "name", "title"] as const;
export type MorphPiece = (typeof MORPH_PIECES)[number];

export const MORPH_DOM = {
  masthead: "data-masthead",
  underline: "data-masthead-underline",
  morphing: "data-morphing",
  piece: "data-morph-piece",
  opacity: "--masthead-opacity",
} as const;

export type Box = { readonly x: number; readonly y: number; readonly width: number; readonly height: number; readonly fontSize: number };

export type MorphGeometry = {
  readonly range: number;
  readonly from: Readonly<Record<MorphPiece, Box>>;
  readonly to: Readonly<Record<MorphPiece, Box>>;
};

export type PieceTransform = { readonly x: number; readonly y: number; readonly scale: number };

export type MorphFrame = {
  readonly progress: number;
  readonly barOpacity: number;
  readonly slotOpacity: number;
  readonly mastheadOpacity: number;
  readonly underlineOpacity: number;
  readonly pieces: Readonly<Record<MorphPiece, PieceTransform>>;
};

const MIN_RANGE = 96;
const BAR_FADE = [0.35, 1] as const;
const SLOT_FADE = [0.5, 1] as const;
const MASTHEAD_FADE = [0.25, 0.75] as const;
const UNDERLINE_FADE_RATE = 2.5;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const window01 = (p: number, [start, end]: readonly [number, number]) => clamp01((p - start) / (end - start));

export function morphGeometry(from: MorphGeometry["from"], to: MorphGeometry["to"], barBottom: number): MorphGeometry {
  return { range: Math.max(MIN_RANGE, from.title.y + from.title.height - barBottom), from, to };
}

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

export const DOCKED_FRAME = { barOpacity: 1, slotOpacity: 1 } as const;
