import { unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import contentCollections from "@content-collections/vite";
import { build, defineConfig } from "vite";

const dummyEntry = join(process.cwd(), ".content-collections-dummy.ts");
writeFileSync(dummyEntry, "export {};");

try {
  await build(
    defineConfig({
      plugins: [contentCollections()],
      build: {
        rollupOptions: {
          input: dummyEntry,
        },
        write: false,
      },
    })
  );
} finally {
  unlinkSync(dummyEntry);
}
