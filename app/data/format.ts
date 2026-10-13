// Pure display formatting. Erasable TS only (no enums, no namespaces), so `node --test` runs it
// with Node 22's built-in type stripping.
import type { Period, YearMonth } from "./portfolio.ts";

const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;
const DASH = " – ";
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

function formatYearMonth(ym: YearMonth): string {
  return `${MONTH_ABBR[ym.month - 1]} ${ym.year}`;
}

export function formatDateRange(period: Period): string {
  const end = period.end === "present" ? PRESENT : formatYearMonth(period.end);
  return `${formatYearMonth(period.start)}${DASH}${end}`;
}

export function formatYearSpan(period: Period): string {
  const start = String(period.start.year);
  if (period.end === "present") return `${start}${DASH}${PRESENT}`;
  return period.end.year === period.start.year ? start : `${start}${DASH}${period.end.year}`;
}

export function wholeYearsBetween(from: YearMonth, to: YearMonth): number {
  return to.year - from.year - (to.month < from.month ? 1 : 0);
}

export function numberWord(n: number): string {
  return NUMBER_WORDS[n] ?? String(n);
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function listToSentence(items: readonly string[]): string {
  return new Intl.ListFormat("en", { style: "long", type: "conjunction" }).format(items);
}

export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

export function displayHost(url: string): string {
  return new URL(url).host.replace(/^www\./, "");
}

export function initials(name: string): string {
  const words = name.trim().split(/\s+/);
  const first = words[0] ?? "";
  const last = words.length > 1 ? words[words.length - 1] : "";
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
