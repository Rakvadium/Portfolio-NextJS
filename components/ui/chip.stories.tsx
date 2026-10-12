import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Chip } from "./chip";

const meta = {
  title: "UI/Chip",
  component: Chip,
  args: { children: "TypeScript" },
} satisfies Meta<typeof Chip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Row: Story = {
  render: () => (
    <ul className="flex flex-wrap gap-1.5">
      {["React", "TypeScript", "Next.js", "Node.js", "C#/.NET", "Vue/Nuxt"].map((s) => (
        <li key={s}>
          <Chip>{s}</Chip>
        </li>
      ))}
    </ul>
  ),
};
