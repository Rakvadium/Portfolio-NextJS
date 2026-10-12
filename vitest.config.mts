// Runs every Storybook story as a test (render + play function + a11y) in headless Chrome:
// `npm run test-storybook`. Unit tests for pure modules run under `node --test` (`npm test`).
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// The installed Google Chrome, so no Playwright browser download is needed. Override with CHROME_PATH.
const executablePath = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";

export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [storybookTest({ configDir: path.join(dirname, ".storybook") })],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({ launchOptions: { executablePath } }),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
