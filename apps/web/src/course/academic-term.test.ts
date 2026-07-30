import { describe, expect, test } from "bun:test";
import {
  type AcademicTerm,
  academicTermKey,
  availableAcademicTerms,
  compareAcademicTerms,
  latestAcademicTerm,
  uniqueAcademicTerms,
} from "./academic-term";

describe("academic terms", () => {
  test("deduplicates catalog and archived terms", () => {
    const terms: AcademicTerm[] = [
      { year: "2025", semester: "1" },
      { year: "2025", semester: "2" },
      { year: "2025", semester: "2" },
      { year: "2024", semester: "S" },
    ];

    expect(uniqueAcademicTerms(terms)).toEqual([
      { year: "2025", semester: "2" },
      { year: "2025", semester: "1" },
      { year: "2024", semester: "S" },
    ]);
  });

  test("sorts semesters newest-first as S, 2, 1", () => {
    expect(
      [
        { year: "2025", semester: "1" as const },
        { year: "2025", semester: "S" as const },
        { year: "2025", semester: "2" as const },
      ].sort(compareAcademicTerms)
    ).toEqual([
      { year: "2025", semester: "S" },
      { year: "2025", semester: "2" },
      { year: "2025", semester: "1" },
    ]);
    expect(latestAcademicTerm([{ year: "2023", semester: "2" }])).toEqual({
      year: "2023",
      semester: "2",
    });
  });

  test("uses stable term key", () => {
    expect(academicTermKey({ year: "2025", semester: "2" })).toBe("2025-2");
  });

  test("includes catalog, archived, and active terms in selector options", () => {
    expect(
      availableAcademicTerms(
        [{ year: "2025", semester: "2" }],
        [{ year: "2024", semester: "1" }],
        { year: "2023", semester: "S" }
      )
    ).toEqual([
      { year: "2025", semester: "2" },
      { year: "2024", semester: "1" },
      { year: "2023", semester: "S" },
    ]);
  });
});
