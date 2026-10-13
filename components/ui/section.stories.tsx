import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { site } from "@/app/data/site";
import { Section, SectionHeading } from "./section";

const experience = site.sections.find((s) => s.id === "experience")!;

const meta = {
  title: "UI/SectionHeading",
  component: SectionHeading,
  args: { title: experience.heading!.title, intro: experience.heading!.intro },
} satisfies Meta<typeof SectionHeading>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The section shell names itself by its heading. */
export const InSection: Story = {
  render: () => (
    <Section section={experience} lead={false}>
      <p className="text-body">Section body.</p>
    </Section>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("region", { name: "Experience" })).toHaveAttribute("id", "experience");
  },
};
