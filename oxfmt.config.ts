import { defineConfig } from "oxfmt";
import ultraciteOxfmt from "ultracite/oxfmt";

export default defineConfig({
  ...ultraciteOxfmt,
  ignorePatterns: [
    ...(ultraciteOxfmt.ignorePatterns ?? []),
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
});
