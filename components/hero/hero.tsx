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
      <ProtoMasthead hero={hero} />
      <Tile glow="amber" motion="enter" className="lg:col-span-8">
        <div className="flex h-full flex-col gap-6 p-5 sm:p-8 lg:p-10">
          <div data-proto-incard-identity className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/10 lg:hidden">
              <Image src={hero.portrait.src} alt={hero.portrait.alt} fill sizes="64px" className="object-cover" />
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

          <div>
            <p data-proto-eyebrow className="mb-2.5 hidden text-[11px] font-semibold uppercase tracking-[0.2em] text-peach">
              About me
            </p>
            <p data-proto-lead className="max-w-2xl text-[15px] leading-relaxed text-body sm:text-lg">
              {hero.headline}
            </p>
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

/**
 * PROTOTYPE (branch prototype/mobile-nav, ?nav=H|I): the identity broken out of the intro card as a
 * masthead above it. `hidden` everywhere by default; the H/I variants reveal it below lg (and hide
 * the in-card identity) with a style tag, so exactly one h1 is rendered per breakpoint. The
 * `data-m` hooks are what variant H measures and morphs into the top bar.
 */
function ProtoMasthead({ hero }: { hero: HeroView }) {
  return (
    <div data-proto-masthead className="hidden px-5 pb-5 pt-1">
      <div
        data-m="avatar"
        className="relative h-20 w-20 rounded-[24px] bg-[linear-gradient(135deg,var(--color-amber),var(--color-coral)_50%,var(--color-magenta))] p-[2px] shadow-[0_14px_36px_-16px_rgb(229_51_143/0.7)]"
      >
        <div className="relative h-full w-full overflow-hidden rounded-[22px] bg-canvas">
          <Image src={hero.portrait.src} alt={hero.portrait.alt} fill sizes="80px" className="object-cover" />
        </div>
      </div>
      <h1 className="mt-4 font-display text-[44px] font-extrabold leading-[0.95] tracking-[-0.035em]">
        <span data-m="name" className="inline-block whitespace-nowrap">
          {hero.name}
        </span>
      </h1>
      <p className="mt-2.5 text-lg font-semibold tracking-tight text-ink">
        <span data-m="title" className="inline-block whitespace-nowrap">
          {hero.title}
        </span>
        <span data-m-underline aria-hidden className="motion-draw-x bg-brand mt-2 block h-[2px] w-28 rounded-full" />
      </p>
    </div>
  );
}
