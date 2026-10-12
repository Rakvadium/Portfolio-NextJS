import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor, within } from "storybook/test";
import { site } from "@/app/data/site";
import { withScrollStage } from "../../.storybook/decorators";
import { SectionNavigation } from "./section-navigation";

const meta = {
  title: "Top bar/SectionNavigation",
  component: SectionNavigation,
  args: { sections: site.sections },
  decorators: [
    (Story) => (
      <div className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between gap-3 bg-canvas/80 px-6">
        {Story()}
      </div>
    ),
    withScrollStage(),
  ],
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen", docs: { story: { inline: false, iframeHeight: 480 } } },
} satisfies Meta<typeof SectionNavigation>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

/**
 * Links are plain hash anchors (the browser scrolls and the hash updates), and the underline follows
 * the scroll position. Clicking is left to the real-page browser pass: the story test runner's page
 * has a <base> element, so a hash click there would navigate away.
 */
export const FollowsScroll: Story = {
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole("navigation", { name: "Sections" });
    await expect(within(nav).getByRole("link", { name: "Projects" })).toHaveAttribute("href", "#projects");
    canvasElement.ownerDocument.getElementById("projects")?.scrollIntoView({ behavior: "instant" });
    await waitFor(() => expect(within(nav).getByRole("link", { current: true })).toHaveTextContent("Projects"));
  },
};

export const PhoneClosed: Story = { globals: { viewport: { value: "phone", isRotated: false } } };
