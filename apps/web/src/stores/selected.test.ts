import { describe, expect, test } from "bun:test";
import type { AcademicTerm } from "@/course/academic-term";
import {
  importSessionsForTerm,
  migrateSelectedStorageValue,
  normalizeSelectedSession,
  type SelectedClassSession,
} from "./selected";

const term2025: AcademicTerm = { year: "2025", semester: "2" };
const term2026: AcademicTerm = { year: "2026", semester: "1" };

function session(
  overrides: Partial<SelectedClassSession> = {}
): SelectedClassSession {
  return {
    id: "session-1",
    courseCode: "GEN101",
    courseName: "Course",
    year: term2025.year,
    semester: term2025.semester,
    instructor: ["Teacher"],
    group: "1",
    day: "Monday",
    start: "09:00",
    end: "10:00",
    type: "fixed",
    ...overrides,
  };
}

describe("selected schedule migration and term isolation", () => {
  test("normalizes legacy rows and drops malformed schedule data", () => {
    const normalized = normalizeSelectedSession(
      {
        courseCode: "GEN101",
        instructor: "Teacher",
        day: "Monday",
        start: "09:00",
        end: "10:00",
      },
      term2026
    );
    expect(normalized).toMatchObject({
      courseCode: "GEN101",
      instructor: ["Teacher"],
      year: "2026",
      semester: "1",
    });
    expect(
      normalizeSelectedSession(
        { day: "Monday", start: "bad", end: "10:00" },
        term2026
      )
    ).toBeNull();
  });

  test("migrates raw-array and pre-persist formats", () => {
    const raw = migrateSelectedStorageValue([
      { courseCode: "GEN101", day: "Monday", start: "09:00", end: "10:00" },
    ]);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw as string)).toMatchObject({
      version: 0,
      state: { selected: [{ courseCode: "GEN101" }] },
    });

    const prePersist = migrateSelectedStorageValue({ selected: [] });
    expect(JSON.parse(prePersist as string)).toEqual({
      version: 0,
      state: { selected: [] },
    });
  });

  test("keeps identical classes separate by term and deduplicates within term", () => {
    const archived = session({
      year: term2026.year,
      semester: term2026.semester,
      id: "archived",
    });
    const imported = { ...session(), id: "incoming" };
    const existing = [session(), archived];

    const merged = importSessionsForTerm(
      existing,
      term2025,
      [imported],
      "merge"
    );
    expect(merged).toHaveLength(2);

    const secondTerm = importSessionsForTerm(
      existing,
      term2026,
      [imported],
      "merge"
    );
    expect(secondTerm).toHaveLength(2);
    expect(
      secondTerm.filter((item) => item.year === term2026.year)
    ).toHaveLength(1);
  });

  test("replace changes only active term", () => {
    const existing = [
      session(),
      session({
        year: term2026.year,
        semester: term2026.semester,
        id: "other",
      }),
    ];
    const replacement = importSessionsForTerm(
      existing,
      term2025,
      [session({ courseCode: "GEN202" })],
      "replace"
    );

    expect(replacement).toHaveLength(2);
    expect(replacement.find((item) => item.year === term2026.year)?.id).toBe(
      "other"
    );
    expect(
      replacement.find((item) => item.year === term2025.year)?.courseCode
    ).toBe("GEN202");
  });
});
