// Pure display formatting. Erasable TS only (no enums, no namespaces), so `node --test` runs it
// with Node 22's built-in type stripping.
import type { Period, YearMonth } from "./portfolio.ts";

const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;
const DASH = " – "; // spaced en dash, as G rendered ranges
const PRESENT = "Present";

const NUMBER_WORDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
] as const;

/** { year: 2023, month: 8 } -> "Aug 2023" */
export function formatYearMonth(ym: YearMonth): string {
  return `${MONTH_ABBR[ym.month - 1]} ${ym.year}`;
}

/** Explorer panel / accordion body: "Aug 2023 – Oct 2026", or "Aug 2023 – Present". */
export function formatDateRange(period: Period): string {
  const end = period.end === "present" ? PRESENT : formatYearMonth(period.end);
  return `${formatYearMonth(period.start)}${DASH}${end}`;
}

/** Explorer tab / accordion summary: "2023 – 2026"; a single year when start and end share it; "2023 – Present". */
export function formatYearSpan(period: Period): string {
  const start = String(period.start.year);
  if (period.end === "present") return `${start}${DASH}${PRESENT}`;
  return period.end.year === period.start.year ? start : `${start}${DASH}${period.end.year}`;
}

/** Whole years from `from` to `to`, month-accurate. Aug 2017 -> Oct 2026 = 9. */
export function wholeYearsBetween(from: YearMonth, to: YearMonth): number {
  return to.year - from.year - (to.month < from.month ? 1 : 0);
}

/** 0..12 -> "zero".."twelve"; larger numbers stay digits. Used for "Four roles at ...". */
export function numberWord(n: number): string {
  return NUMBER_WORDS[n] ?? String(n);
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** ["a","b","c"] -> "a, b, and c". Intl.ListFormat gives the same output on server and client. */
export function listToSentence(items: readonly string[]): string {
  return new Intl.ListFormat("en", { style: "long", type: "conjunction" }).format(items);
}

/** "https://www.linkedin.com/in/calebmills1/" -> "linkedin.com/in/calebmills1" */
export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

/** Host only: "https://www.genhealthaz.com/x" -> "genhealthaz.com" */
export function displayHost(url: string): string {
  return new URL(url).host.replace(/^www\./, "");
}

/** "Caleb Mills" -> "CM" (first letter of the first and last word). */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/);
  const first = words[0] ?? "";
  const last = words.length > 1 ? words[words.length - 1] : "";
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

/** "KensieMae Senior Full-Stack Engineer" -> "kensiemae-senior-full-stack-engineer" */
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
