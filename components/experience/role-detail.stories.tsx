import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { site } from "@/app/data/site";
import { RoleDetail } from "./role-detail";

const meta = {
  title: "Experience/RoleDetail",
  component: RoleDetail,
  args: { role: site.roles[0] },
  decorators: [(Story) => <div className="max-w-3xl">{Story()}</div>],
} satisfies Meta<typeof RoleDetail>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Full: Story = {};
export const Compact: Story = { args: { compact: true } };
