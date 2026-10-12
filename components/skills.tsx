// Section body for #skills (the heading comes from <Section>): one tile per group with its
// "what for" note and chips, then the footnote line. Static: no carousel, no client code beyond Tile.
import type { SkillsView } from "@/app/data/site";
import { Chip } from "@/components/ui/chip";
import { Tile, type Glow } from "@/components/ui/tile";

const groupGlow: readonly Glow[] = ["amber", "coral", "magenta"];

export function Skills({ skills }: { skills: SkillsView }) {
  return (
    <>
      <ul className="grid gap-3 sm:gap-4 md:grid-cols-3">
        {skills.groups.map((group, i) => (
          <Tile key={group.id} as="li" glow={groupGlow[i % groupGlow.length]} motion="reveal" aria-labelledby={`skills-${group.id}`}>
            <div className="p-5 sm:p-7">
              <h3 id={`skills-${group.id}`} className="font-display text-xl font-bold tracking-tight sm:text-2xl">
                {group.title}
              </h3>
              <p className="mt-1 text-sm text-soft">{group.note}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {group.skills.map((skill) => (
                  <li key={skill}>
                    <Chip>{skill}</Chip>
                  </li>
                ))}
              </ul>
            </div>
          </Tile>
        ))}
      </ul>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-body sm:mt-5">{skills.footnote}</p>
    </>
  );
}
