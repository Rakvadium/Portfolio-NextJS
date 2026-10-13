import type { Preview } from "@storybook/nextjs-vite";
import "../app/globals.css";
import { withSiteRoot } from "./decorators";

const preview: Preview = {
  decorators: [withSiteRoot],
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    // html { background: var(--color-canvas) } from globals.css paints the canvas; swatches would fight it.
    backgrounds: { disable: true },
    viewport: {
      options: {
        desktop: { name: "Desktop 1280x800", styles: { width: "1280px", height: "800px" }, type: "desktop" },
        phone: { name: "Phone 390x844", styles: { width: "390px", height: "844px" }, type: "mobile" },
        phoneSmall: { name: "Small phone 360x780", styles: { width: "360px", height: "780px" }, type: "mobile" },
      },
    },
    // a11y violations fail the story test (npm run test-storybook) and show as errors in the panel.
    a11y: { test: "error" },
  },
  initialGlobals: { viewport: { value: "desktop", isRotated: false } },
};

export default preview;
