/// <reference types="vitest/config" />

import { fileURLToPath } from "node:url";

import contentCollections from "@content-collections/vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const isVitest = Boolean(process.env.VITEST);

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackRouter({}),
    react(),
    ...(isVitest ? [] : [contentCollections()]),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("src", import.meta.url)),
      ...(isVitest
        ? {
            "content-collections": fileURLToPath(
              new URL(".content-collections/generated", import.meta.url)
            ),
          }
        : {}),
    },
  },
  server: {
    port: 3001,
  },
  test: {
    environment: "node",
  },
});
