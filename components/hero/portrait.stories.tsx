import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { site } from "@/app/data/site";
import { Portrait } from "./portrait";

const meta = {
  title: "Hero/Portrait",
  component: Portrait,
  args: { portrait: site.hero.portrait, name: site.hero.name, location: site.hero.location },
  decorators: [(Story) => <div className="flex h-[520px] w-[380px] flex-col">{Story()}</div>],
} satisfies Meta<typeof Portrait>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
