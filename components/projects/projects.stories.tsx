import type { Decorator, Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import type { Site } from "@/app/data/site";
import { site } from "@/app/data/site";
import { fixtures } from "@/app/data/fixtures";
import { Section } from "@/components/ui/section";
import { Projects } from "./projects";

/** Wraps the story in the real #projects section, so the derived intro shows with it. */
function inProjectsSection(from: Site): Decorator {
  return function InProjectsSection(Story) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 pb-10 sm:px-6">
        <Section section={from.sections.find((s) => s.id === "projects")!} lead={false}>
          {Story()}
        </Section>
      </div>
    );
  };
}

const meta = {
  title: "Projects/Projects",
  component: Projects,
  args: { projects: site.projects },
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Projects>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { decorators: [inProjectsSection(site)] };

/** One project: the intro switches to the singular. */
export const OneProject: Story = {
  args: { projects: fixtures.oneProject.projects },
  decorators: [inProjectsSection(fixtures.oneProject)],
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText(/^One site I built and launched/)).toBeVisible();
  },
};
