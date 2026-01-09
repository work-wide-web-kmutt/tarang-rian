import { defineCollection, defineConfig } from "@content-collections/core";
import { GenElectiveOptionSchema } from "./src/course/schema";

const courses = defineCollection({
  name: "courses",
  directory: "src/course",
  include: "**/*.md",
  schema: GenElectiveOptionSchema,
  transform: (data) => {
    const slug = data._meta.path.replace(/\.md$/, "");
    return {
      ...data,
      slug,
    };
  },
});

export default defineConfig({
  collections: [courses],
});
