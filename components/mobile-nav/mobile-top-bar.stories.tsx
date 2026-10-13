import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor, within } from "storybook/test";
import { site } from "@/app/data/site";
import { Masthead } from "@/components/hero/masthead";
import { withScrollStage } from "../../.storybook/decorators";
import { MobileTopBar } from "./mobile-top-bar";

/**
 * The phone top bar over a scroll stage whose Home section holds the real Masthead, so the morph has
 * something to measure. `active` is an arg here; on the page MobileNavigation passes the scroll's.
 */
const meta = {
  title: "Mobile nav/MobileTopBar",
  component: MobileTopBar,
  args: { brand: site.brand, portrait: site.hero.portrait, sections: site.sections, active: "home" },
  globals: { viewport: { value: "phone", isRotated: false } },
  decorators: [withScrollStage({ home: <Masthead hero={site.hero} /> })],
  // Fixed position: each story gets its own iframe, never an inline docs block.
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen", docs: { story: { inline: false, iframeHeight: 844 } } },
} satisfies Meta<typeof MobileTopBar>;
export default meta;
type Story = StoryObj<typeof meta>;

const glass = (canvas: HTMLElement) => getComputedStyle(within(canvas).getByRole("banner").firstElementChild!).opacity;
const scrollTo = (canvas: HTMLElement, top: number) => canvas.ownerDocument.defaultView?.scrollTo({ top, behavior: "instant" });

/** At the top: a transparent bar (only the progress line); the masthead carries the identity. */
export const AtTop: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole("link", { name: "Caleb Mills, back to top" })).toHaveAttribute("href", "#home");
    await expect(c.getByRole("heading", { level: 1, name: "Caleb Mills" })).toBeVisible();
    await expect(glass(canvasElement)).toBe("0");
  },
};

/**
 * Mid-morph (scrollY 90): the avatar copy has nearly docked, the text copies are still travelling,
 * and the glass is fading in. Scroll the stage by hand to scrub the morph both ways.
 */
export const Morphing: Story = {
  play: async ({ canvasElement }) => {
    scrollTo(canvasElement, 90);
    await waitFor(() => {
      const opacity = Number(glass(canvasElement));
      expect(opacity).toBeGreaterThan(0);
      expect(opacity).toBeLessThan(1);
    });
    const avatar = canvasElement.ownerDocument.querySelector('[data-morph-copy="avatar"]')!;
    await waitFor(() => expect(avatar.getBoundingClientRect().width).toBeLessThan(80));
  },
};

/** Docked, scrolled into Experience: glass bar, identity on the left, section name on the right. */
export const Docked: Story = {
  args: { active: "experience" },
  play: async ({ canvasElement }) => {
    scrollTo(canvasElement, 600);
    await waitFor(() => expect(glass(canvasElement)).toBe("1"));
    const doc = canvasElement.ownerDocument;
    // The flying avatar copy sits exactly on the bar's 32px slot.
    const copy = doc.querySelector('[data-morph-copy="avatar"]')!.getBoundingClientRect();
    const slot = doc.querySelector('[data-morph-slot="avatar"]')!.getBoundingClientRect();
    await expect(Math.round(copy.width)).toBe(32);
    await expect(Math.round(copy.left)).toBe(Math.round(slot.left));
    await expect(Math.round(copy.top)).toBe(Math.round(slot.top));
    await expect(within(canvasElement).getByText("Experience", { selector: "[data-active]" })).toBeInTheDocument();
    await expect(within(canvasElement).getByRole("link", { name: "Caleb Mills, back to top" })).toHaveAttribute("href", "#home");
  },
};
