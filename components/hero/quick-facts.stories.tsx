import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { site } from "@/app/data/site";
import { fixtures } from "@/app/data/fixtures";
import { QuickFacts } from "./quick-facts";

const meta = {
  title: "Hero/QuickFacts",
  component: QuickFacts,
  args: { facts: site.hero.facts, coreStack: site.hero.coreStack },
  decorators: [(Story) => <div className="max-w-3xl">{Story()}</div>],
} satisfies Meta<typeof QuickFacts>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A current role: the detail reads "Nov 2026 – Present". */
export const CurrentRole: Story = { args: { facts: fixtures.manyRoles.hero.facts } };
