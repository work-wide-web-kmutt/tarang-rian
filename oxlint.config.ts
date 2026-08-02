import { defineConfig } from "oxlint";
import ultraciteCore from "ultracite/oxlint/core";
import ultraciteReact from "ultracite/oxlint/react";
import ultraciteTanstack from "ultracite/oxlint/tanstack";
import ultraciteVitest from "ultracite/oxlint/vitest";

const ultraciteVitestForBun = {
  ...ultraciteVitest,
  overrides: ultraciteVitest.overrides?.map((override) => ({
    ...override,
    rules: {
      ...override.rules,
      "vitest/prefer-importing-vitest-globals": "off",
    },
  })),
};

export default defineConfig({
  extends: [
    ultraciteCore,
    ultraciteReact,
    ultraciteTanstack,
    ultraciteVitestForBun,
  ],
  ignorePatterns: [
    ...(ultraciteCore.ignorePatterns ?? []),
    "**/.tanstack/**",
    "**/dev-dist/**",
    "**/.vinxi/**",
    "**/routeTree.gen.ts",
    "bts.jsonc",
    "**/src-tauri/**",
    "**/.source/**",
    "**/.alchemy/**",
    "**/wrangler.jsonc",
    "**/convex/_generated/**",
  ],
  options: {
    typeAware: true,
    typeCheck: false,
  },
  rules: {
    "func-style": ["error", "declaration"],
    "jsx-a11y/no-noninteractive-element-interactions": "off",
    "jsx-a11y/no-noninteractive-tabindex": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "jsx-a11y/prefer-tag-over-role": "off",
    "jsx-a11y/role-supports-aria-props": "off",
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["./**", "../**"],
            message:
              "Use absolute imports with @/ prefix instead of relative imports",
          },
        ],
      },
    ],
    "no-use-before-define": ["error", { functions: false }],
    "react/no-children-prop": "off",
  },
});
