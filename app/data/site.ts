// The view model. One pure function turns authored Content into exactly what components render.
// Components receive slices of `Site` as props and never format dates, count things, strip
// protocols, or compose sentences. Every derived string in the UI is born here, once.
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

/* ------------------------------------------------------------- view types */

/**
 * One entry per `sections` item, in page order. Drives the top-bar nav, the mobile menu, and the
 * page's <section> shells. `heading` is set for sections that open with a SectionHeading
 * (Skills, Experience, Projects); Home has the h1 and Contact has its own "Get in touch" heading.
 */
export type SectionView = {
  readonly id: SectionId;
  readonly label: string;
  readonly href: `#${SectionId}`;
  readonly heading?: { readonly title: string; readonly intro: string };
};

/** Every way to reach Caleb. Top-bar icons and contact rows are both filtered from this one list. */
export type ChannelKind = "email" | "linkedin" | "github" | "phone";
export type Channel = {
  readonly kind: ChannelKind;
  /** Row label: "Email", "LinkedIn". */
  readonly label: string;
  /** Icon-button accessible name: "GitHub", "Email caleb.mills.1221@proton.me". */
  readonly accessibleName: string;
  /** What the contact row shows: "caleb.mills.1221@proton.me", "linkedin.com/in/calebmills1". */
  readonly display: string;
  readonly href: string;
  /** http(s) links open in a new tab with rel=noopener. */
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
  /** The "Email me" CTA. */
  readonly email: Channel;
  readonly facts: readonly Fact[];
  readonly coreStack: readonly string[];
};

export type SkillsView = {
  readonly groups: Content["skillGroups"];
  readonly footnote: string;
};

export type RoleView = {
  /** Stable key and DOM id stem: "kensiemae-senior-full-stack-engineer". */
  readonly id: string;
  readonly title: string;
  /** legalName ?? name */
  readonly company: string;
  readonly location: string;
  /** "2023 – 2026" */
  readonly years: string;
  /** "Aug 2023 – Oct 2026" */
  readonly dates: string;
  readonly highlights: Role["highlights"];
};

export type ProjectView = Omit<Project, "url" | "repoUrl"> & {
  readonly url: string;
  /** "genhealthaz.com", for "Visit genhealthaz.com". */
  readonly host: string;
  readonly repoUrl?: string;
};

export type ContactView = { readonly blurb: string; readonly email: Channel; readonly channels: readonly Channel[] };

export type FooterView = { readonly copyright: string; readonly tagline: string };

export type Site = {
  readonly meta: { readonly title: string; readonly description: string };
  readonly sections: readonly [SectionView, ...SectionView[]];
  readonly brand: Brand;
  /** Top-bar icon buttons, in display order: GitHub, LinkedIn, Email. */
  readonly social: readonly Channel[];
  readonly hero: HeroView;
  readonly skills: SkillsView;
  readonly roles: readonly [RoleView, ...RoleView[]];
  readonly projects: readonly ProjectView[];
  readonly contact: ContactView;
  readonly footer: FooterView;
};

/* ------------------------------------------------------------- derivation */

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

/**
 * Pure. Same input -> same Site. `today` is the only clock input; it resolves "present" periods
 * and the copyright year. app/page.tsx is a server component, so this runs at build/render time
 * on the server only, and the client never recomputes it: no year-boundary hydration mismatch.
 *
 * Throws when an invariant breaks (roles newest first, an engineering role exists, unique project
 * slugs), so a bad content edit fails `next build` and the Storybook build loudly.
 */
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

/** The site as authored. Imported by app/page.tsx, app/layout.tsx (metadata), and stories. */
export const site: Site = buildSite(authored, todayYearMonth());
