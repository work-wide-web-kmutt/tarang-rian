import { z } from "zod";

export const GenElectiveOptionSchema = z.object({
  code: z.string(),
  name: z.string(),
  year: z.string(),
  semester: z.enum(["1", "2", "S"]),
  class: z.array(
    z.object({
      group: z.string(),
      day: z.enum([
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ]),
      start: z.string().regex(/^\d{2}:\d{2}$/),
      end: z.string().regex(/^\d{2}:\d{2}$/),
      instructor: z
        .array(z.string())
        .min(1, "At least one instructor is required"),
    })
  ),
});

export type GenElectiveOption = z.infer<typeof GenElectiveOptionSchema>;
export type Semester = GenElectiveOption["semester"];
