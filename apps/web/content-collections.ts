import { defineCollection, defineConfig } from "@content-collections/core";

import { GenElectiveOptionSchema } from "@/course/schema";

const MD_FILE_EXTENSION_REGEX = /\.md$/u;

const courses = defineCollection({
  directory: "src/course",
  include: "**/*.md",
  name: "courses",
  schema: GenElectiveOptionSchema,
  transform: (data) => {
    const slug = data._meta.path
      .replace(MD_FILE_EXTENSION_REGEX, "")
      .replaceAll("/", "-");
    const normalizedClass =
      data.class?.map((cls) => ({
        ...cls,
        instructor: Array.isArray(cls.instructor)
          ? cls.instructor
          : [cls.instructor],
      })) ?? [];
    return {
      ...data,
      class: normalizedClass,
      slug,
    };
  },
});

export default defineConfig({
  collections: [courses],
});
