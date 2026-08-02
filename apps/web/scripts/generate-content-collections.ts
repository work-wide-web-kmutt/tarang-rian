import { unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";

import contentCollections from "@content-collections/vite";
import { build, defineConfig } from "vite";

const dummyEntry = path.join(process.cwd(), ".content-collections-dummy.ts");
writeFileSync(dummyEntry, "export {};");

try {
  await build(
    defineConfig({
      build: {
        rollupOptions: {
          input: dummyEntry,
        },
        write: false,
      },
      plugins: [contentCollections()],
    })
  );
} finally {
  unlinkSync(dummyEntry);
}
