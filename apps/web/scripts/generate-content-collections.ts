import path from "node:path";

import { createBuilder } from "@content-collections/core";

const configPath = path.join(process.cwd(), "content-collections.ts");
const builder = await createBuilder(configPath);

await builder.build();
