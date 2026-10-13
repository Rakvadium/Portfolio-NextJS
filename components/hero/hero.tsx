import { Mail } from "lucide-react";
import type { HeroView } from "@/app/data/site";
import { ButtonLink } from "@/components/ui/button-link";
import { Tile } from "@/components/ui/tile";
import { Masthead } from "./masthead";
import { Portrait } from "./portrait";
import { QuickFacts } from "./quick-facts";
import { HeroName, HeroPortrait } from "./scroll-motion";

export function Hero({ hero }: { hero: HeroView }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-12">
      <Masthead hero={hero} />
      <Tile glow="amber" motion="enter" className="lg:col-span-8">
        <div className="flex h-full flex-col gap-6 p-5 sm:p-8 lg:p-10">
          <div className="flex items-center gap-4 max-lg:hidden">
            <div className="min-w-0">
              <HeroName className="font-display text-[76px] font-extrabold leading-[0.95] tracking-[-0.035em]">{hero.name}</HeroName>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-ink">
                {hero.title}
                <span aria-hidden className="motion-draw-x bg-brand mt-1.5 block h-[2px] w-40 rounded-full" />
              </p>
            </div>
          </div>

          <div>
            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-peach lg:hidden">About me</p>
            <p className="max-w-2xl text-[17px] leading-[1.6] text-ink lg:text-lg lg:leading-relaxed lg:text-body">{hero.headline}</p>
          </div>

          <QuickFacts facts={hero.facts} coreStack={hero.coreStack} />

          <div className="mt-auto flex flex-wrap items-center gap-2.5">
            <ButtonLink tone="brand" href="#projects" arrow="down">
              View work
            </ButtonLink>
            <ButtonLink tone="ghost" href={hero.email.href} icon={Mail}>
              Email me
            </ButtonLink>
            <ButtonLink tone="quiet" href="#experience" arrow="right">
              Experience
            </ButtonLink>
          </div>
        </div>
      </Tile>

      <HeroPortrait className="hidden lg:col-span-4 lg:block">
        <Portrait portrait={hero.portrait} name={hero.name} location={hero.location} />
      </HeroPortrait>
    </div>
  );
}
