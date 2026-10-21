import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { site } from "@/app/data/site";
import { Section } from "@/components/ui/section";
import { Skills } from "./skills";

const section = site.sections.find((s) => s.id === "skills")!;

const meta = {
  title: "Skills/Skills",
  component: Skills,
  args: { skills: site.skills },
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
} satisfies Meta<typeof Skills>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole("region", { name: "Skills" })).toHaveAttribute("id", "skills");
    for (const group of ["Frontend", "Backend", "Cloud", "AI"]) {
      await expect(c.getByRole("heading", { level: 3, name: group })).toBeVisible();
    }
    await expect(c.getByText("Azure")).toBeVisible();
    await expect(c.getByText("Agents and tooling")).toBeVisible();
  },
};

export const Phone: Story = { globals: { viewport: { value: "phone", isRotated: false } } };
