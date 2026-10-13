import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { MORPH_DOM, morphFrame, morphGeometry, type MorphFrame, type MorphGeometry } from "./morph.ts";

const from: MorphGeometry["from"] = {
  avatar: { x: 36, y: 150, width: 80, height: 80, fontSize: 16 },
  name: { x: 36, y: 240, width: 256, height: 42, fontSize: 44 },
  title: { x: 36, y: 292, width: 220, height: 28, fontSize: 18 },
};
const to: MorphGeometry["to"] = {
  avatar: { x: 16, y: 12, width: 32, height: 32, fontSize: 16 },
  name: { x: 58, y: 9, width: 94, height: 18, fontSize: 16 },
  title: { x: 58, y: 27, width: 120, height: 14, fontSize: 12 },
};
const geometry = morphGeometry(from, to, 56);

function rounded(frame: MorphFrame) {
  return JSON.parse(JSON.stringify(frame, (_, v) => (typeof v === "number" ? Math.round(v * 1e4) / 1e4 : v)));
}

test("the range ends as the title line slides under the bar", () => {
  assert.equal(geometry.range, 264);
});

test("a masthead that starts almost under the bar still gets the minimum range", () => {
  assert.equal(morphGeometry({ ...from, title: { ...from.title, y: 40 } }, to, 56).range, 96);
});

test("at the top every piece sits on its masthead spot and the bar is clear", () => {
  assert.deepEqual(rounded(morphFrame(geometry, 0)), {
    progress: 0,
    barOpacity: 0,
    slotOpacity: 0,
    mastheadOpacity: 1,
    underlineOpacity: 1,
    pieces: {
      avatar: { x: 36, y: 150, scale: 1 },
      name: { x: 36, y: 240, scale: 1 },
      title: { x: 36, y: 292, scale: 1 },
    },
  });
});

test("halfway, the avatar has nearly docked while the text still rides the page", () => {
  assert.deepEqual(rounded(morphFrame(geometry, 132)), {
    progress: 0.5,
    barOpacity: 0.2308,
    slotOpacity: 0,
    mastheadOpacity: 0.5,
    underlineOpacity: 0,
    pieces: {
      avatar: { x: 18.5, y: 12.75, scale: 0.475 },
      name: { x: 55.25, y: 75.792, scale: 0.7901 },
      title: { x: 55.25, y: 115.3566, scale: 0.89 },
    },
  });
});

test("at the end of the range every piece sits on its bar slot, text centred on the slot's line", () => {
  const docked = {
    progress: 1,
    barOpacity: 1,
    slotOpacity: 1,
    mastheadOpacity: 0,
    underlineOpacity: 0,
    pieces: {
      avatar: { x: 16, y: 12, scale: 0.4 },
      name: { x: 58, y: 10.3636, scale: 0.3636 },
      title: { x: 58, y: 24.6667, scale: 0.6667 },
    },
  };
  assert.deepEqual(rounded(morphFrame(geometry, 264)), docked);
  assert.deepEqual(rounded(morphFrame(geometry, 2000)), docked);
});

test("overscroll above the top moves the pieces with the page and does not start the morph", () => {
  const frame = rounded(morphFrame(geometry, -20));
  assert.equal(frame.progress, 0);
  assert.deepEqual(frame.pieces.avatar, { x: 36, y: 170, scale: 1 });
});

test("motion.css styles the attributes the morph hook writes", () => {
  const css = readFileSync(new URL("../../app/motion.css", import.meta.url), "utf8");
  assert.ok(css.includes(`[${MORPH_DOM.masthead}][${MORPH_DOM.morphing}] [${MORPH_DOM.piece}]`));
  assert.ok(css.includes(`var(${MORPH_DOM.opacity}`));
});
