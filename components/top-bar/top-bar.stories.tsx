import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor, within } from "storybook/test";
import { site } from "@/app/data/site";
import { withScrollStage } from "../../.storybook/decorators";
import { TopBar } from "./top-bar";

/** lg+ only; below lg the bar is display:none and Mobile nav/* takes over. */
const meta = {
  title: "Top bar/TopBar",
  component: TopBar,
  args: { brand: site.brand, sections: site.sections, social: site.social },
  decorators: [withScrollStage()],
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen", docs: { story: { inline: false, iframeHeight: 640 } } },
} satisfies Meta<typeof TopBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const nav = c.getByRole("navigation", { name: "Sections" });
    await expect(within(nav).getByRole("link", { current: true })).toHaveTextContent("Home");
    for (const name of ["GitHub", "LinkedIn", "Email caleb.mills.1221@proton.me"]) {
      await expect(c.getByRole("link", { name })).toBeVisible();
    }
  },
};

/** Past the handoff: brand name shown, underline on Experience, progress line grown. */
export const ScrolledToExperience: Story = {
  play: async ({ canvasElement }) => {
    canvasElement.ownerDocument.getElementById("experience")?.scrollIntoView({ behavior: "instant" });
    const nav = within(canvasElement).getByRole("navigation", { name: "Sections" });
    await waitFor(() => expect(within(nav).getByRole("link", { current: true })).toHaveTextContent("Experience"));
  },
};
