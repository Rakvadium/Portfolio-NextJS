import type { Brand, Channel, SectionView } from "@/app/data/site";
import { BrandMark } from "./brand-mark";
import { ScrollProgress } from "./scroll-motion";
import { SectionNavigation } from "./section-navigation";
import { SocialLinks } from "./social-links";

type TopBarProps = {
  brand: Brand;
  sections: readonly [SectionView, ...SectionView[]];
  social: readonly Channel[];
};

export function TopBar({ brand, sections, social }: TopBarProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 hidden border-b border-white/[0.07] bg-canvas/75 backdrop-blur-xl lg:block">
      <div className="mx-auto flex h-(--bar-h) max-w-[1200px] items-center justify-between gap-3 px-4 sm:px-6">
        <BrandMark brand={brand} />
        <SectionNavigation sections={sections} />
        <SocialLinks channels={social} />
      </div>
      <ScrollProgress />
    </header>
  );
}
