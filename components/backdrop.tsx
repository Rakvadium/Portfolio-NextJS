import type { CSSProperties } from "react";

type Glow = { color: "amber" | "coral" | "magenta"; profile: number[]; box: CSSProperties };

// Each glow is a radial gradient shaped like a 10%-alpha disc under CSS blur(), so WebKit never runs a
// full-viewport blur pass. On iPhones that pass stalled painting for seconds. Profiles come from
// `node scripts/glow-stops.mjs <blur> <disc radius>`: percent of the disc's alpha at 0, 1/8 ... 7/8 of the radius.
const GLOWS: Glow[] = [
  // 620px disc, blur(140px)
  { color: "amber", profile: [91.4, 86.8, 72.6, 50.3, 27.2, 10.8, 3.1, 0.6], box: { left: -612, top: -612, width: 1460, height: 1460 } },
  // 560px disc, blur(150px)
  { color: "coral", profile: [82.5, 76.9, 61.3, 40.3, 20.9, 8.2, 2.4, 0.5], box: { right: -642, top: "calc(25% - 450px)", width: 1460, height: 1460 } },
  // 520px disc, blur(160px)
  { color: "magenta", profile: [73.3, 67.6, 52.4, 33.3, 16.9, 6.6, 2.0, 0.4], box: { bottom: -736, left: "calc(100% / 3 - 480px)", width: 1480, height: 1480 } },
];

function gradient({ color, profile }: Glow) {
  const stops = profile.map((p, i) => `color-mix(in oklab, var(--color-${color}) ${p / 10}%, transparent) ${(i * 100) / profile.length}%`);
  return `radial-gradient(closest-side, ${stops.join(", ")}, transparent)`;
}

export function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {GLOWS.map((glow) => (
        <div key={glow.color} className="absolute" style={{ ...glow.box, background: gradient(glow) }} />
      ))}
      <div className="backdrop-dots absolute inset-0 opacity-60" />
    </div>
  );
}
