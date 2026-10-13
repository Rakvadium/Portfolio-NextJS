#!/usr/bin/env node
// Proof captures for the portfolio, over the Chrome DevTools Protocol. Zero dependencies.
//
//   node scripts/capture.mjs page    [--base URL] [--reduced-motion] [--video]
//   node scripts/capture.mjs stories [--base URL | --dir storybook-static] <story-id>[@phone][@full] ...
//   node scripts/capture.mjs mobile-nav [--base URL]
//
// page:    screenshots of the full scroll at 1280x800 and 390x844, a mid-handoff frame at scrollY=260,
//          and with --video a scroll-through MP4 per viewport (needs ffmpeg: FFMPEG env or on PATH).
//          Prints every console error, warning, and uncaught exception, so a run doubles as the
//          hydration check (exit 1 when there are any). Default base: http://127.0.0.1:3201.
// stories: one screenshot per Storybook story id, after its play function has had time to run.
//          `@phone` renders at 390x844 with the phone viewport global; `@full` captures the whole page;
//          `@hover` moves the mouse over the first tile first (shows the cursor glow).
//          `--dir` serves a built Storybook from disk on a free port.
// mobile-nav: the phone navigation below lg, at 390x844 and 360x780 (2x), reduced motion off and on.
//          Masthead -> bar morph frames at scrollY 0/40/80/120/160/200 and scrolled into Experience,
//          then behaviour checks: one visible h1, the dock fits, tab taps set the hash and land below
//          the bar, the bar title follows the sections (Contact at the bottom), socials are visible
//          and tappable at top and bottom, a 390 -> 360 resize mid-page and a reload at #experience
//          both land docked. Frames go to captures/mobile-nav-final/; a failed check exits 1.
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

const setPhone = (cdp, width, height, deviceScaleFactor = 2) =>
  cdp.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor, mobile: true });

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

/* ------------------------------------------------------------------ mobile nav */

// In-page probes, defined on every call (navigation clears them). Each returns plain data; the
// assertions live in Node below.
const PROBES = `
const visible = (sel) => [...document.querySelectorAll(sel)].find((e) => e.checkVisibility());
const P = {
  bar: () => document.querySelector("header:has([data-morph-slot])"),
  visibleH1s: () => [...document.querySelectorAll("h1")].filter((h) => h.checkVisibility()).map((h) => h.textContent.trim()),
  title: () => P.bar().querySelector("[data-active]")?.textContent ?? "",
  current: () => visible('nav[aria-label="Sections"]').querySelector('a[aria-current="true"]')?.getAttribute("aria-label") ?? "",
  glass: () => +getComputedStyle(P.bar().firstElementChild).opacity,
  slotOpacity: () => +getComputedStyle(document.querySelector('[data-morph-slot="avatar"]')).opacity,
  copiesShown: () => [...document.querySelectorAll("[data-morph-copy]")].some((c) => c.checkVisibility()),
  mastheadPiecesOpacity: () => [...document.querySelectorAll("[data-morph-piece]")].map((e) => +getComputedStyle(e).opacity),
  // Docked: each flying copy over its bar slot. Worst px gap of left edges, vertical centres, avatar width.
  dockError: () => {
    let worst = 0;
    for (const k of ["avatar", "name", "title"]) {
      const c = document.querySelector('[data-morph-copy="' + k + '"]');
      const s = document.querySelector('[data-morph-slot="' + k + '"]');
      if (!c || !s || !c.checkVisibility()) return null;
      const a = c.getBoundingClientRect(), b = s.getBoundingClientRect();
      worst = Math.max(worst, Math.abs(a.left - b.left), Math.abs(a.top + a.height / 2 - (b.top + b.height / 2)), k === "avatar" ? Math.abs(a.width - b.width) : 0);
    }
    return Math.round(worst * 100) / 100;
  },
  // A tap at the centre of each dock control: does it reach the control? And the dock's extent.
  dock: () => {
    const nav = visible('nav[aria-label="Sections"]');
    const social = document.querySelector('[role="group"][aria-label="Social links"]');
    return {
      navRight: Math.round(nav.getBoundingClientRect().right),
      socialLeft: Math.round(social.getBoundingClientRect().left),
      socialRight: Math.round(social.getBoundingClientRect().right),
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      hits: [...nav.querySelectorAll("a"), ...social.querySelectorAll("a")].map((a) => {
        const r = a.getBoundingClientRect();
        const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return { name: a.getAttribute("aria-label"), href: a.getAttribute("href"), tappable: a.checkVisibility() && !!hit && a.contains(hit) };
      }),
    };
  },
  landing: (id) => {
    const target = document.getElementById(id);
    return { hash: location.hash, scrollY: Math.round(scrollY), barBottom: Math.round(P.bar().getBoundingClientRect().bottom), top: Math.round(target.getBoundingClientRect().top), atBottom: innerHeight + scrollY >= document.documentElement.scrollHeight - 4 };
  },
};`;

async function captureMobileNav() {
  const base = option("base") ?? "http://127.0.0.1:3201";
  const out = path.join(OUT, "mobile-nav-final");
  fs.rmSync(out, { recursive: true, force: true });
  const cdp = await launchChrome();
  const problems = collectProblems(cdp);
  const failures = [];
  const check = (ok, label, detail) => {
    console.log(`  ${ok ? "pass" : "FAIL"}  ${label}${detail === undefined ? "" : `  ${JSON.stringify(detail)}`}`);
    if (!ok) failures.push(label);
  };
  const probe = (expr) => cdp.evaluate(`(() => { ${PROBES}; return ${expr}; })()`);
  const tap = async (selector) => {
    const pt = await cdp.evaluate(`(() => { const r = [...document.querySelectorAll(${JSON.stringify(selector)})].find((e) => e.checkVisibility()).getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
    for (const type of ["mousePressed", "mouseReleased"]) await cdp.send("Input.dispatchMouseEvent", { type, x: pt.x, y: pt.y, button: "left", clickCount: 1 });
  };
  const load = async (url) => {
    await navigate(cdp, url);
    await sleep(1500);
  };
  const docked = (s, reduced) => s.glass === 1 && (reduced ? s.slot === 1 && s.dockError === null : s.dockError !== null && s.dockError <= 1);
  const dockState = async () => ({ dockError: await probe("P.dockError()"), glass: await probe("P.glass()"), slot: await probe("P.slotOpacity()") });

  for (const reduced of [false, true]) {
    const tag = reduced ? "-reduced" : "";
    await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: reduced ? "reduce" : "no-preference" }] });
    for (const [w, h] of [[390, 844], [360, 780]]) {
      console.log(`mobile-nav ${w}x${h}${reduced ? " (reduced motion)" : ""}`);
      await setPhone(cdp, w, h);
      await load(`${base}/`);
      await cdp.evaluate(NO_SMOOTH);
      const prefix = path.join(out, `${w}${tag}`);
      await screenshot(cdp, `${prefix}-y000.png`);
      for (const y of [40, 80, 120, 160, 200]) {
        await cdp.evaluate(`scrollTo(0, ${y})`);
        await sleep(500);
        await screenshot(cdp, `${prefix}-y${String(y).padStart(3, "0")}.png`);
      }
      await cdp.evaluate(`document.getElementById("experience").scrollIntoView(); scrollBy(0, 160)`);
      await sleep(900);
      await screenshot(cdp, `${prefix}-experience.png`);

      await cdp.evaluate("scrollTo(0, 0)");
      await sleep(400);
      const h1s = await probe("P.visibleH1s()");
      check(h1s.length === 1 && h1s[0] === "Caleb Mills", "one visible h1", h1s);
      const top = await probe("P.dock()");
      check(top.navRight <= top.socialLeft && top.socialRight <= top.width && top.scrollWidth === top.width, "dock fits the width", { ...top, hits: undefined });
      check(top.hits.every((x) => x.tappable), "dock controls visible and tappable at the top", top.hits.filter((x) => !x.tappable).map((x) => x.name));
      check((await probe("P.title()")) === "" && (await probe("P.glass()")) === 0, "at the top: bar glass clear, no section title", { title: await probe("P.title()"), glass: await probe("P.glass()") });
      if (reduced) {
        check(!(await probe("P.copiesShown()")), "reduced motion: no flying copies");
        check((await probe("P.mastheadPiecesOpacity()")).every((o) => o === 1), "reduced motion: masthead pieces stay visible");
      }

      // Tabs in page order, with the page's own scroll behaviour (smooth unless reduced motion).
      await cdp.evaluate(`document.querySelectorAll("style").forEach((s) => { if (s.textContent.includes("scroll-behavior:auto")) s.textContent = "nextjs-portal{display:none!important}"; })`);
      for (const id of ["skills", "experience", "projects", "contact", "home"]) {
        const label = id[0].toUpperCase() + id.slice(1);
        await tap(`a[aria-label="${label}"][href="#${id}"]`);
        await sleep(1800);
        const l = await probe(`P.landing("${id}")`);
        const landed = id === "home" ? l.scrollY === 0 : l.top >= l.barBottom && (l.top <= l.barBottom + 40 || l.atBottom);
        check(l.hash === `#${id}` && landed, `tab ${label}: hash set, lands below the bar`, l);
        const follow = { current: await probe("P.current()"), title: await probe("P.title()") };
        check(follow.current === label && follow.title === (id === "home" ? "" : label), `tab ${label}: aria-current and bar title follow`, follow);
      }
      await cdp.evaluate(NO_SMOOTH);
      await cdp.evaluate("scrollTo(0, document.documentElement.scrollHeight)");
      await sleep(700);
      const bottom = await probe("P.dock()");
      check(bottom.hits.every((x) => x.tappable), "dock controls visible and tappable at the bottom", bottom.hits.filter((x) => !x.tappable).map((x) => x.name));
      check((await probe("P.title()")) === "Contact", "bar title is Contact at the page bottom", await probe("P.title()"));
      const footerClear = await cdp.evaluate(`document.querySelector("footer").getBoundingClientRect().bottom <= document.querySelector('[role="group"][aria-label="Social links"]').getBoundingClientRect().top`);
      check(footerClear, "footer clears the dock at the page bottom");
      await screenshot(cdp, `${prefix}-bottom.png`);
      if (!reduced && w === 390) console.log(`    dock links: ${bottom.hits.map((x) => `${x.name} -> ${x.href}`).join(" | ")}`);

      await load(`${base}/#experience`);
      const reload = { scrollY: await cdp.evaluate("Math.round(scrollY)"), title: await probe("P.title()"), ...(await dockState()) };
      check(reload.scrollY > 0 && reload.title === "Experience" && docked(reload, reduced), "reload at #experience lands docked", reload);
      await screenshot(cdp, `${prefix}-reload-experience.png`);
    }
  }

  // The brief's resize: 390 -> 360 mid-page, motion on and off.
  for (const reduced of [false, true]) {
    await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: reduced ? "reduce" : "no-preference" }] });
    await setPhone(cdp, 390, 844);
    await load(`${base}/`);
    await cdp.evaluate(NO_SMOOTH);
    await cdp.evaluate("scrollTo(0, 1500)");
    await sleep(500);
    await setPhone(cdp, 360, 780);
    await sleep(800);
    const s = await dockState();
    check(docked(s, reduced), `390 -> 360 resize mid-page stays docked${reduced ? " (reduced motion)" : ""}`, s);
    await screenshot(cdp, path.join(out, `resize-390-to-360${reduced ? "-reduced" : ""}.png`));
  }

  cdp.close();
  problems.push(...failures.map((f) => `check failed: ${f}`));
  return problems;
}

/* ------------------------------------------------------------------ main */

const run = { page: capturePage, stories: captureStories, "mobile-nav": captureMobileNav }[mode];
if (!run) {
  console.error("usage: node scripts/capture.mjs page|stories|mobile-nav [options] (see the header of this file)");
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
