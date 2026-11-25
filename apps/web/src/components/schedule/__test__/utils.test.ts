import { describe, expect, test } from "vitest";

import { getSessionColorClasses } from "@/components/schedule/utils";
import { COURSE_COLORS } from "@/constants/schedule";
import type { SelectedClassSession } from "@/stores/selected";

function session(courseCode: string, id = courseCode): SelectedClassSession {
  return {
    courseCode,
    courseName: "Course",
    day: "Monday",
    end: "10:00",
    group: "1",
    id,
    instructor: ["Teacher"],
    semester: "2",
    start: "09:00",
    type: "fixed",
    year: "2025",
  };
}

describe(getSessionColorClasses, () => {
  const sessions = [
    session("GEN101", "a"),
    session("GEN102", "b"),
    session("GEN101", "c"),
  ];

  test("gives every block of a course the same color, in order of first appearance", () => {
    const [first, second, third] = sessions.map((current) =>
      getSessionColorClasses(current, sessions, "course", false)
    );

    expect(first?.block).toContain(COURSE_COLORS[0]);
    expect(second?.block).toContain(COURSE_COLORS[1]);
    expect(third).toEqual(first);
  });

  test("wraps around the palette when there are more courses than colors", () => {
    const many = Array.from({ length: COURSE_COLORS.length + 1 }, (_, i) =>
      session(`C${i}`)
    );
    const last = many.at(-1);
    if (last === undefined) {
      throw new Error("expected a session");
    }

    expect(getSessionColorClasses(last, many, "course", false).block).toContain(
      COURSE_COLORS[0]
    );
  });

  test("keeps the course color but marks overlaps in course mode", () => {
    const result = getSessionColorClasses(
      sessions[1],
      sessions,
      "course",
      true
    );

    expect(result.block).toContain(COURSE_COLORS[1]);
    expect(result.block).toContain("ring-destructive");
  });

  test("uses the theme colors in single mode", () => {
    expect(
      getSessionColorClasses(sessions[0], sessions, "single", false)
    ).toEqual({
      block: "border-primary bg-primary",
      text: "text-primary-foreground",
    });
    expect(
      getSessionColorClasses(sessions[0], sessions, "single", true).block
    ).toBe("border-destructive bg-destructive/40");
  });
});
