// The large lg+ portrait tile: next/image fill (the desktop LCP candidate, so `priority`), a bottom fade
// to canvas, and the name / location caption. It is display:none below lg and `priority` still preloads
// it there: one extra preload on phones, in exchange for no client media query.
import Image from "next/image";
import { MapPin } from "lucide-react";
import type { Image as ImageData } from "@/app/data/portfolio";
import { Tile } from "@/components/ui/tile";
import { HeroPortraitImage } from "./scroll-motion";

export function Portrait({ portrait, name, location }: { portrait: ImageData; name: string; location: string }) {
  return (
    <Tile glow="magenta" motion="enter-fade" className="h-full min-h-[460px]">
      <HeroPortraitImage>
        <Image src={portrait.src} alt={portrait.alt} fill priority sizes="400px" className="object-cover" />
      </HeroPortraitImage>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-canvas/85 via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="text-[15px] font-semibold text-white">{name}</p>
        <p className="flex items-center gap-1.5 text-sm text-mute">
          <MapPin aria-hidden className="h-3.5 w-3.5" /> {location}
        </p>
      </div>
    </Tile>
  );
}
