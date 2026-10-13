import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { site } from "@/app/data/site";
import { Section } from "@/components/ui/section";
import { Experience } from "./experience";

const section = site.sections.find((s) => s.id === "experience")!;

const meta = {
  title: "Experience/Experience",
  component: Experience,
  args: { roles: site.roles },
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-[1200px] px-4 pb-10 sm:px-6">
        <Section section={section} lead={false}>
          {Story()}
        </Section>
      </div>
    ),
  ],
} satisfies Meta<typeof Experience>;
export default meta;
type Story = StoryObj<typeof meta>;

/** lg+: the two-pane explorer; the accordion is display:none. */
export const Desktop: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole("tablist", { name: "Roles, newest first" })).toBeVisible();
    await expect(c.queryAllByRole("button", { expanded: true })).toHaveLength(0);
  },
};

/** Below lg: the accordion; the explorer is display:none. */
export const Phone: Story = {
  globals: { viewport: { value: "phone", isRotated: false } },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.queryByRole("tablist")).toBeNull();
    await expect(c.getAllByRole("heading", { level: 3 })).toHaveLength(4);
  },
};
