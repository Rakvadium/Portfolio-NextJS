#!/usr/bin/env node
// Cold-load timing for the portfolio homepage in headless Chrome over CDP.
// Usage: node scripts/measure-load.mjs <url> [--runs 5] [--profile phone|phone-slow|desktop] [--out file.json] [--cold]

import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const args = process.argv.slice(2);
const url = args.find((a) => !a.startsWith("--") && !args[args.indexOf(a) - 1]?.startsWith("--"));
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const runs = Number(flag("runs", "5"));
const profileName = flag("profile", "phone");
const out = flag("out", null);
if (!url) {
  console.error("usage: node scripts/measure-load.mjs <url> [--runs 5] [--profile phone|phone-slow|desktop] [--out file.json] [--cold]");
  process.exit(2);
}

// phone matches Lighthouse's mobile preset: Slow 4G (150ms RTT, 1.6 Mbps down) and 4x CPU slowdown.
const PROFILES = {
  phone: {
    viewport: { width: 390, height: 844, deviceScaleFactor: 3, mobile: true },
    network: { latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 },
    cpu: 4,
  },
  // Chrome DevTools "Slow 4G" preset (562.5ms RTT, 1.44 Mbps down), closer to a phone on a weak cell signal.
  "phone-slow": {
    viewport: { width: 390, height: 844, deviceScaleFactor: 3, mobile: true },
    network: { latency: 562.5, downloadThroughput: (1.6 * 1024 * 1024 * 0.9) / 8, uploadThroughput: (750 * 1024 * 0.9) / 8 },
    cpu: 4,
  },
  desktop: {
    viewport: { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false },
    network: null,
    cpu: 1,
  },
};
const profile = PROFILES[profileName];
if (!profile) throw new Error(`unknown profile ${profileName}`);

const CHROME_CANDIDATES = [
  process.env.PORTFOLIO_VERIFY_CHROME,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  process.env.LOCALAPPDATA && join(process.env.LOCALAPPDATA, "Google/Chrome/Application/chrome.exe"),
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);
const chromePath = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chromePath) throw new Error("Chrome not found; set PORTFOLIO_VERIFY_CHROME");

const PROBE = `
window.__load = { tbt: 0, longTasks: 0, lastLongTaskEnd: 0 };
new PerformanceObserver((list) => {
  for (const e of list.getEntries()) {
    window.__load.tbt += Math.max(0, e.duration - 50);
    window.__load.longTasks += 1;
    window.__load.lastLongTaskEnd = e.startTime + e.duration;
  }
}).observe({ type: "longtask", buffered: true });
new PerformanceObserver((list) => {
  for (const e of list.getEntries()) window.__load.lcp = e.startTime;
}).observe({ type: "largest-contentful-paint", buffered: true });
(function poll() {
  const m = window.__load;
  const h1 = document.querySelector("h1");
  if (h1 && m.heroVisible === undefined && parseFloat(getComputedStyle(h1).opacity) >= 0.99) m.heroVisible = performance.now();
  const button = document.querySelector("button");
  if (button && m.hydrated === undefined && Object.keys(button).some((k) => k.startsWith("__reactFiber"))) m.hydrated = performance.now();
  if (m.heroVisible === undefined || m.hydrated === undefined) requestAnimationFrame(poll);
})();
`;

const COLLECT = `(() => {
  const nav = performance.getEntriesByType("navigation")[0];
  const fcp = performance.getEntriesByName("first-contentful-paint")[0];
  const resources = performance.getEntriesByType("resource").map((r) => ({
    name: r.name.replace(location.origin, ""),
    type: r.initiatorType,
    bytes: r.transferSize,
    end: Math.round(r.responseEnd),
  }));
  return {
    ttfb: nav.responseStart,
    fcp: fcp ? fcp.startTime : null,
    lcp: window.__load.lcp ?? null,
    heroVisible: window.__load.heroVisible ?? null,
    hydrated: window.__load.hydrated ?? null,
    tbt: window.__load.tbt,
    longTasks: window.__load.longTasks,
    lastLongTaskEnd: window.__load.lastLongTaskEnd,
    domContentLoaded: nav.domContentLoadedEventEnd,
    load: nav.loadEventEnd,
    htmlBytes: nav.transferSize,
    totalBytes: nav.transferSize + resources.reduce((s, r) => s + r.bytes, 0),
    jsBytes: resources.filter((r) => r.name.endsWith(".js")).reduce((s, r) => s + r.bytes, 0),
    imageBytes: resources.filter((r) => r.type === "img" || /_next\\/image|\\.(png|jpe?g|webp|avif)/.test(r.name)).reduce((s, r) => s + r.bytes, 0),
    resources,
  };
})()`;

function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let nextId = 1;
  const pending = new Map();
  const listeners = new Map();
  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
    } else if (msg.method) {
      for (const fn of listeners.get(`${msg.sessionId ?? ""}:${msg.method}`) ?? []) fn(msg.params);
    }
  });
  return new Promise((resolve) =>
    ws.addEventListener("open", () =>
      resolve({
        send: (method, params = {}, sessionId) =>
          new Promise((res, rej) => {
            const id = nextId++;
            pending.set(id, { resolve: res, reject: rej });
            ws.send(JSON.stringify({ id, method, params, sessionId }));
          }),
        once: (sessionId, method, timeoutMs) =>
          new Promise((res, rej) => {
            const key = `${sessionId}:${method}`;
            const timer = setTimeout(() => rej(new Error(`timeout waiting for ${method}`)), timeoutMs);
            const fn = (p) => {
              clearTimeout(timer);
              listeners.set(key, (listeners.get(key) ?? []).filter((f) => f !== fn));
              res(p);
            };
            listeners.set(key, [...(listeners.get(key) ?? []), fn]);
          }),
        close: () => ws.close(),
      }),
    ),
  );
}

async function launchChrome() {
  const userDataDir = mkdtempSync(join(tmpdir(), "measure-load-"));
  const proc = spawn(chromePath, [
    "--headless=new",
    "--remote-debugging-port=0",
    `--user-data-dir=${userDataDir}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-extensions",
    "--disable-background-networking",
    "about:blank",
  ]);
  const wsUrl = await new Promise((resolve, reject) => {
    let buf = "";
    proc.stderr.on("data", (d) => {
      buf += d;
      const m = buf.match(/DevTools listening on (ws:\/\/\S+)/);
      if (m) resolve(m[1]);
    });
    proc.on("exit", () => reject(new Error(`chrome exited: ${buf}`)));
  });
  return {
    wsUrl,
    stop: () => {
      proc.kill();
      setTimeout(() => rmSync(userDataDir, { recursive: true, force: true }), 500);
    },
  };
}

async function measureOnce(cdp) {
  const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await cdp.send("Target.attachToTarget", { targetId, flatten: true });
  const s = (method, params) => cdp.send(method, params, sessionId);
  await s("Page.enable");
  await s("Network.enable");
  await s("Network.clearBrowserCache");
  await s("Network.setCacheDisabled", { cacheDisabled: true });
  if (profile.network) await s("Network.emulateNetworkConditions", { offline: false, ...profile.network });
  await s("Emulation.setCPUThrottlingRate", { rate: profile.cpu });
  await s("Emulation.setDeviceMetricsOverride", profile.viewport);
  await s("Page.addScriptToEvaluateOnNewDocument", { source: PROBE });

  const loaded = cdp.once(sessionId, "Page.loadEventFired", 60000);
  await s("Page.navigate", { url });
  await loaded;
  const deadline = Date.now() + 30000;
  for (;;) {
    const { result } = await s("Runtime.evaluate", {
      expression: "window.__load.heroVisible !== undefined && window.__load.hydrated !== undefined",
      returnByValue: true,
    });
    if (result.value || Date.now() > deadline) break;
    await new Promise((r) => setTimeout(r, 100));
  }
  await new Promise((r) => setTimeout(r, 3000));
  const { result } = await s("Runtime.evaluate", { expression: COLLECT, returnByValue: true });
  await cdp.send("Target.closeTarget", { targetId });
  return result.value;
}

const median = (xs) => {
  const v = xs.filter((x) => x != null).sort((a, b) => a - b);
  if (!v.length) return null;
  const m = Math.floor(v.length / 2);
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
};

const chrome = await launchChrome();
const cdp = await connect(chrome.wsUrl);
const samples = [];
try {
  if (!args.includes("--cold")) await measureOnce(cdp); // warm-up: primes the server, DNS, and TLS so samples differ only in page cost
  for (let i = 0; i < runs; i++) {
    const r = await measureOnce(cdp);
    samples.push(r);
    console.error(
      `run ${i + 1}: fcp=${Math.round(r.fcp)} heroVisible=${Math.round(r.heroVisible)} lcp=${Math.round(r.lcp)} hydrated=${Math.round(r.hydrated)} tbt=${Math.round(r.tbt)} longTasks=${r.longTasks} lastLongTaskEnd=${Math.round(r.lastLongTaskEnd)} load=${Math.round(r.load)} bytes=${r.totalBytes}`,
    );
  }
} finally {
  cdp.close();
  chrome.stop();
}

const METRICS = ["ttfb", "fcp", "heroVisible", "lcp", "hydrated", "tbt", "longTasks", "lastLongTaskEnd", "domContentLoaded", "load", "htmlBytes", "jsBytes", "imageBytes", "totalBytes"];
const summary = Object.fromEntries(METRICS.map((k) => [k, median(samples.map((s) => s[k]))]));
const report = { url, profile: profileName, runs, median: summary, resources: samples.at(-1).resources, samples: samples.map(({ resources, ...rest }) => rest) };
console.log(JSON.stringify({ url, profile: profileName, runs, median: Object.fromEntries(Object.entries(summary).map(([k, v]) => [k, v == null ? null : Math.round(v)])) }, null, 2));
if (out) writeFileSync(out, JSON.stringify(report, null, 2));
