import { test } from "node:test";
import assert from "node:assert/strict";
import { content } from "./portfolio.ts";
import { buildSite } from "./site.ts";
import { FIXED_TODAY, fixtures } from "./fixtures.ts";

const site = buildSite(content, FIXED_TODAY);

test("metadata keeps the title the verify harness asserts", () => {
  assert.equal(site.meta.title, "Caleb Mills | Senior Frontend Engineer");
  assert.equal(
    site.meta.description,
    "Caleb Mills is a frontend-skewed software engineer in Meridian, ID with 9+ years of experience in React, TypeScript, Next.js, and Node.js.",
  );
});

test("sections follow nav order and carry derived intros", () => {
  assert.deepEqual(
    site.sections.map((s) => s.href),
    ["#home", "#skills", "#experience", "#projects", "#contact"],
  );
  const intro = (id: string) => site.sections.find((s) => s.id === id)?.heading?.intro;
  assert.equal(intro("home"), undefined);
  assert.equal(intro("contact"), undefined);
  assert.equal(intro("skills"), "I work mostly in React, TypeScript, Next.js, and Node.js.");
  assert.equal(
    intro("experience"),
    "Four roles at Velma.com and KensieMae, LLC, newest first. Pick a role to read everything I did there.",
  );
  assert.equal(
    intro("projects"),
    "Two sites I built and launched: what each one is, what I built, and the tech behind it.",
  );
});

test("hero facts derive the years and the most recent role", () => {
  assert.deepEqual(site.hero.facts, [
    { kind: "experience", label: "Experience", value: "9+ years as a software engineer" },
    { kind: "location", label: "Location", value: "Based in Meridian, ID" },
    {
      kind: "recentRole",
      label: "Most recent role",
      value: "Senior Full-Stack Engineer at KensieMae",
      detail: "Aug 2023 – Oct 2026",
    },
  ]);
  assert.deepEqual(site.hero.coreStack, ["React", "TypeScript", "Next.js", "Node.js"]);
});

test("channels: top-bar order and contact rows", () => {
  assert.deepEqual(
    site.social.map((c) => [c.accessibleName, c.href, c.external]),
    [
      ["GitHub", "https://github.com/Rakvadium", true],
      ["LinkedIn", "https://www.linkedin.com/in/calebmills1", true],
      ["Email caleb.mills.1221@proton.me", "mailto:caleb.mills.1221@proton.me", false],
    ],
  );
  assert.deepEqual(
    site.contact.channels.map((c) => [c.label, c.display, c.href]),
    [
      ["Email", "caleb.mills.1221@proton.me", "mailto:caleb.mills.1221@proton.me"],
      ["LinkedIn", "linkedin.com/in/calebmills1", "https://www.linkedin.com/in/calebmills1"],
      ["GitHub", "github.com/Rakvadium", "https://github.com/Rakvadium"],
      ["Phone", "(208) 949-8754", "tel:+12089498754"],
    ],
  );
  assert.equal(
    site.contact.blurb,
    "I'm Caleb Mills, a senior frontend engineer based in Meridian, ID. Email, call, or message me on LinkedIn.",
  );
});

test("roles, projects, brand, footer", () => {
  assert.deepEqual(
    site.roles.map((r) => [r.id, r.company, r.years, r.dates]),
    [
      ["kensiemae-senior-full-stack-engineer", "KensieMae, LLC", "2023 – 2026", "Aug 2023 – Oct 2026"],
      ["velma-com-senior-software-engineer", "Velma.com", "2022 – 2023", "Jan 2022 – Aug 2023"],
      ["velma-com-software-engineer", "Velma.com", "2017 – 2022", "Aug 2017 – Jan 2022"],
      ["velma-com-auto-campaign-specialist", "Velma.com", "2015 – 2017", "Jul 2015 – Aug 2017"],
    ],
  );
  assert.deepEqual(
    site.projects.map((p) => [p.title, p.host, p.repoUrl]),
    [
      ["GenHealthAZ", "genhealthaz.com", undefined],
      ["UVSDECKS.GG", "uvsdecks.gg", "https://github.com/Rakvadium/uvs-decks-gg"],
    ],
  );
  assert.deepEqual(site.brand, { name: "Caleb Mills", title: "Senior Frontend Engineer", monogram: "CM" });
  assert.deepEqual(site.footer, { copyright: "© 2026 Caleb Mills", tagline: "Senior Frontend Engineer · Meridian, ID" });
});

test("fixtures: derived copy follows the data", () => {
  assert.equal(
    fixtures.oneProject.sections.find((s) => s.id === "projects")?.heading?.intro,
    "One site I built and launched: what it is, what I built, and the tech behind it.",
  );
  assert.equal(
    fixtures.manyRoles.sections.find((s) => s.id === "experience")?.heading?.intro,
    "Six roles at Treasure Valley Print Co., Velma.com, KensieMae, LLC, and Northwind Labs, Inc., newest first. Pick a role to read everything I did there.",
  );
  assert.equal(fixtures.manyRoles.roles[0].dates, "Nov 2026 – Present");
  assert.equal(fixtures.longName.brand.monogram, "MC");
});

test("invariants fail loudly", () => {
  assert.throws(
    () => buildSite({ ...content, roles: [content.roles[3], content.roles[0]] }, FIXED_TODAY),
    /newest first/,
  );
  assert.throws(
    () => buildSite({ ...content, projects: [content.projects[0], content.projects[0]] }, FIXED_TODAY),
    /duplicate project slug/,
  );
});
