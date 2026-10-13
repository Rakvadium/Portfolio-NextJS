import type { HeroView } from "@/app/data/site";
import { MORPH_DOM, type MorphPiece } from "@/components/mobile-nav/morph";
import { Avatar, identityType } from "@/components/ui/identity";
import { cn } from "@/lib/utils";

const piece = (p: MorphPiece) => ({ [MORPH_DOM.piece]: p });

export function Masthead({ hero }: { hero: HeroView }) {
  return (
    <div {...{ [MORPH_DOM.masthead]: "" }} className="px-5 pb-5 pt-1 lg:hidden">
      <Avatar {...piece("avatar")} portrait={hero.portrait} alt={hero.portrait.alt} size="masthead" glow />
      <h1 className={cn("mt-4", identityType.masthead.name)}>
        <span {...piece("name")} className="inline-block whitespace-nowrap">
          {hero.name}
        </span>
      </h1>
      <p className={cn("mt-2.5 text-ink", identityType.masthead.title)}>
        <span {...piece("title")} className="inline-block whitespace-nowrap">
          {hero.title}
        </span>
        <span {...{ [MORPH_DOM.underline]: "" }} aria-hidden className="motion-draw-x bg-brand mt-2 block h-[2px] w-28 rounded-full" />
      </p>
    </div>
  );
}
