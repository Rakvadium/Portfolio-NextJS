// Framework: @storybook/nextjs-vite. It supports next/image, next/font/google and the next/navigation
// mocks through vite-plugin-storybook-nextjs, picks up postcss.config.mjs (Tailwind v4) without loader
// config, starts and rebuilds faster than the webpack framework, and is what @storybook/addon-vitest
// needs to run every story (render, play function, a11y) as a test.
import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  framework: { name: "@storybook/nextjs-vite", options: {} },
  stories: ["../components/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-vitest"],
  // next/image src="/calebHeadshotAi.jpg" etc. resolve exactly as in Next.
  staticDirs: ["../public"],
};

export default config;
