import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { site } from "@/app/data/site";
import { SocialLinks } from "./social-links";

const meta = {
  title: "Top bar/SocialLinks",
  component: SocialLinks,
  args: { channels: site.social },
} satisfies Meta<typeof SocialLinks>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole("link", { name: "GitHub" })).toHaveAttribute("target", "_blank");
    await expect(c.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", "https://www.linkedin.com/in/calebmills1");
    await expect(c.getByRole("link", { name: "Email caleb.mills.1221@proton.me" })).not.toHaveAttribute("target");
  },
};
