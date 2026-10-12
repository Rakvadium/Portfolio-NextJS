import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor, within } from "storybook/test";
import { site } from "@/app/data/site";
import { fixtures } from "@/app/data/fixtures";
import { withScrollStage } from "../../.storybook/decorators";
import { BrandMark } from "./brand-mark";

const meta = {
  title: "Top bar/BrandMark",
  component: BrandMark,
  args: { brand: site.brand },
  decorators: [(Story) => <div className="fixed left-6 top-4 z-50 max-w-72">{Story()}</div>, withScrollStage({ stubs: false })],
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen", docs: { story: { inline: false, iframeHeight: 240 } } },
} satisfies Meta<typeof BrandMark>;
export default meta;
type Story = StoryObj<typeof meta>;

/** At the top only the monogram shows: the hero h1 carries the name. */
export const AtTop: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("link", { name: "Caleb Mills, back to top" })).toHaveAttribute("href", "#home");
  },
};

/** Past 330px the name and title have faded in. */
export const Scrolled: Story = {
  play: async ({ canvasElement, args }) => {
    canvasElement.ownerDocument.defaultView?.scrollTo({ top: 400, behavior: "instant" });
    const name = within(canvasElement).getByText(args.brand.name);
    await waitFor(() => expect(getComputedStyle(name.parentElement!).opacity).toBe("1"));
  },
};

/** A long name truncates instead of pushing the nav. */
export const LongName: Story = { args: { brand: fixtures.longName.brand }, play: Scrolled.play };
