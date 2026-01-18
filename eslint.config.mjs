import { defineConfig } from "eslint/config";
import tailwindCanonicalClasses from "eslint-plugin-tailwind-canonical-classes";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    extends: [tseslint.configs.base],
    files: ["apps/web/src/**/*.{ts,tsx,js,jsx}"],
    ignores: ["**/routeTree.gen.ts"],
    plugins: {
      "tailwind-canonical-classes": tailwindCanonicalClasses,
    },
    rules: {
      "tailwind-canonical-classes/tailwind-canonical-classes": [
        "warn",
        {
          cssPath: "./apps/web/src/index.css",
        },
      ],
    },
  },
]);
