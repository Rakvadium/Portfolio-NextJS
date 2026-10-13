import { test } from "node:test";
import assert from "node:assert/strict";
import { morphFrame, morphGeometry, type MorphFrame, type MorphGeometry } from "./morph.ts";

// Roughly the 390px page: masthead pieces in page coordinates, bar slots in viewport coordinates.
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

/** Rounds every number to 4 decimals, so expectations can be written as literals. */
function rounded(frame: MorphFrame) {
  return JSON.parse(JSON.stringify(frame, (_, v) => (typeof v === "number" ? Math.round(v * 1e4) / 1e4 : v)));
}

test("the range ends as the title line slides under the bar", () => {
  assert.equal(geometry.range, 264); // 292 + 28 - 56
});

test("a masthead that starts almost under the bar still gets the minimum range", () => {
  assert.equal(morphGeometry({ ...from, title: { ...from.title, y: 40 } }, to, 56).range, 96);
});

test("at the top every piece sits on its masthead spot and the bar is clear", () => {
  assert.deepEqual(rounded(morphFrame(geometry, 0)), {
    progress: 0,
    barOpacity: 0,
    slotOpacity: 0,
    underlineOpacity: 1,
    pieces: {
      avatar: { x: 36, y: 150, scale: 1 },
      name: { x: 36, y: 240, scale: 1 },
      title: { x: 36, y: 292, scale: 1 },
    },
  });
});

test("halfway, the avatar has nearly docked while the text still rides the page", () => {
  // early = 1 - 0.5^3 = 0.875, late = 0.5^1.6 = 0.329877
  assert.deepEqual(rounded(morphFrame(geometry, 132)), {
    progress: 0.5,
    barOpacity: 0.2308, // (0.5 - 0.35) / 0.65
    slotOpacity: 0,
    underlineOpacity: 0,
    pieces: {
      avatar: { x: 18.5, y: 12.75, scale: 0.475 }, // y: 18 -> 12, scale 1 -> 0.4
      name: { x: 55.25, y: 75.792, scale: 0.7901 }, // y: 108 -> 10.3636, scale 1 -> 16/44
      title: { x: 55.25, y: 115.3566, scale: 0.89 }, // y: 160 -> 24.6667, scale 1 -> 12/18
    },
  });
});

test("at the end of the range every piece sits on its bar slot, text centred on the slot's line", () => {
  const docked = {
    progress: 1,
    barOpacity: 1,
    slotOpacity: 1,
    underlineOpacity: 0,
    pieces: {
      avatar: { x: 16, y: 12, scale: 0.4 },
      name: { x: 58, y: 10.3636, scale: 0.3636 }, // 9 + 18/2 - 42 * (16/44) / 2
      title: { x: 58, y: 24.6667, scale: 0.6667 }, // 27 + 14/2 - 28 * (12/18) / 2
    },
  };
  assert.deepEqual(rounded(morphFrame(geometry, 264)), docked);
  // A deep link or mid-page reload lands in the same docked state.
  assert.deepEqual(rounded(morphFrame(geometry, 2000)), docked);
});

test("overscroll above the top moves the pieces with the page and does not start the morph", () => {
  const frame = rounded(morphFrame(geometry, -20));
  assert.equal(frame.progress, 0);
  assert.deepEqual(frame.pieces.avatar, { x: 36, y: 170, scale: 1 });
});
