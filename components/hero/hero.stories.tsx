import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor, within } from "storybook/test";
import { site } from "@/app/data/site";
import { fixtures } from "@/app/data/fixtures";
import { TopBar } from "@/components/top-bar/top-bar";
import { withScrollStage } from "../../.storybook/decorators";
import { Hero } from "./hero";

const meta = {
  title: "Hero/Hero",
  component: Hero,
  args: { hero: site.hero },
  parameters: { layout: "fullscreen" },
  decorators: [(Story) => <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6">{Story()}</div>],
} satisfies Meta<typeof Hero>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole("heading", { level: 1, name: "Caleb Mills" })).toBeVisible();
    await expect(c.getByText("9+ years as a software engineer")).toBeVisible();
    await expect(c.getByRole("link", { name: "View work" })).toHaveAttribute("href", "#projects");
    await expect(c.getByRole("link", { name: "Email me" })).toHaveAttribute("href", "mailto:caleb.mills.1221@proton.me");
  },
};

export const Phone: Story = { globals: { viewport: { value: "phone", isRotated: false } } };

export const LongName: Story = { args: { hero: fixtures.longName.hero } };

/**
 * The hero with the real top bar over a scrollable page: scrolling past 330px hands the name off to
 * the bar (h1 shrinks and fades, the bar's name fades in), and the portrait drifts.
 */
export const ScrollHandoff: Story = {
  tags: ["!autodocs"],
  decorators: [
    (Story) => (
      <>
        <TopBar brand={site.brand} sections={site.sections} social={site.social} />
        <div className="pt-24">{Story()}</div>
      </>
    ),
    withScrollStage({ stubs: false }),
  ],
  parameters: { docs: { story: { inline: false, iframeHeight: 800 } } },
  play: async ({ canvasElement }) => {
    canvasElement.ownerDocument.defaultView?.scrollTo({ top: 400, behavior: "instant" });
    const h1 = within(canvasElement).getByRole("heading", { level: 1 });
    await waitFor(() => expect(getComputedStyle(h1).opacity).toBe("0"));
  },
};
