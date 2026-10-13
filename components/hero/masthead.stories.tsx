import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { site } from "@/app/data/site";
import { Masthead } from "./masthead";

/** Below lg only (display:none at lg+), so every story renders at a phone viewport. */
const meta = {
  title: "Hero/Masthead",
  component: Masthead,
  args: { hero: site.hero },
  globals: { viewport: { value: "phone", isRotated: false } },
  parameters: { layout: "fullscreen" },
  decorators: [(Story) => <div className="px-4 pt-[60px]">{Story()}</div>],
} satisfies Meta<typeof Masthead>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Phone: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole("heading", { level: 1, name: "Caleb Mills" })).toBeVisible();
    await expect(c.getByRole("img", { name: site.hero.portrait.alt })).toBeVisible();
    await expect(c.getByText("Senior Frontend Engineer")).toBeVisible();
  },
};

export const SmallPhone: Story = { globals: { viewport: { value: "phoneSmall", isRotated: false } } };
