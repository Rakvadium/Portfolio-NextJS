#!/usr/bin/env node
// Pixel-compares two directories of screenshots with the same file names, decoding them in headless Chromium.
// Reports, per file, the largest per-channel difference (0-255), the mean difference, and the share of pixels off by more than 8.
// Usage: node scripts/diff-shots.mjs <before-dir> <after-dir>

import { chromium } from "playwright";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const [before, after] = process.argv.slice(2);
const walk = (dir) => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));
const files = walk(before).filter((f) => f.endsWith(".png")).map((f) => relative(before, f));

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage();
for (const file of files) {
  const a = readFileSync(join(before, file)).toString("base64");
  const b = readFileSync(join(after, file)).toString("base64");
  const r = await page.evaluate(
    async ([a, b]) => {
      const load = async (src) => {
        const img = new Image();
        img.src = `data:image/png;base64,${src}`;
        await img.decode();
        const c = new OffscreenCanvas(img.width, img.height);
        const ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0);
        return ctx.getImageData(0, 0, img.width, img.height);
      };
      const [x, y] = await Promise.all([load(a), load(b)]);
      if (x.width !== y.width || x.height !== y.height) return { sizeMismatch: `${x.width}x${x.height} vs ${y.width}x${y.height}` };
      let max = 0, sum = 0, over = 0;
      for (let i = 0; i < x.data.length; i += 4) {
        const d = Math.max(Math.abs(x.data[i] - y.data[i]), Math.abs(x.data[i + 1] - y.data[i + 1]), Math.abs(x.data[i + 2] - y.data[i + 2]));
        max = Math.max(max, d);
        sum += d;
        if (d > 8) over++;
      }
      const px = x.data.length / 4;
      return { max, mean: +(sum / px).toFixed(3), pctOver8: +((over / px) * 100).toFixed(3) };
    },
    [a, b],
  );
  console.log(file.padEnd(36), JSON.stringify(r));
}
await browser.close();
