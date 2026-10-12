import { test } from "node:test";
import assert from "node:assert/strict";
import {
  displayHost,
  displayUrl,
  formatDateRange,
  formatYearSpan,
  initials,
  listToSentence,
  numberWord,
  slugify,
  wholeYearsBetween,
} from "./format.ts";

test("date ranges", () => {
  assert.equal(formatDateRange({ start: { year: 2023, month: 8 }, end: { year: 2026, month: 10 } }), "Aug 2023 – Oct 2026");
  assert.equal(formatDateRange({ start: { year: 2023, month: 8 }, end: "present" }), "Aug 2023 – Present");
  assert.equal(formatYearSpan({ start: { year: 2022, month: 1 }, end: { year: 2023, month: 8 } }), "2022 – 2023");
  assert.equal(formatYearSpan({ start: { year: 2022, month: 1 }, end: { year: 2022, month: 9 } }), "2022");
  assert.equal(formatYearSpan({ start: { year: 2023, month: 8 }, end: "present" }), "2023 – Present");
});

test("career years are month-accurate", () => {
  assert.equal(wholeYearsBetween({ year: 2017, month: 8 }, { year: 2026, month: 10 }), 9);
  assert.equal(wholeYearsBetween({ year: 2017, month: 8 }, { year: 2026, month: 7 }), 8);
  assert.equal(wholeYearsBetween({ year: 2017, month: 8 }, { year: 2026, month: 8 }), 9);
});

test("copy helpers", () => {
  assert.equal(numberWord(4), "four");
  assert.equal(numberWord(1), "one");
  assert.equal(numberWord(13), "13");
  assert.equal(listToSentence(["Velma.com", "KensieMae, LLC"]), "Velma.com and KensieMae, LLC");
  assert.equal(listToSentence(["React", "TypeScript", "Next.js"]), "React, TypeScript, and Next.js");
  assert.equal(displayUrl("https://www.linkedin.com/in/calebmills1"), "linkedin.com/in/calebmills1");
  assert.equal(displayUrl("https://github.com/Rakvadium/"), "github.com/Rakvadium");
  assert.equal(displayHost("https://www.genhealthaz.com/about"), "genhealthaz.com");
  assert.equal(initials("Caleb Mills"), "CM");
  assert.equal(initials("Maximiliana de la Cruz-Villanueva"), "MC");
  assert.equal(initials("Prince"), "P");
  assert.equal(slugify("KensieMae Senior Full-Stack Engineer"), "kensiemae-senior-full-stack-engineer");
});
