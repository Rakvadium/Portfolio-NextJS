import type { Brand } from "@/app/data/site";
import { BrandReveal } from "./scroll-motion";

export function BrandMark({ brand }: { brand: Brand }) {
  return (
    <a href="#home" aria-label={`${brand.name}, back to top`} className="flex min-w-0 items-center gap-2.5">
      <span
        aria-hidden
        className="bg-brand flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-display text-sm font-extrabold text-canvas"
      >
        {brand.monogram}
      </span>
      <BrandReveal className="flex min-w-0 flex-col leading-tight">
        <span className="truncate font-display text-[17px] font-bold tracking-tight">{brand.name}</span>
        <span className="truncate text-xs text-soft">{brand.title}</span>
      </BrandReveal>
    </a>
  );
}
