import { defineCollection, defineConfig } from "@content-collections/core";
import { GenElectiveOptionSchema } from "./src/course/schema";

const MD_FILE_EXTENSION_REGEX = /\.md$/;

const courses = defineCollection({
  name: "courses",
  directory: "src/course",
  include: "**/*.md",
  schema: GenElectiveOptionSchema,
  transform: (data) => {
    const slug = data._meta.path
      .replace(MD_FILE_EXTENSION_REGEX, "")
      .replace(/\//g, "-");
    const normalizedClass =
      data.class?.map((cls) => ({
        ...cls,
        instructor: Array.isArray(cls.instructor)
          ? cls.instructor
          : [cls.instructor],
      })) ?? [];
    return {
      ...data,
      slug,
      class: normalizedClass,
    };
  },
});

export default defineConfig({
  collections: [courses],
});
