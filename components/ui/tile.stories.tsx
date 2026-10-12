import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fireEvent } from "storybook/test";
import { Tile } from "./tile";

const meta = {
  title: "UI/Tile",
  component: Tile,
  args: {
    glow: "coral",
    children: (
      <div className="p-8">
        <p className="font-display text-2xl font-bold">Glass tile</p>
        <p className="mt-2 max-w-sm text-body">Move the pointer over the tile: a soft fill and a 1px rim follow it.</p>
      </div>
    ),
  },
  argTypes: {
    glow: { control: "inline-radio", options: ["amber", "coral", "magenta"] },
    motion: { control: "select", options: ["none", "enter", "enter-fade", "reveal"] },
  },
  decorators: [(Story) => <div className="max-w-xl">{Story()}</div>],
} satisfies Meta<typeof Tile>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Coral: Story = {};
export const Amber: Story = { args: { glow: "amber" } };
export const Magenta: Story = { args: { glow: "magenta" } };
export const Lift: Story = { args: { lift: true } };
export const Enter: Story = { args: { motion: "enter" } };

/** Pointer movement writes the cursor position that the two glow layers read; hover shows them. */
export const PointerGlow: Story = {
  play: async ({ canvasElement }) => {
    const tile = canvasElement.querySelector<HTMLElement>(".tile")!;
    const box = tile.getBoundingClientRect();
    await fireEvent.pointerMove(tile, { clientX: box.left + 120, clientY: box.top + 40 });
    await expect(tile.style.getPropertyValue("--x")).toBe("120px");
    await expect(tile.style.getPropertyValue("--y")).toBe("40px");
    await expect(tile).toHaveAttribute("data-tone", "coral");
  },
};
