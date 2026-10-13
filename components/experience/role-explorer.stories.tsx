import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import type { Site } from "@/app/data/site";
import { site } from "@/app/data/site";
import { fixtures } from "@/app/data/fixtures";
import { mapNonEmpty } from "@/lib/non-empty";
import { RoleDetail, RoleSummary } from "./role-detail";
import { RoleExplorer } from "./role-explorer";

const itemsFor = (roles: Site["roles"]) =>
  mapNonEmpty(roles, (role) => ({
    id: role.id,
    tab: <RoleSummary role={role} variant="tab" />,
    panel: <RoleDetail role={role} />,
  }));
const items = itemsFor(site.roles);

const meta = {
  title: "Experience/RoleExplorer",
  component: RoleExplorer,
  args: { items },
  parameters: { layout: "fullscreen" },
  decorators: [(Story) => <div className="mx-auto max-w-[1200px] p-6">{Story()}</div>],
} satisfies Meta<typeof RoleExplorer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const NewestSelected: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getAllByRole("tab")[0]).toHaveAttribute("aria-selected", "true");
    await expect(c.getByRole("tabpanel")).toHaveAccessibleName(/Senior Full-Stack Engineer/);
    await expect(c.getByRole("heading", { level: 3, name: "Senior Full-Stack Engineer" })).toBeVisible();
    await expect(c.getByRole("button", { name: /Newer/ })).toBeDisabled();
  },
};

/** Roving focus: ArrowDown/ArrowUp wrap, Home/End jump; Older is disabled on the last role. */
export const KeyboardNavigation: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const tabs = c.getAllByRole("tab");
    tabs[0].focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    await expect(tabs[1]).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}{ArrowUp}");
    await expect(tabs[3]).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{Home}");
    await expect(tabs[0]).toHaveFocus();
    await userEvent.keyboard("{End}");
    await expect(tabs[3]).toHaveFocus();
    await waitFor(() => expect(c.getByRole("heading", { level: 3, name: "Auto-Campaign Specialist" })).toBeVisible());
    await expect(c.getByRole("button", { name: /Older/ })).toBeDisabled();
    await expect(c.getByText("Role 4 of 4, newest first")).toBeVisible();
  },
};

/** Newer / Older step through roles without wrapping. */
export const StepButtons: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("button", { name: /Older/ }));
    await waitFor(() => expect(c.getByRole("heading", { level: 3, name: "Senior Software Engineer" })).toBeVisible());
    await expect(c.getAllByRole("tab")[1]).toHaveAttribute("aria-selected", "true");
  },
};

/** A single role: Newer and Older are both disabled. */
export const SingleRole: Story = {
  args: { items: [items[0]] },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByText("Role 1 of 1, newest first")).toBeVisible();
    await expect(c.getByRole("button", { name: /Older/ })).toBeDisabled();
  },
};

export const ManyRoles: Story = { args: { items: itemsFor(fixtures.manyRoles.roles) } };
