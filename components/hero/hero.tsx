// The home section body. 12-col grid: the lead tile and, from lg, the portrait tile. The server HTML
// is the at-top pose; the scroll-linked pieces are the HeroName and HeroPortrait islands.
import Image from "next/image";
import { Mail } from "lucide-react";
import type { HeroView } from "@/app/data/site";
import { ButtonLink } from "@/components/ui/button-link";
import { Tile } from "@/components/ui/tile";
import { Portrait } from "./portrait";
import { QuickFacts } from "./quick-facts";
import { HeroName, HeroPortrait } from "./scroll-motion";

export function Hero({ hero }: { hero: HeroView }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-12">
      <Tile glow="amber" motion="enter" className="lg:col-span-8">
        <div className="flex h-full flex-col gap-6 p-5 sm:p-8 lg:p-10">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/10 lg:hidden">
              <Image src={hero.portrait.src} alt={hero.portrait.alt} fill loading="eager" sizes="64px" className="object-cover" />
            </div>
            <div className="min-w-0">
              <HeroName className="font-display text-[40px] font-extrabold leading-[0.95] tracking-[-0.035em] sm:text-6xl lg:text-[76px]">
                {hero.name}
              </HeroName>
              <p className="mt-2 text-lg font-semibold tracking-tight text-ink sm:mt-3 sm:text-2xl">
                {hero.title}
                <span aria-hidden className="motion-draw-x bg-brand mt-1.5 block h-[2px] w-28 rounded-full sm:w-40" />
              </p>
            </div>
          </div>

          <p className="max-w-2xl text-[15px] leading-relaxed text-body sm:text-lg">{hero.headline}</p>

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
