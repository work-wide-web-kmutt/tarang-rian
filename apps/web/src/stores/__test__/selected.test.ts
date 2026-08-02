import { describe, expect, test } from "vitest";

import type { AcademicTerm } from "@/course/academic-term";
import {
  importSessionsForTerm,
  migrateSelectedStorageValue,
  normalizeSelectedSession,
} from "@/stores/selected";
import type { SelectedClassSession } from "@/stores/selected";

const term2025: AcademicTerm = { semester: "2", year: "2025" };
const term2026: AcademicTerm = { semester: "1", year: "2026" };

function session(
  overrides: Partial<SelectedClassSession> = {}
): SelectedClassSession {
  return {
    courseCode: "GEN101",
    courseName: "Course",
    day: "Monday",
    end: "10:00",
    group: "1",
    id: "session-1",
    instructor: ["Teacher"],
    semester: term2025.semester,
    start: "09:00",
    type: "fixed",
    year: term2025.year,
    ...overrides,
  };
}

describe("selected schedule migration and term isolation", () => {
  test("normalizes legacy rows and drops malformed schedule data", () => {
    const normalized = normalizeSelectedSession(
      {
        courseCode: "GEN101",
        day: "Monday",
        end: "10:00",
        instructor: "Teacher",
        start: "09:00",
      },
      term2026
    );
    expect(normalized).toMatchObject({
      courseCode: "GEN101",
      instructor: ["Teacher"],
      semester: "1",
      year: "2026",
    });
    expect(
      normalizeSelectedSession(
        { day: "Monday", end: "10:00", start: "bad" },
        term2026
      )
    ).toBeNull();
  });

  test("migrates raw-array and pre-persist formats", () => {
    const raw = migrateSelectedStorageValue([
      { courseCode: "GEN101", day: "Monday", end: "10:00", start: "09:00" },
    ]);
    expect(raw).not.toBeNull();
    if (raw === null) {
      throw new Error("Expected migrated storage value");
    }
    expect(JSON.parse(raw)).toMatchObject({
      state: { selected: [{ courseCode: "GEN101" }] },
      version: 0,
    });

    const prePersist = migrateSelectedStorageValue({ selected: [] });
    if (prePersist === null) {
      throw new Error("Expected migrated storage value");
    }
    expect(JSON.parse(prePersist)).toEqual({
      state: { selected: [] },
      version: 0,
    });
  });

  test("keeps identical classes separate by term and deduplicates within term", () => {
    const archived = session({
      id: "archived",
      semester: term2026.semester,
      year: term2026.year,
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
        id: "other",
        semester: term2026.semester,
        year: term2026.year,
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
