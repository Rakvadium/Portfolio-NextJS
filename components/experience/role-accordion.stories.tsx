import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { site } from "@/app/data/site";
import { mapNonEmpty } from "@/lib/non-empty";
import { RoleAccordion } from "./role-accordion";
import { RoleDetail, RoleSummary } from "./role-detail";

const items = mapNonEmpty(site.roles, (role) => ({
  id: role.id,
  summary: <RoleSummary role={role} variant="summary" />,
  body: <RoleDetail role={role} compact />,
}));

const meta = {
  title: "Experience/RoleAccordion",
  component: RoleAccordion,
  args: { items },
  globals: { viewport: { value: "phone", isRotated: false } },
  parameters: { layout: "fullscreen" },
  decorators: [(Story) => <div className="p-4">{Story()}</div>],
} satisfies Meta<typeof RoleAccordion>;
export default meta;
type Story = StoryObj<typeof meta>;

export const FirstOpen: Story = {
  play: async ({ canvasElement }) => {
    const buttons = within(canvasElement).getAllByRole("button");
    await expect(buttons[0]).toHaveAttribute("aria-expanded", "true");
    for (const b of buttons.slice(1)) await expect(b).toHaveAttribute("aria-expanded", "false");
    await expect(within(canvasElement).getAllByRole("heading", { level: 3 })).toHaveLength(4);
  },
};

/** Opening a second role closes the first: one open at a time. */
export const Exclusive: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const buttons = c.getAllByRole("button");
    await userEvent.click(buttons[1]);
    await expect(buttons[1]).toHaveAttribute("aria-expanded", "true");
    await expect(buttons[0]).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(c.getByText(/Owned the frontend on our 4-person team/)).toBeVisible());
    await waitFor(() => expect(c.queryByText(/Kept ownership of Connector/)).toBeNull());
    await userEvent.click(buttons[1]);
    await expect(buttons[1]).toHaveAttribute("aria-expanded", "false");
  },
};
