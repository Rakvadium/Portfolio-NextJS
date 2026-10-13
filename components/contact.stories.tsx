import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { site } from "@/app/data/site";
import { Contact } from "./contact";

const meta = {
  title: "Contact/Contact",
  component: Contact,
  args: { contact: site.contact },
  parameters: { layout: "fullscreen" },
  decorators: [(Story) => <div className="mx-auto max-w-[1200px] p-4 sm:p-6">{Story()}</div>],
} satisfies Meta<typeof Contact>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole("heading", { level: 2, name: "Get in touch" })).toBeVisible();
    await expect(c.getByRole("link", { name: "Email me" })).toHaveAttribute("href", "mailto:caleb.mills.1221@proton.me");
    await expect(c.getByRole("link", { name: /Phone/ })).toHaveAttribute("href", "tel:+12089498754");
    await expect(c.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute("target", "_blank");
  },
};

export const Phone: Story = { globals: { viewport: { value: "phone", isRotated: false } } };
