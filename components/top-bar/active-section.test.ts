import { test } from "node:test";
import assert from "node:assert/strict";
import { pickActiveSection } from "./active-section.ts";

const boxes = [
  { id: "home", top: -900 },
  { id: "skills", top: -200 },
  { id: "experience", top: 250 }, // 250 <= 0.35 * 800 = 280: above the line
  { id: "projects", top: 1400 },
  { id: "contact", top: 2600 },
];
const viewport = { height: 800, scrollY: 900, scrollHeight: 5000 };

test("last section above the 35% line wins", () => {
  assert.equal(pickActiveSection(boxes, viewport), "experience");
});

test("a section just below the line is not active yet", () => {
  assert.equal(
    pickActiveSection(boxes.map((b) => (b.id === "experience" ? { ...b, top: 281 } : b)), viewport),
    "skills",
  );
});

test("at the page bottom the last section wins", () => {
  assert.equal(pickActiveSection(boxes, { ...viewport, scrollY: 4198 }), "contact");
});

test("nothing above the line falls back to the first", () => {
  assert.equal(pickActiveSection(boxes.map((b) => ({ ...b, top: b.top + 2000 })), { ...viewport, scrollY: 0 }), "home");
});

test("no sections on the page", () => {
  assert.equal(pickActiveSection([], viewport), undefined);
});
