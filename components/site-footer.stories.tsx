import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { site } from "@/app/data/site";
import { SiteFooter } from "./site-footer";

const meta = {
  title: "Page/SiteFooter",
  component: SiteFooter,
  args: { footer: site.footer },
} satisfies Meta<typeof SiteFooter>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("Senior Frontend Engineer · Meridian, ID")).toBeVisible();
  },
};
