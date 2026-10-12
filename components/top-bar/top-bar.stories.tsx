import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { site } from "@/app/data/site";
import { withScrollStage } from "../../.storybook/decorators";
import { TopBar } from "./top-bar";

const phone = { viewport: { value: "phone", isRotated: false } };

const meta = {
  title: "Top bar/TopBar",
  component: TopBar,
  args: { brand: site.brand, sections: site.sections, social: site.social },
  decorators: [withScrollStage()],
  // Fixed position: each story gets its own iframe, never an inline docs block.
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen", docs: { story: { inline: false, iframeHeight: 640 } } },
} satisfies Meta<typeof TopBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const nav = c.getByRole("navigation", { name: "Sections" });
    await expect(within(nav).getByRole("link", { current: true })).toHaveTextContent("Home");
    for (const name of ["GitHub", "LinkedIn", "Email caleb.mills.1221@proton.me"]) {
      await expect(c.getByRole("link", { name })).toBeVisible();
    }
  },
};

/** Past the handoff: brand name shown, underline on Experience, progress line grown. */
export const ScrolledToExperience: Story = {
  play: async ({ canvasElement }) => {
    canvasElement.ownerDocument.getElementById("experience")?.scrollIntoView({ behavior: "instant" });
    const nav = within(canvasElement).getByRole("navigation", { name: "Sections" });
    await waitFor(() => expect(within(nav).getByRole("link", { current: true })).toHaveTextContent("Experience"));
  },
};

export const Phone: Story = {
  globals: phone,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole("button", { name: "Jump to section. Current section: Home" })).toBeVisible();
    await expect(c.getByRole("link", { name: "GitHub" })).toBeVisible();
  },
};

/** Ends with the menu open, for visual review. */
export const PhoneMenuOpen: Story = {
  globals: phone,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("button", { name: /Jump to section/ }));
    const menu = (await c.findByRole("link", { name: "Projects" })).closest("ul")!;
    // Let the 180ms entrance finish, so the a11y check measures the settled menu.
    await waitFor(() => expect(getComputedStyle(menu).opacity).toBe("1"));
    await expect(c.getByRole("button", { name: /Jump to section/ })).toHaveAttribute("aria-expanded", "true");
  },
};

/** Escape closes the menu and returns focus to the button; an outside tap closes it too. */
export const PhoneMenuDismiss: Story = {
  globals: phone,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const button = c.getByRole("button", { name: /Jump to section/ });
    await userEvent.click(button);
    await waitFor(() => expect(c.getByRole("link", { name: "Projects" })).toBeVisible());
    await userEvent.keyboard("{Escape}");
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(button).toHaveFocus();
    await waitFor(() => expect(c.queryByRole("link", { name: "Projects" })).toBeNull());
    await userEvent.click(button);
    await waitFor(() => expect(c.getByRole("link", { name: "Projects" })).toBeVisible());
    await userEvent.click(c.getByRole("region", { name: "Skills placeholder" }));
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(c.queryByRole("link", { name: "Projects" })).toBeNull());
  },
};
