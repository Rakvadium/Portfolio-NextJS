// Story decorators: the only Storybook-specific rendering code. Components contain none.
import type { Decorator } from "@storybook/nextjs-vite";
import { fontVariables } from "../app/fonts";
import { site } from "../app/data/site";

/**
 * Every story (global, in preview.tsx): the next/font CSS variables on a root that also sets font-sans,
 * the canvas background, and ink color, which is what <html>/<body> get in app/layout.tsx.
 */
export const withSiteRoot: Decorator = (Story) => (
  <div className={`${fontVariables} bg-canvas font-sans text-ink antialiased`}>
    <Story />
  </div>
);

/**
 * For fixed-position and scroll-linked components (TopBar, SectionNavigation, BrandMark): renders the
 * story, then one tall stub <section id> per `site.sections` entry, so the active-section listener has
 * targets, hash links scroll, and scroll-linked motion has range.
 * Pair with `parameters: { layout: "fullscreen", docs: { story: { inline: false, iframeHeight } } }` and
 * `tags: ["!autodocs"]`, so `position: fixed` binds to the story's own iframe.
 * `stubs: false` renders a 300vh spacer instead, for stories whose own content provides the sections.
 */
export function withScrollStage({ stubs = true }: { stubs?: boolean } = {}): Decorator {
  function ScrollStage(Story: Parameters<Decorator>[0]) {
    return (
      <>
        <Story />
        {stubs ? (
          <main className="mx-auto max-w-[1200px] px-4 pt-16 sm:px-6">
            {site.sections.map((s) => (
              <section
                key={s.id}
                id={s.id}
                aria-label={`${s.label} placeholder`}
                className="flex min-h-[110vh] items-start border-b border-white/10 pt-10"
              >
                <p className="font-display text-4xl font-bold text-soft">{s.label}</p>
              </section>
            ))}
          </main>
        ) : (
          <div aria-hidden className="h-[300vh]" />
        )}
      </>
    );
  }
  return ScrollStage;
}
