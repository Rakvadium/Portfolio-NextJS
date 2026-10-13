import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { Github, Mail } from "lucide-react";
import { ButtonLink } from "./button-link";

const meta = {
  title: "UI/ButtonLink",
  component: ButtonLink,
  args: { href: "#projects", tone: "brand", children: "View work", arrow: "down" },
  argTypes: {
    tone: { control: "inline-radio", options: ["brand", "ghost", "quiet"] },
    arrow: { control: "inline-radio", options: [undefined, "down", "right", "up-right"] },
  },
} satisfies Meta<typeof ButtonLink>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Brand: Story = {};
export const Ghost: Story = {
  args: { tone: "ghost", href: "mailto:caleb.mills.1221@proton.me", icon: Mail, children: "Email me", arrow: undefined },
};
export const Quiet: Story = { args: { tone: "quiet", href: "#experience", children: "Experience", arrow: "right" } };

/** http(s) links open in a new tab with rel=noopener; in-page and mailto links do not. */
export const External: Story = {
  args: { href: "https://www.genhealthaz.com", children: "Visit genhealthaz.com", arrow: "up-right" },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", { name: /Visit genhealthaz.com/ });
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  },
};

export const AllTones: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2.5">
      <ButtonLink tone="brand" href="#projects" arrow="down">
        View work
      </ButtonLink>
      <ButtonLink tone="ghost" href="mailto:caleb.mills.1221@proton.me" icon={Mail}>
        Email me
      </ButtonLink>
      <ButtonLink tone="quiet" href="#experience" arrow="right">
        Experience
      </ButtonLink>
      <ButtonLink tone="ghost" href="https://github.com/Rakvadium/uvs-decks-gg" icon={Github}>
        Source code
      </ButtonLink>
    </div>
  ),
};
