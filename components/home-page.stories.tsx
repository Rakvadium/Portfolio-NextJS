import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { site } from "@/app/data/site";
import { fixtures } from "@/app/data/fixtures";
import { HomePage } from "./home-page";

const meta = {
  title: "Page/HomePage",
  component: HomePage,
  args: { site },
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen", docs: { story: { inline: false, iframeHeight: 800 } } },
} satisfies Meta<typeof HomePage>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole("heading", { level: 1, name: "Caleb Mills" })).toBeVisible();
    for (const id of ["home", "skills", "experience", "projects", "contact"]) {
      await expect(canvasElement.ownerDocument.getElementById(id)?.tagName).toBe("SECTION");
    }
    await expect(c.queryByText("At a glance")).toBeNull();
  },
};

export const Phone: Story = { globals: { viewport: { value: "phone", isRotated: false } } };

/** Derived copy follows the data: one project reads "One site I built and launched". */
export const SingleProject: Story = { args: { site: fixtures.oneProject } };

/** Six roles, one current: the explorer, the hero's most recent role, and the intro all update. */
export const ManyRoles: Story = { args: { site: fixtures.manyRoles } };
