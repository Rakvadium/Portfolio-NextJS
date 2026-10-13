#!/usr/bin/env node
// Load timing in WebKit with an iPhone profile. Every iOS browser, Chrome included, renders with WebKit.
// Each variant injects CSS before first paint so a single cost can be switched off and attributed.
// Usage: node scripts/measure-webkit.mjs <url> [--runs 5] [--variants all|baseline] [--out file.json]

import { webkit, devices } from "playwright";
import { writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const url = args[0];
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const runs = Number(flag("runs", "5"));
const out = flag("out", null);
if (!url || url.startsWith("--")) {
  console.error("usage: node scripts/measure-webkit.mjs <url> [--runs 5] [--variants all|baseline] [--out file.json]");
  process.exit(2);
}

const VARIANTS = {
  baseline: "",
  "no-backdrop-filter": "*{-webkit-backdrop-filter:none!important;backdrop-filter:none!important}",
  "no-blur-filter": "*{filter:none!important}",
  "no-backdrop-blobs": ".pointer-events-none.fixed.inset-0 > div{filter:none!important}",
  "no-contact-glow": ".contact-glow{filter:none!important}",
  "no-backdrop": ".pointer-events-none.fixed.inset-0{display:none!important}",
  "no-dots": ".backdrop-dots{display:none!important}",
  "no-dots-mask": ".backdrop-dots{-webkit-mask-image:none!important;mask-image:none!important}",
  "no-glows": ".pointer-events-none.fixed.inset-0 > div:not(.backdrop-dots){display:none!important}",
  "no-glass": ".tile{-webkit-backdrop-filter:none!important;backdrop-filter:none!important}",
  "no-filters": "*{-webkit-backdrop-filter:none!important;backdrop-filter:none!important;filter:none!important}",
};
const chosen = flag("variants", "all") === "all" ? Object.keys(VARIANTS) : flag("variants").split(",");

const PROBE = (css) => `
window.__load = { frames: [] };
if (${JSON.stringify(css)}) {
  const style = document.createElement("style");
  style.textContent = ${JSON.stringify(css)};
  new MutationObserver((_, observer) => {
    if (!document.head) return;
    document.head.appendChild(style);
    observer.disconnect();
  }).observe(document, { childList: true, subtree: true });
}
let last = performance.now();
(function tick(now) {
  window.__load.frames.push(now - last);
  last = now;
  if (now < 6000) requestAnimationFrame(tick);
})(last);
`;

const COLLECT = `(() => {
  const nav = performance.getEntriesByType("navigation")[0];
  const fcp = performance.getEntriesByName("first-contentful-paint")[0];
  const frames = window.__load.frames.slice(1);
  return {
    fcp: fcp ? fcp.startTime : null,
    domContentLoaded: nav.domContentLoadedEventEnd,
    load: nav.loadEventEnd,
    longestFrame: Math.max(...frames),
    framesOver100ms: frames.filter((f) => f > 100).length,
    jankMs: frames.filter((f) => f > 50).reduce((s, f) => s + f, 0),
  };
})()`;

// Scrolls the full page at a fixed step per frame, the way a fast swipe does, and records frame gaps.
const SCROLL = `new Promise((resolve) => {
  const frames = [];
  let last = performance.now();
  const started = last;
  (function step(now) {
    frames.push(now - last);
    last = now;
    window.scrollBy(0, 60);
    if (window.scrollY + innerHeight < document.documentElement.scrollHeight - 1) requestAnimationFrame(step);
    else resolve({
      scrollMs: now - started,
      scrollLongestFrame: Math.max(...frames.slice(1)),
      scrollJankMs: frames.slice(1).filter((f) => f > 50).reduce((s, f) => s + f, 0),
    });
  })(last);
})`;

const median = (xs) => {
  const v = xs.filter((x) => x != null).sort((a, b) => a - b);
  const m = Math.floor(v.length / 2);
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
};

const browser = await webkit.launch();
const report = { url, runs, variants: {} };
try {
  for (const name of chosen) {
    const samples = [];
    for (let i = 0; i <= runs; i++) {
      const context = await browser.newContext({ ...devices["iPhone 13"] });
      const page = await context.newPage();
      await page.addInitScript(PROBE(VARIANTS[name]));
      const started = Date.now();
      await page.goto(url, { waitUntil: "load", timeout: 60000 });
      const wallToLoad = Date.now() - started;
      await page.waitForTimeout(6000);
      const r = { wallToLoad, ...(await page.evaluate(COLLECT)), ...(await page.evaluate(SCROLL)) };
      await context.close();
      if (i === 0) continue; // warm-up: primes DNS, TLS, and the edge cache
      samples.push(r);
      console.error(`${name} run ${i}: ${Object.entries(r).map(([k, v]) => `${k}=${Math.round(v)}`).join(" ")}`);
    }
    const keys = Object.keys(samples[0]);
    report.variants[name] = { median: Object.fromEntries(keys.map((k) => [k, Math.round(median(samples.map((s) => s[k])))])), samples };
  }
} finally {
  await browser.close();
}

console.log(JSON.stringify(Object.fromEntries(Object.entries(report.variants).map(([k, v]) => [k, v.median])), null, 2));
if (out) writeFileSync(out, JSON.stringify(report, null, 2));
