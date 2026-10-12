import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import storybook from "eslint-plugin-storybook";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  { ignores: ["storybook-static/**", "captures/**", ".next/**"] },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...storybook.configs["flat/recommended"],
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "framer-motion",
              importNames: ["useReducedMotion"],
              message:
                "Reduced motion is handled by <MotionConfig reducedMotion=\"user\"> and the `motion-static` class (app/motion.css). Reading the media query in render causes hydration mismatches.",
            },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
