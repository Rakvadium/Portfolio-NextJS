#!/usr/bin/env node
// Prints radial-gradient stops that reproduce a radial alpha profile under CSS blur(<blur>px), so a glow can be
// painted as a plain gradient instead of a filter. The profile is piecewise linear, given as radius:alpha points
// (alpha in percent); a solid disc of radius 310 is `310`. The output spans 3 sigma past the profile, where the
// blur falls below 1% of its peak, and gives alpha (percent) at 0, 1/8 ... 7/8 of that radius.
// Usage: node scripts/glow-stops.mjs <blur> <disc radius | r:alpha ...>

const [blurArg, ...points] = process.argv.slice(2);
const sigma = Number(blurArg);
const profile =
  points.length === 1 && !points[0].includes(":")
    ? [[0, 100], [Number(points[0]), 100], [Number(points[0]) + 1e-6, 0]]
    : points.map((p) => p.split(":").map(Number));
const outer = profile.at(-1)[0];
const extent = outer + 3 * sigma;
const step = 2;

function alphaAt(rho) {
  if (rho >= outer) return 0;
  const i = profile.findIndex(([r]) => r > rho);
  const [r0, a0] = profile[i - 1];
  const [r1, a1] = profile[i];
  return a0 + ((a1 - a0) * (rho - r0)) / (r1 - r0);
}

function blurredAt(r) {
  let sum = 0;
  for (let x = -outer; x <= outer; x += step) {
    for (let y = -outer; y <= outer; y += step) {
      const a = alphaAt(Math.hypot(x, y));
      if (!a) continue;
      const dx = r - x;
      sum += a * Math.exp(-(dx * dx + y * y) / (2 * sigma * sigma));
    }
  }
  return (sum * step * step) / (2 * Math.PI * sigma * sigma);
}

const stops = Array.from({ length: 8 }, (_, i) => +blurredAt((i / 8) * extent).toFixed(2));
console.log(JSON.stringify({ boxSize: Math.round(2 * extent), reach: +(extent - outer).toFixed(1), stops }));
