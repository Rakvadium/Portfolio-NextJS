// Below lg: the identity broken out above the intro card (portrait in the brand ring, the page h1,
// the title with its gradient underline). Server-rendered and shown by a CSS breakpoint, so the
// first paint is already right. lg+ shows the in-card h1 instead: one h1 is exposed per breakpoint.
// On phones the mobile top bar morphs these pieces into itself as the page scrolls; it finds them
// by `data-masthead`, `data-morph-piece` and `data-masthead-underline`.
import type { HeroView } from "@/app/data/site";
import type { MorphPiece } from "@/components/mobile-nav/morph";
import { Avatar, identityType } from "@/components/ui/identity";
import { cn } from "@/lib/utils";

const piece = (p: MorphPiece) => ({ "data-morph-piece": p });

export function Masthead({ hero }: { hero: HeroView }) {
  return (
    <div data-masthead className="px-5 pb-5 pt-1 lg:hidden">
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
        <span data-masthead-underline aria-hidden className="motion-draw-x bg-brand mt-2 block h-[2px] w-28 rounded-full" />
      </p>
    </div>
  );
}
