#!/usr/bin/env node
// PROTOTYPE capture (throwaway, branch prototype/mobile-nav): screenshots + a scroll-and-use MP4 per
// `?nav=` variant at 390x844, plus one desktop 1280x800 shot each. Output: captures/mobile-nav/.
//   node scripts/capture-mobile-nav.mjs [--base http://127.0.0.1:3301] [--only A,B] [--no-video]
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const CHROME = process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const FFMPEG = process.env.FFMPEG ?? "ffmpeg";
const args = process.argv.slice(2);
const opt = (n) => (args.includes(`--${n}`) ? args[args.indexOf(`--${n}`) + 1] : undefined);
const BASE = opt("base") ?? "http://127.0.0.1:3301";
const ONLY = opt("only")?.split(",");
const VIDEO = !args.includes("--no-video");
const OUT = path.resolve("captures", "mobile-nav");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const VARIANTS = ["current", "A", "B", "C", "D"].filter((v) => !ONLY || ONLY.includes(v));

// How to open each variant's menu (if it has one) and which link to use in it.
const OPEN = {
  current: `button[aria-expanded][aria-label], header button[aria-expanded]`,
  A: null,
  B: `button[aria-expanded="false"]`,
  C: `button[aria-label="Open menu"]`,
  D: null,
};

async function launch() {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "proto-nav-"));
  const proc = spawn(CHROME, ["--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "--hide-scrollbars", "--no-first-run", "about:blank"]);
  const portFile = path.join(profile, "DevToolsActivePort");
  for (let i = 0; i < 100 && !fs.existsSync(portFile); i++) await sleep(100);
  const port = fs.readFileSync(portFile, "utf8").split("\n")[0].trim();
  let wsUrl;
  for (let i = 0; i < 50 && !wsUrl; i++) {
    try {
      wsUrl = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === "page")?.webSocketDebuggerUrl;
    } catch {}
    if (!wsUrl) await sleep(100);
  }
  const ws = new WebSocket(wsUrl);
  await new Promise((r) => ws.addEventListener("open", r));
  let id = 0;
  const pending = new Map();
  const listeners = new Map();
  ws.addEventListener("message", (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      pending.get(m.id)(m);
      pending.delete(m.id);
    } else if (m.method) listeners.get(m.method)?.forEach((fn) => fn(m.params));
  });
  const send = (method, params = {}) =>
    new Promise((res, rej) => {
      const n = ++id;
      pending.set(n, (m) => (m.error ? rej(new Error(`${method}: ${m.error.message}`)) : res(m.result)));
      ws.send(JSON.stringify({ id: n, method, params }));
    });
  const on = (method, fn) => listeners.set(method, [...(listeners.get(method) ?? []), fn]);
  const off = (method) => listeners.delete(method);
  const evaluate = async (expression) => (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result.value;
  await send("Page.enable");
  await send("Runtime.enable");
  const problems = [];
  on("Runtime.exceptionThrown", (p) => problems.push(p.exceptionDetails.exception?.description ?? p.exceptionDetails.text));
  on("Runtime.consoleAPICalled", (p) => p.type === "error" && problems.push(p.args.map((a) => a.value ?? a.description).join(" ")));
  return { send, on, off, evaluate, problems, close: () => (ws.close(), proc.kill()) };
}

async function goto(cdp, url) {
  const loaded = new Promise((r) => cdp.on("Page.loadEventFired", r));
  await cdp.send("Page.navigate", { url });
  await Promise.race([loaded, sleep(15000)]);
  cdp.off("Page.loadEventFired");
  await sleep(1600);
}

async function shot(cdp, file) {
  const { data } = await cdp.send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(OUT, file), Buffer.from(data, "base64"));
  console.log(`  captures/mobile-nav/${file}`);
}

const hideSwitcher = (cdp, hide) => cdp.evaluate(`document.querySelectorAll('[data-prototype-switcher]').forEach(e => e.style.visibility = ${hide ? "'hidden'" : "''"})`);
const instantScroll = (cdp) => cdp.evaluate(`(() => { const s = document.createElement('style'); s.id='nosmooth'; s.textContent = 'html{scroll-behavior:auto!important}'; document.head.appendChild(s); })()`);

/** Real mouse click on the first visible, hit-testable element matching `sel`. */
async function tap(cdp, sel) {
  const pt = await cdp.evaluate(`(() => {
    for (const el of document.querySelectorAll(${JSON.stringify(sel)})) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      if (y < 0 || y > innerHeight) continue;
      const hit = document.elementFromPoint(x, y);
      if (hit && (el === hit || el.contains(hit))) return { x, y };
    }
    return null;
  })()`);
  if (!pt) throw new Error(`no tappable ${sel}`);
  for (const type of ["mouseMoved", "mousePressed", "mouseReleased"]) {
    await cdp.send("Input.dispatchMouseEvent", { type, x: pt.x, y: pt.y, button: "left", clickCount: 1 });
    if (type === "mousePressed") await sleep(60);
  }
}

/** Smoothly scroll the page to `to` (px or a section id) over `ms`. */
const glide = (cdp, to, ms) =>
  cdp.evaluate(`new Promise((done) => {
    const y0 = scrollY;
    const target = ${typeof to === "string" ? `document.getElementById(${JSON.stringify(to)}).getBoundingClientRect().top + scrollY - 80` : to};
    const y1 = Math.max(0, Math.min(target, document.documentElement.scrollHeight - innerHeight));
    const t0 = performance.now();
    const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const tick = (now) => { const t = Math.min(1, (now - t0) / ${ms}); scrollTo(0, y0 + (y1 - y0) * ease(t)); t < 1 ? requestAnimationFrame(tick) : setTimeout(done, 400); };
    requestAnimationFrame(tick);
  })`);

const url = (v) => `${BASE}/${v === "current" ? "" : `?nav=${v}`}`;

async function stills(cdp, v) {
  const p = `${v}`;
  await cdp.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await goto(cdp, url(v));
  await instantScroll(cdp);
  await hideSwitcher(cdp, true);
  await shot(cdp, `${p}-1-top.png`);
  await cdp.evaluate(`document.getElementById('experience').scrollIntoView()`);
  await sleep(1000);
  await hideSwitcher(cdp, true);
  await shot(cdp, `${p}-2-experience.png`);
  if (v === "D") {
    await cdp.evaluate(`scrollBy(0, -160)`);
    await sleep(900);
    await shot(cdp, `${p}-3-rail-after-scroll-up.png`);
    await cdp.evaluate(`document.getElementById('projects').scrollIntoView()`);
    await sleep(500);
    await cdp.evaluate(`scrollBy(0, -60)`);
    await sleep(1100);
    await shot(cdp, `${p}-4-projects-rail-autoscrolled.png`);
  }
  if (v === "A") {
    await cdp.evaluate(`document.getElementById('projects').scrollIntoView()`);
    await sleep(1000);
    await shot(cdp, `${p}-3-projects.png`);
    await cdp.evaluate(`scrollTo(0, document.documentElement.scrollHeight)`);
    await sleep(1000);
    await shot(cdp, `${p}-4-bottom.png`);
  }
  if (OPEN[v]) {
    await tap(cdp, OPEN[v]);
    await sleep(900);
    await hideSwitcher(cdp, true);
    await shot(cdp, `${p}-3-menu-open.png`);
  }
  // Desktop: same URL, proves lg+ is unchanged.
  await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  await goto(cdp, url(v));
  await hideSwitcher(cdp, true);
  await shot(cdp, `${p}-desktop.png`);
}

async function video(cdp, v) {
  await cdp.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  const frameDir = fs.mkdtempSync(path.join(os.tmpdir(), "proto-nav-frames-"));
  const frames = [];
  cdp.on("Page.screencastFrame", (p) => {
    const file = path.join(frameDir, `${String(frames.length).padStart(5, "0")}.jpg`);
    fs.writeFileSync(file, Buffer.from(p.data, "base64"));
    frames.push({ file, ts: p.metadata.timestamp });
    cdp.send("Page.screencastFrameAck", { sessionId: p.sessionId }).catch(() => {});
  });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 85, everyNthFrame: 1, maxWidth: 390, maxHeight: 844 });
  await goto(cdp, url(v));
  await sleep(600);
  await glide(cdp, "skills", 1600);
  await glide(cdp, "experience", 1600);
  await sleep(500);
  if (v === "D") {
    await glide(cdp, (await cdp.evaluate("scrollY")) - 180, 700);
    await sleep(500);
  }
  if (OPEN[v]) {
    await tap(cdp, OPEN[v]);
    await sleep(1300);
  }
  await tap(cdp, `nav a[href="#projects"], a[href="#projects"]`);
  await sleep(2200);
  if (v === "A") {
    await tap(cdp, `nav a[href="#contact"]`);
    await sleep(2200);
  }
  await glide(cdp, 99999, 1800);
  await sleep(500);
  await glide(cdp, 0, 2600);
  await sleep(1000);
  await cdp.send("Page.stopScreencast");
  cdp.off("Page.screencastFrame");
  await sleep(300);
  const list =
    frames.map((f, i) => `file '${f.file.split(path.sep).join("/")}'\nduration ${Math.max(0.001, (frames[i + 1]?.ts ?? f.ts + 0.5) - f.ts).toFixed(4)}`).join("\n") +
    `\nfile '${frames.at(-1).file.split(path.sep).join("/")}'\n`;
  const listFile = path.join(frameDir, "list.txt");
  fs.writeFileSync(listFile, list);
  const out = path.join(OUT, `${v}-phone.mp4`);
  const r = spawnSync(FFMPEG, ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", listFile, "-vf", "fps=30,scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p", "-c:v", "libx264", "-crf", "23", "-movflags", "+faststart", out]);
  if (r.status !== 0) throw new Error(`ffmpeg failed: ${r.stderr}`);
  fs.rmSync(frameDir, { recursive: true, force: true });
  console.log(`  captures/mobile-nav/${v}-phone.mp4 (${frames.length} frames)`);
}

fs.mkdirSync(OUT, { recursive: true });
const cdp = await launch();
for (const v of VARIANTS) {
  console.log(`nav=${v}`);
  await stills(cdp, v);
  if (VIDEO) await video(cdp, v);
}
cdp.close();
console.log(cdp.problems.length ? `\nproblems:\n  ${cdp.problems.join("\n  ")}` : "\nconsole problems: none");
