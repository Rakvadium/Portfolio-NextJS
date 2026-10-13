import { content, type Content, type Role, type YearMonth } from "./portfolio.ts";
import { buildSite, type Site } from "./site.ts";

export const FIXED_TODAY: YearMonth = { year: 2026, month: 10 };

const staffRole: Role = {
  title: "Staff Frontend Engineer",
  company: { name: "Northwind Labs", legalName: "Northwind Labs, Inc." },
  location: "Remote",
  period: { start: { year: 2026, month: 11 }, end: "present" },
  engineering: true,
  highlights: ["Leads the design system and the web platform team's frontend architecture."],
};

const internRole: Role = {
  title: "Web Development Intern",
  company: { name: "Treasure Valley Print Co." },
  location: "Boise, Idaho",
  period: { start: { year: 2014, month: 5 }, end: { year: 2015, month: 6 } },
  engineering: false,
  highlights: ["Maintained the shop's WordPress site and built its first online proof approval form."],
};

const variants = {
  manyRoles: { ...content, roles: [staffRole, ...content.roles, internRole] },
  longName: {
    ...content,
    profile: {
      ...content.profile,
      name: "Maximiliana de la Cruz-Villanueva",
      title: "Principal Frontend Platform Engineer",
    },
  },
  oneProject: { ...content, projects: content.projects.slice(0, 1) },
} satisfies Record<string, Content>;

type FixtureName = keyof typeof variants;

export const fixtures = Object.fromEntries(
  Object.entries(variants).map(([name, c]) => [name, buildSite(c, FIXED_TODAY)]),
) as Record<FixtureName, Site>;
