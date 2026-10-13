import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { site } from "@/app/data/site";
import { SectionTabs } from "./section-tabs";

/**
 * The dock's left capsule at the smallest phone the layout supports (360px, the tight metrics).
 * Hash links are not clicked here: the story test page has a <base>, so a click would navigate away
 *; `scripts/capture.mjs mobile-nav` taps them on the real page.
 */
const meta = {
  title: "Mobile nav/SectionTabs",
  component: SectionTabs,
  args: { sections: site.sections, active: "home" },
  globals: { viewport: { value: "phoneSmall", isRotated: false } },
  parameters: { layout: "fullscreen" },
  decorators: [(Story) => <div className="p-3">{Story()}</div>],
} satisfies Meta<typeof SectionTabs>;
export default meta;
type Story = StoryObj<typeof meta>;

const expectCurrent = (canvas: HTMLElement, label: string) => async () => {
  const nav = within(canvas).getByRole("navigation", { name: "Sections" });
  await expect(within(nav).getByRole("link", { current: true })).toHaveAccessibleName(label);
  await expect(within(nav).getAllByRole("link", { current: true })).toHaveLength(1);
};

/** Icon-only tabs are named by their section; Tab moves through them in page order. */
export const Home: Story = {
  play: async ({ canvasElement }) => {
    await expectCurrent(canvasElement, "Home")();
    const c = within(canvasElement);
    for (const [name, href] of [["Home", "#home"], ["Skills", "#skills"], ["Experience", "#experience"], ["Projects", "#projects"], ["Contact", "#contact"]]) {
      await userEvent.tab();
      await expect(c.getByRole("link", { name })).toHaveFocus();
      await expect(c.getByRole("link", { name })).toHaveAttribute("href", href);
    }
  },
};
export const Skills: Story = { args: { active: "skills" }, play: ({ canvasElement }) => expectCurrent(canvasElement, "Skills")() };
export const Experience: Story = { args: { active: "experience" }, play: ({ canvasElement }) => expectCurrent(canvasElement, "Experience")() };
export const Projects: Story = { args: { active: "projects" }, play: ({ canvasElement }) => expectCurrent(canvasElement, "Projects")() };
export const Contact: Story = { args: { active: "contact" }, play: ({ canvasElement }) => expectCurrent(canvasElement, "Contact")() };
