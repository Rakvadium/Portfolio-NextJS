import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { site } from "@/app/data/site";
import { SocialDock } from "./social-dock";

const meta = {
  title: "Mobile nav/SocialDock",
  component: SocialDock,
  args: { channels: site.social },
  globals: { viewport: { value: "phoneSmall", isRotated: false } },
  decorators: [(Story) => <div className="flex justify-end p-3">{Story()}</div>],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SocialDock>;
export default meta;
type Story = StoryObj<typeof meta>;

/** GitHub and LinkedIn open in a new tab; Email (amber, after the divider) is a mailto link. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const group = within(within(canvasElement).getByRole("group", { name: "Social links" }));
    await expect(group.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/Rakvadium");
    await expect(group.getByRole("link", { name: "GitHub" })).toHaveAttribute("target", "_blank");
    await expect(group.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", "https://www.linkedin.com/in/calebmills1");
    await expect(group.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("rel", "noopener noreferrer");
    const email = group.getByRole("link", { name: "Email caleb.mills.1221@proton.me" });
    await expect(email).toHaveAttribute("href", "mailto:caleb.mills.1221@proton.me");
    await expect(email).not.toHaveAttribute("target");
  },
};
