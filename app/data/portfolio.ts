// Authored content. The only file a content edit touches.
// Everything a component shows is either written here or derived from it in ./site.ts.
// No formatting, no display strings that restate another field, no counts.

/* ------------------------------------------------------------------ types */

export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type YearMonth = { readonly year: number; readonly month: Month };
/** `end: "present"` for a role still held. Display strings are derived (format.ts), never stored. */
export type Period = { readonly start: YearMonth; readonly end: YearMonth | "present" };

/** A path served from /public. next/image and Storybook staticDirs both resolve it. */
export type PublicPath = `/${string}`;
export type HttpsUrl = `https://${string}`;
export type Image = { readonly src: PublicPath; readonly alt: string };

export type Profile = {
  readonly name: string;
  readonly title: string;
  readonly location: string;
  /** Hero lead paragraph. Written for the hero; not split out of a longer bio at runtime. */
  readonly headline: string;
  readonly portrait: Image;
  readonly email: string;
  /** `tel` is E.164 so the link dials from anywhere; `display` is what people read. */
  readonly phone: { readonly display: string; readonly tel: `+${string}` };
  readonly github: `https://github.com/${string}`;
  readonly linkedin: `https://www.linkedin.com/in/${string}`;
  readonly website: HttpsUrl;
};

export type Company = {
  /** Short name for running prose ("Senior Full-Stack Engineer at KensieMae"). */
  readonly name: string;
  /** Formal name for the experience list. Defaults to `name`. */
  readonly legalName?: string;
};

export type Role = {
  readonly title: string;
  readonly company: Company;
  readonly location: string;
  readonly period: Period;
  /** Counts toward the derived "N+ years as a software engineer" fact. */
  readonly engineering: boolean;
  /** Non-empty: a role with nothing to say does not ship. */
  readonly highlights: readonly [string, ...string[]];
};

export type SkillGroup = {
  readonly id: string;
  readonly title: string;
  /** The short "what for" note shown beside the group title. */
  readonly note: string;
  readonly skills: readonly [string, ...string[]];
};

export type Project = {
  /** Stable id for React keys. */
  readonly slug: string;
  readonly title: string;
  /** One-line label above the title ("Clinic website rebuild"). */
  readonly kind: string;
  /** "What it is". */
  readonly summary: string;
  /** "What I built". */
  readonly contribution: string;
  readonly technologies: readonly [string, ...string[]];
  readonly screenshot: Image;
  readonly url: HttpsUrl;
  /** Present only for open-source projects. Optional field, not a union of object shapes. */
  readonly repoUrl?: `https://github.com/${string}`;
};

/* --------------------------------------------------------------- sections */

/**
 * Single source of truth for page order, nav labels, and section ids.
 * `SectionId` is derived from it; components/home-page.tsx maps every id to a body with
 * `satisfies Record<SectionId, ...>`, so a nav entry without a section (or the reverse) fails tsc.
 */
export const sections = [
  { id: "home", label: "Home" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
] as const satisfies readonly { readonly id: string; readonly label: string }[];

export type SectionId = (typeof sections)[number]["id"];

/* ---------------------------------------------------------------- content */

export const profile = {
  name: "Caleb Mills",
  title: "Senior Frontend Engineer",
  location: "Meridian, ID",
  // Was bio paragraph 1 run through .replace("I'm a frontend skewed", "A frontend-skewed").
  // "with 9+ years of experience" is cut: the Quick facts row derives and shows it.
  headline:
    "A frontend-skewed software engineer. I obsess over intuitive UI and UX, and I also build the solid backends and APIs behind them.",
  portrait: { src: "/calebHeadshotAi.jpg", alt: "Portrait of Caleb Mills" },
  email: "caleb.mills.1221@proton.me",
  phone: { display: "(208) 949-8754", tel: "+12089498754" },
  github: "https://github.com/Rakvadium",
  linkedin: "https://www.linkedin.com/in/calebmills1",
  website: "https://www.caleb-mills.dev",
} as const satisfies Profile;

const kensieMae: Company = { name: "KensieMae", legalName: "KensieMae, LLC" };
const velma: Company = { name: "Velma.com" };

/** Newest first. site.ts relies on this order for "most recent role"; it asserts it at module load. */
export const roles = [
  {
    title: "Senior Full-Stack Engineer",
    company: kensieMae,
    location: "Remote",
    period: { start: { year: 2023, month: 8 }, end: { year: 2026, month: 10 } },
    engineering: true,
    highlights: [
      "Kept ownership of Connector after the acquisition and continued building out its React frontend as it served about 80 clients.",
      "Built B2B integration platforms that keep data in sync between systems with scheduled jobs and webhooks.",
      "Rebuilt a legacy email and print template builder in Vue and GrapesJS, embedded inside the older AngularJS app instead of a full rewrite.",
      "Stayed on a product rebrand as teammates were reassigned to other priorities, and took on more of the work: planned it, reviewed pull requests for 3 engineers, drove testing, and got new developers up to speed on the codebase.",
      "Moved auto-campaign execution from a standalone AWS EC2 server to Azure App Service WebJobs, and kept the hybrid Azure and AWS link to the Velma Fulfillment Service (VFS) marketing engine working.",
    ],
  },
  {
    title: "Senior Software Engineer",
    company: velma,
    location: "Nampa, Idaho",
    period: { start: { year: 2022, month: 1 }, end: { year: 2023, month: 8 } },
    engineering: true,
    highlights: [
      "Owned the frontend on our 4-person team and set its architecture.",
      "Shipped our first micro-frontend component with Module Federation to 4 host apps: a job tracker for email, print, and SMS jobs that releases on its own cycle without redeploying the apps that use it.",
      "Designed a per-client, per-role feature entitlement model in the Account Service that controls which apps, components, and views each user sees, and set up the data foundation for tiered, per-feature pricing.",
    ],
  },
  {
    title: "Software Engineer",
    company: velma,
    location: "Nampa, Idaho",
    period: { start: { year: 2017, month: 8 }, end: { year: 2022, month: 1 } },
    engineering: true,
    highlights: [
      "Designed and built the complete React frontend for Connector, a data-bridge platform. It grew to about 80 clients, automated work that used to take 10 to 30+ hours by hand per case, became a primary revenue driver, and was a key factor in Velma’s acquisition by KensieMae.",
      "Built Node.js/TypeScript and C#/.NET microservices for the VFS marketing engine, which ran high-volume automated campaigns.",
      "Set up AWS infrastructure (API Gateway, CloudFront, S3, Lambda, DynamoDB, ECS) and CodePipeline CI/CD with approval gates, so the same build moved from test to production.",
    ],
  },
  {
    title: "Auto-Campaign Specialist",
    company: velma,
    location: "Nampa, Idaho",
    period: { start: { year: 2015, month: 7 }, end: { year: 2017, month: 8 } },
    // Not counted: "9+ years as a software engineer" starts at the Aug 2017 engineering role.
    engineering: false,
    highlights: [
      "Built and tested automated marketing campaigns and wrote custom JavaScript for dynamic email and print templates, then moved into an engineering role.",
    ],
  },
] as const satisfies readonly Role[];

/** Replaces the old flat `skills` list and G's hand-copied SKILL_GROUPS. The flat list is derived. */
export const skillGroups = [
  {
    id: "frontend",
    title: "Frontend",
    note: "Interfaces and apps",
    skills: ["TypeScript", "React", "Next.js", "Vue/Nuxt", "React Native", "UI/UX"],
  },
  { id: "backend", title: "Backend", note: "Services and data", skills: ["Node.js", "C#/.NET", "REST APIs", "SQL"] },
  { id: "cloud", title: "Cloud", note: "Hosting and infrastructure", skills: ["AWS", "Azure"] },
] as const satisfies readonly SkillGroup[];

export type SkillName = (typeof skillGroups)[number]["skills"][number];

/** Hero "Core stack" chips and the Skills intro sentence. Typed against declared skills: a typo fails tsc. */
export const coreStack = ["React", "TypeScript", "Next.js", "Node.js"] as const satisfies readonly SkillName[];

/** Skills section closing line (was bio paragraph 2, sentence 3). */
export const skillsFootnote = "I use AI coding agents every day, and I spend a lot of time validating what they build.";

export const projects = [
  {
    slug: "genhealthaz",
    title: "GenHealthAZ",
    kind: "Clinic website rebuild",
    summary:
      "The website for GenHealth’s outpatient mental health clinic, covering psychiatry, therapy, TMS (transcranial magnetic stimulation), and Spravato care across Arizona and Idaho.",
    contribution: "I rebuilt and launched the site, including a Convex-backed CMS.",
    // "NextJS" -> "Next.js", "ConvexDB" -> "Convex": product names as their vendors write them.
    technologies: ["React", "Next.js", "TypeScript", "Convex"],
    screenshot: { src: "/genhealthaz.png", alt: "GenHealthAZ home page screenshot" },
    url: "https://www.genhealthaz.com",
  },
  {
    slug: "uvsdecks-gg",
    title: "UVSDECKS.GG",
    kind: "Side project I build and run",
    summary: "A deck builder and community site for the UniVersus card game.",
    contribution:
      "Real-time team deck editing, and a card import pipeline that pulls card data out of images with GPT-4o vision and sends it to a human review queue.",
    technologies: ["React", "Next.js", "TypeScript", "Convex"],
    screenshot: { src: "/project1.png", alt: "UVSDECKS.GG deck builder screenshot" },
    url: "https://www.uvsdecks.gg",
    repoUrl: "https://github.com/Rakvadium/uvs-decks-gg",
  },
] as const satisfies readonly Project[];

/** The whole authored record, for buildSite() and for Storybook fixtures that vary one field. */
export type Content = {
  readonly profile: Profile;
  readonly roles: readonly [Role, ...Role[]];
  readonly skillGroups: readonly SkillGroup[];
  readonly coreStack: readonly string[];
  readonly skillsFootnote: string;
  readonly projects: readonly Project[];
};

export const content: Content = { profile, roles, skillGroups, coreStack, skillsFootnote, projects };
