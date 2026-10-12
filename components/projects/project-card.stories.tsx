import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { site } from "@/app/data/site";
import { ProjectCard } from "./project-card";

const [genhealth, uvsdecks] = site.projects;

const meta = {
  title: "Projects/ProjectCard",
  component: ProjectCard,
  args: { project: uvsdecks },
  parameters: { layout: "fullscreen" },
  decorators: [(Story) => <div className="mx-auto max-w-[1200px] p-6">{Story()}</div>],
} satisfies Meta<typeof ProjectCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithRepo: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole("article", { name: "UVSDECKS.GG" })).toBeVisible();
    await expect(c.getByRole("link", { name: /Visit uvsdecks.gg/ })).toHaveAttribute("href", "https://www.uvsdecks.gg");
    await expect(c.getByRole("link", { name: "Source code" })).toHaveAttribute("href", "https://github.com/Rakvadium/uvs-decks-gg");
    await expect(c.getByRole("link", { name: "Open UVSDECKS.GG (uvsdecks.gg)" })).toHaveAttribute("target", "_blank");
  },
};

export const WithoutRepo: Story = {
  args: { project: genhealth },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole("link", { name: "Source code" })).toBeNull();
  },
};

export const Flipped: Story = { args: { flip: true } };

export const Phone: Story = { globals: { viewport: { value: "phone", isRotated: false } } };
