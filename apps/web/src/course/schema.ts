import { z } from "zod";

export const GenElectiveOptionSchema = z.object({
  class: z.array(
    z.object({
      day: z.enum([
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ]),
      end: z.string().regex(/^\d{2}:\d{2}$/u),
      group: z.string(),
      instructor: z
        .array(z.string())
        .min(1, "At least one instructor is required"),
      start: z.string().regex(/^\d{2}:\d{2}$/u),
    })
  ),
  code: z.string(),
  content: z.string(),
  name: z.string(),
  semester: z.enum(["1", "2", "S"]),
  year: z.string(),
});

export type GenElectiveOption = z.infer<typeof GenElectiveOptionSchema>;
export type Semester = GenElectiveOption["semester"];
