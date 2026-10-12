import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Backdrop } from "./backdrop";

const meta = {
  title: "Page/Backdrop",
  component: Backdrop,
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen", docs: { story: { inline: false, iframeHeight: 600 } } },
  decorators: [(Story) => <div className="h-screen">{Story()}</div>],
} satisfies Meta<typeof Backdrop>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
