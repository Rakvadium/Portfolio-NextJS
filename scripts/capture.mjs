#!/usr/bin/env node
// Proof captures for the portfolio, over the Chrome DevTools Protocol. Zero dependencies.
//
//   node scripts/capture.mjs page    [--base URL] [--reduced-motion] [--video]
//   node scripts/capture.mjs stories [--base URL | --dir storybook-static] <story-id>[@phone][@full] ...
//
// page:    screenshots of the full scroll at 1280x800 and 390x844, a mid-handoff frame at scrollY=260,
//          and with --video a scroll-through MP4 per viewport (needs ffmpeg: FFMPEG env or on PATH).
//          Prints every console error, warning, and uncaught exception, so a run doubles as the
//          hydration check (exit 1 when there are any). Default base: http://127.0.0.1:3201.
// stories: one screenshot per Storybook story id, after its play function has had time to run.
//          `@phone` renders at 390x844 with the phone viewport global; `@full` captures the whole page;
//          `@hover` moves the mouse over the first tile first (shows the cursor glow).
//          `--dir` serves a built Storybook from disk on a free port.
//
// Output goes to ./captures (git-ignored). Chrome: CHROME env, default the Windows install path.
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";

const CHROME = process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const FFMPEG = process.env.FFMPEG ?? "ffmpeg";
const OUT = path.resolve("captures");
const VIEWPORTS = { desktop: [1280, 800], phone: [390, 844] };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const [mode, ...rest] = process.argv.slice(2);
const flags = new Set(rest.filter((a) => a.startsWith("--") && !a.includes("=")));
const option = (name) => {
  const i = rest.indexOf(`--${name}`);
  return i >= 0 ? rest[i + 1] : undefined;
};
const positional = rest.filter((a, i) => !a.startsWith("--") && !(i > 0 && ["--base", "--dir"].includes(rest[i - 1])));

/* ------------------------------------------------------------------ chrome + CDP */

async function launchChrome() {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-capture-"));
  const proc = spawn(CHROME, [
    "--headless=new",
    "--remote-debugging-port=0",
    `--user-data-dir=${profile}`,
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    "about:blank",
  ]);
  const portFile = path.join(profile, "DevToolsActivePort");
  for (let i = 0; i < 100 && !fs.existsSync(portFile); i++) await sleep(100);
  const port = fs.readFileSync(portFile, "utf8").split("\n")[0].trim();
  let wsUrl;
  for (let i = 0; i < 50 && !wsUrl; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      wsUrl = list.find((t) => t.type === "page")?.webSocketDebuggerUrl;
    } catch {}
    if (!wsUrl) await sleep(100);
  }
  const ws = new WebSocket(wsUrl);
  await new Promise((r) => ws.addEventListener("open", r));
  let id = 0;
  const pending = new Map();
  const listeners = new Map();
  ws.addEventListener("message", (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    } else if (msg.method) {
      listeners.get(msg.method)?.forEach((fn) => fn(msg.params));
    }
  });
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const n = ++id;
      pending.set(n, (m) => (m.error ? reject(new Error(`${method}: ${m.error.message}`)) : resolve(m.result)));
      ws.send(JSON.stringify({ id: n, method, params }));
    });
  const on = (method, fn) => listeners.set(method, [...(listeners.get(method) ?? []), fn]);
  const evaluate = async (expression) =>
    (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result.value;
  const close = () => {
    ws.close();
    proc.kill();
    setTimeout(() => fs.rmSync(profile, { recursive: true, force: true }), 500);
  };
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Log.enable");
  return { send, on, evaluate, close };
}

async function setViewport(cdp, name) {
  const [width, height] = VIEWPORTS[name];
  await cdp.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: name === "phone" });
}

async function navigate(cdp, url) {
  const loaded = new Promise((r) => cdp.on("Page.loadEventFired", r));
  await cdp.send("Page.navigate", { url });
  await Promise.race([loaded, sleep(15000)]);
}

async function screenshot(cdp, file, { full = false } = {}) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const params = { format: "png" };
  if (full) {
    // Scroll through once so lazy images load, then return to the top.
    await cdp.evaluate(`new Promise(async (done) => { for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight / 2) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } scrollTo(0, 0); setTimeout(done, 800); })`);
    // Scroll-driven reveals key off the real viewport, so content past it would be captured mid-entry.
    await cdp.evaluate(`(() => { const s = document.createElement('style'); s.textContent = '.motion-reveal{animation:none!important}'; document.head.appendChild(s); })()`);
    const { cssContentSize: s } = await cdp.send("Page.getLayoutMetrics");
    Object.assign(params, { captureBeyondViewport: true, clip: { x: 0, y: 0, width: s.width, height: s.height, scale: 1 } });
  }
  const { data } = await cdp.send("Page.captureScreenshot", params);
  fs.writeFileSync(file, Buffer.from(data, "base64"));
  console.log(`  ${path.relative(process.cwd(), file)}`);
}

/** Collects console errors/warnings and uncaught exceptions for the life of the page. */
function collectProblems(cdp) {
  const problems = [];
  cdp.on("Runtime.consoleAPICalled", (p) => {
    if (p.type === "error" || p.type === "warning" || p.type === "assert") {
      problems.push(`console.${p.type}: ${p.args.map((a) => a.value ?? a.description ?? "").join(" ")}`);
    }
  });
  cdp.on("Runtime.exceptionThrown", (p) => problems.push(`exception: ${p.exceptionDetails.exception?.description ?? p.exceptionDetails.text}`));
  cdp.on("Log.entryAdded", ({ entry }) => {
    if (entry.level === "error" || entry.level === "warning") problems.push(`log.${entry.level}: ${entry.text} ${entry.url ?? ""}`);
  });
  return problems;
}

const NO_SMOOTH = `(() => { const s = document.createElement('style'); s.textContent = 'html{scroll-behavior:auto!important} nextjs-portal{display:none!important}'; document.head.appendChild(s); })()`;

/* ------------------------------------------------------------------ page */

async function capturePage() {
  const base = option("base") ?? "http://127.0.0.1:3201";
  const reduced = flags.has("--reduced-motion");
  const suffix = reduced ? "-reduced" : "";
  const cdp = await launchChrome();
  const problems = collectProblems(cdp);
  await cdp.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: reduced ? "reduce" : "no-preference" }],
  });
  for (const vp of Object.keys(VIEWPORTS)) {
    const [, height] = VIEWPORTS[vp];
    const dir = path.join(OUT, "page", `${vp}${suffix}`);
    fs.rmSync(dir, { recursive: true, force: true });
    await setViewport(cdp, vp);
    console.log(`page ${vp}${reduced ? " (reduced motion)" : ""}: ${base}/`);
    await navigate(cdp, `${base}/`);
    await sleep(1500);
    await cdp.evaluate(NO_SMOOTH);
    const total = await cdp.evaluate("document.documentElement.scrollHeight");
    const step = Math.round(height * 0.85);
    for (let y = 0, i = 0; i < 40; y += step, i++) {
      await cdp.evaluate(`window.scrollTo(0, ${y})`);
      await sleep(i === 0 ? 300 : 700);
      await screenshot(cdp, path.join(dir, `${String(i).padStart(2, "0")}.png`));
      if (y + height >= total) break;
    }
    await cdp.evaluate("window.scrollTo(0, 260)");
    await sleep(700);
    await screenshot(cdp, path.join(dir, "handoff-260.png"));
    await cdp.evaluate("window.scrollTo(0, 0)");
    await sleep(500);
    await screenshot(cdp, path.join(dir, "full.png"), { full: true });
    if (flags.has("--video")) await recordScroll(cdp, vp, path.join(OUT, "videos", `${vp}${suffix}.mp4`));
  }
  cdp.close();
  return problems;
}

/** Reloads (so mount entrances are in the video), then scrolls top to bottom with an ease-in-out. */
async function recordScroll(cdp, vp, out) {
  const [width, height] = VIEWPORTS[vp];
  const frameDir = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-frames-"));
  const frames = [];
  cdp.on("Page.screencastFrame", (p) => {
    if (!frameDir || !fs.existsSync(frameDir)) return;
    const file = path.join(frameDir, `${String(frames.length).padStart(5, "0")}.jpg`);
    fs.writeFileSync(file, Buffer.from(p.data, "base64"));
    frames.push({ file, ts: p.metadata.timestamp });
    cdp.send("Page.screencastFrameAck", { sessionId: p.sessionId }).catch(() => {});
  });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 85, everyNthFrame: 1, maxWidth: width, maxHeight: height });
  await cdp.send("Page.reload");
  await sleep(2000);
  await cdp.evaluate(NO_SMOOTH);
  await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: Math.round(width * 0.4), y: Math.round(height * 0.45) });
  await sleep(1200);
  const speed = vp === "phone" ? 520 : 420;
  await cdp.evaluate(`new Promise((done) => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const dur = Math.min(40000, Math.max(4000, (max / ${speed}) * 1000));
    const t0 = performance.now();
    const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      window.scrollTo(0, max * ease(t));
      t < 1 ? requestAnimationFrame(tick) : setTimeout(done, 1500);
    };
    requestAnimationFrame(tick);
  })`);
  await cdp.send("Page.stopScreencast");
  await sleep(300);
  const list =
    frames
      .map((f, i) => `file '${f.file.split(path.sep).join("/")}'\nduration ${Math.max(0.001, (frames[i + 1]?.ts ?? f.ts + 0.5) - f.ts).toFixed(4)}`)
      .join("\n") + `\nfile '${frames.at(-1).file.split(path.sep).join("/")}'\n`;
  const listFile = path.join(frameDir, "list.txt");
  fs.writeFileSync(listFile, list);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const r = spawnSync(FFMPEG, [
    "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", listFile,
    "-vf", "fps=30,scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p",
    "-c:v", "libx264", "-crf", "23", "-movflags", "+faststart", out,
  ]);
  if (r.status !== 0) throw new Error(`ffmpeg failed: ${r.stderr ?? r.error}`);
  fs.rmSync(frameDir, { recursive: true, force: true });
  console.log(`  ${path.relative(process.cwd(), out)} (${frames.length} frames, ${(frames.at(-1).ts - frames[0].ts).toFixed(1)}s)`);
}

/* ------------------------------------------------------------------ stories */

const MIME = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".woff": "font/woff", ".ico": "image/x-icon" };

function serveDir(dir) {
  const root = path.resolve(dir);
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, "http://x");
    if (url.pathname === "/favicon.ico") return res.writeHead(204).end(); // Storybook ships none
    let file = path.join(root, decodeURIComponent(url.pathname));
    if (!file.startsWith(root)) return res.writeHead(403).end();
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": MIME[path.extname(file)] ?? "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((r) => server.listen(0, "127.0.0.1", () => r({ base: `http://127.0.0.1:${server.address().port}`, server })));
}

async function captureStories() {
  const served = option("dir") ? await serveDir(option("dir")) : undefined;
  const base = served?.base ?? option("base") ?? "http://127.0.0.1:6006";
  const cdp = await launchChrome();
  const problems = collectProblems(cdp);
  for (const spec of positional) {
    const [id, ...mods] = spec.split("@");
    const vp = mods.includes("phone") ? "phone" : "desktop";
    await setViewport(cdp, vp);
    const globals = vp === "phone" ? "&globals=viewport.value:phone" : "";
    await navigate(cdp, `${base}/iframe.html?id=${id}&viewMode=story${globals}`);
    for (let i = 0; i < 50; i++) {
      if (await cdp.evaluate("!!document.querySelector('#storybook-root')?.children.length")) break;
      await sleep(200);
    }
    await sleep(2500); // play functions and entrance animations
    if (mods.includes("hover")) {
      const box = await cdp.evaluate(`(() => { const r = document.querySelector(".tile")?.getBoundingClientRect(); return r && { x: r.left + r.width * 0.3, y: r.top + r.height * 0.4 }; })()`);
      if (box) await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: box.x, y: box.y });
      await sleep(700);
    }
    await screenshot(cdp, path.join(OUT, "stories", `${spec.replaceAll("@", "_")}.png`), { full: mods.includes("full") });
  }
  cdp.close();
  served?.server.close();
  return problems;
}

/* ------------------------------------------------------------------ main */

const run = { page: capturePage, stories: captureStories }[mode];
if (!run) {
  console.error("usage: node scripts/capture.mjs page|stories [options] (see the header of this file)");
  process.exit(2);
}
const problems = await run();
if (problems.length) {
  console.log(`\nconsole problems (${problems.length}):`);
  for (const p of problems) console.log(`  ${p}`);
  process.exitCode = 1;
} else {
  console.log("\nconsole problems: none");
}
