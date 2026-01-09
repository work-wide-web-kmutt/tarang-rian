import { z } from "zod";

export const GenElectiveOptionSchema = z.object({
  code: z.string(),
  name: z.string(),
  day: z.enum([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]),
  class: z.array(
    z.object({
      group: z.string(),
      start: z.string().regex(/^\d{2}:\d{2}$/),
      end: z.string().regex(/^\d{2}:\d{2}$/),
    })
  ),
  instructor: z.string(),
});

export type GenElectiveOption = z.infer<typeof GenElectiveOptionSchema>;
