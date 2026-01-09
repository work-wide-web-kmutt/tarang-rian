import contentCollections from "@content-collections/vite";
import { unlinkSync, writeFileSync } from "fs";
import { join } from "path";
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
