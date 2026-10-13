import {
  content as authored,
  sections,
  type Content,
  type Image,
  type Project,
  type Role,
  type SectionId,
  type YearMonth,
} from "./portfolio.ts";
import {
  capitalize,
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
import { mapNonEmpty } from "../../lib/non-empty.ts";

export type SectionView = {
  readonly id: SectionId;
  readonly label: string;
  readonly href: `#${SectionId}`;
  readonly heading?: { readonly title: string; readonly intro: string };
};

export type ChannelKind = "email" | "linkedin" | "github" | "phone";
export type Channel = {
  readonly kind: ChannelKind;
  readonly label: string;
  readonly accessibleName: string;
  readonly display: string;
  readonly href: string;
  readonly external: boolean;
};

export type Brand = { readonly name: string; readonly title: string; readonly monogram: string };

export type FactKind = "experience" | "location" | "recentRole";
export type Fact = { readonly kind: FactKind; readonly label: string; readonly value: string; readonly detail?: string };

export type HeroView = {
  readonly name: string;
  readonly title: string;
  readonly headline: string;
  readonly location: string;
  readonly portrait: Image;
  readonly email: Channel;
  readonly facts: readonly Fact[];
  readonly coreStack: readonly string[];
};

export type SkillsView = {
  readonly groups: Content["skillGroups"];
  readonly footnote: string;
};

export type RoleView = {
  readonly id: string;
  readonly title: string;
  readonly company: string;
  readonly location: string;
  readonly years: string;
  readonly dates: string;
  readonly highlights: Role["highlights"];
};

export type ProjectView = Omit<Project, "url" | "repoUrl"> & {
  readonly url: string;
  readonly host: string;
  readonly repoUrl?: string;
};

export type ContactView = { readonly blurb: string; readonly email: Channel; readonly channels: readonly Channel[] };

export type FooterView = { readonly copyright: string; readonly tagline: string };

export type Site = {
  readonly meta: { readonly title: string; readonly description: string };
  readonly sections: readonly [SectionView, ...SectionView[]];
  readonly brand: Brand;
  readonly social: readonly Channel[];
  readonly hero: HeroView;
  readonly skills: SkillsView;
  readonly roles: readonly [RoleView, ...RoleView[]];
  readonly projects: readonly ProjectView[];
  readonly contact: ContactView;
  readonly footer: FooterView;
};

const compareYearMonth = (a: YearMonth, b: YearMonth) => a.year - b.year || a.month - b.month;

function assertInvariants(c: Content): void {
  c.roles.forEach((role, i) => {
    const next = c.roles[i + 1];
    if (next && compareYearMonth(role.period.start, next.period.start) < 0) {
      throw new Error(`portfolio.ts: roles must be newest first ("${next.title}" starts after "${role.title}")`);
    }
  });
  if (!c.roles.some((role) => role.engineering)) {
    throw new Error("portfolio.ts: at least one role needs `engineering: true` to derive the years fact");
  }
  const slugs = c.projects.map((p) => p.slug);
  if (new Set(slugs).size !== slugs.length) throw new Error(`portfolio.ts: duplicate project slug in ${slugs.join(", ")}`);
}

function plural(n: number, one: string, many: string): string {
  return `${capitalize(numberWord(n))} ${n === 1 ? one : many}`;
}

export function buildSite(c: Content, today: YearMonth): Site {
  assertInvariants(c);
  const { profile } = c;
  const [latest] = c.roles;

  const companiesOldestFirst = [...new Set([...c.roles].reverse().map((r) => r.company.legalName ?? r.company.name))];
  const headings: Partial<Record<SectionId, { title: string; intro: string }>> = {
    skills: { title: "Skills", intro: `I work mostly in ${listToSentence(c.coreStack)}.` },
    experience: {
      title: "Experience",
      intro: `${plural(c.roles.length, "role", "roles")} at ${listToSentence(companiesOldestFirst)}, newest first. Pick a role to read everything I did there.`,
    },
    projects: {
      title: "Projects",
      intro:
        c.projects.length === 1
          ? "One site I built and launched: what it is, what I built, and the tech behind it."
          : `${plural(c.projects.length, "site", "sites")} I built and launched: what each one is, what I built, and the tech behind it.`,
    },
  };

  const email: Channel = {
    kind: "email",
    label: "Email",
    accessibleName: `Email ${profile.email}`,
    display: profile.email,
    href: `mailto:${profile.email}`,
    external: false,
  };
  const linkedin: Channel = {
    kind: "linkedin",
    label: "LinkedIn",
    accessibleName: "LinkedIn",
    display: displayUrl(profile.linkedin),
    href: profile.linkedin,
    external: true,
  };
  const github: Channel = {
    kind: "github",
    label: "GitHub",
    accessibleName: "GitHub",
    display: displayUrl(profile.github),
    href: profile.github,
    external: true,
  };
  const phone: Channel = {
    kind: "phone",
    label: "Phone",
    accessibleName: `Call ${profile.phone.display}`,
    display: profile.phone.display,
    href: `tel:${profile.phone.tel}`,
    external: false,
  };

  const careerFrom = [...c.roles].reverse().find((r) => r.engineering)!.period.start;
  const careerTo = latest.period.end === "present" ? today : latest.period.end;
  const years = `${wholeYearsBetween(careerFrom, careerTo)}+ years`;

  return {
    meta: {
      title: `${profile.name} | ${profile.title}`,
      description: `${profile.name} is a frontend-skewed software engineer in ${profile.location} with ${years} of experience in ${listToSentence(c.coreStack)}.`,
    },
    sections: mapNonEmpty<(typeof sections)[number], SectionView>(sections, (s) => ({ id: s.id, label: s.label, href: `#${s.id}` as const, heading: headings[s.id] })),
    brand: { name: profile.name, title: profile.title, monogram: initials(profile.name) },
    social: [github, linkedin, email],
    hero: {
      name: profile.name,
      title: profile.title,
      headline: profile.headline,
      location: profile.location,
      portrait: profile.portrait,
      email,
      facts: [
        { kind: "experience", label: "Experience", value: `${years} as a software engineer` },
        { kind: "location", label: "Location", value: `Based in ${profile.location}` },
        {
          kind: "recentRole",
          label: "Most recent role",
          value: `${latest.title} at ${latest.company.name}`,
          detail: formatDateRange(latest.period),
        },
      ],
      coreStack: c.coreStack,
    },
    skills: { groups: c.skillGroups, footnote: c.skillsFootnote },
    roles: mapNonEmpty(c.roles, (r) => ({
      id: slugify(`${r.company.name} ${r.title}`),
      title: r.title,
      company: r.company.legalName ?? r.company.name,
      location: r.location,
      years: formatYearSpan(r.period),
      dates: formatDateRange(r.period),
      highlights: r.highlights,
    })),
    projects: c.projects.map((p) => ({ ...p, host: displayHost(p.url) })),
    contact: {
      blurb: `I'm ${profile.name}, a ${profile.title.toLowerCase()} based in ${profile.location}. Email, call, or message me on LinkedIn.`,
      email,
      channels: [email, linkedin, github, phone],
    },
    footer: { copyright: `© ${today.year} ${profile.name}`, tagline: `${profile.title} · ${profile.location}` },
  };
}

function todayYearMonth(): YearMonth {
  const d = new Date();
  return { year: d.getFullYear(), month: (d.getMonth() + 1) as YearMonth["month"] };
}

export const site: Site = buildSite(authored, todayYearMonth());
