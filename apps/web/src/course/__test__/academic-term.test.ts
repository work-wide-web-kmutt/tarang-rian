import { describe, expect, test } from "vitest";

import {
  academicTermKey,
  availableAcademicTerms,
  compareAcademicTerms,
  latestAcademicTerm,
  prefilledAcademicTerms,
  uniqueAcademicTerms,
} from "@/course/academic-term";
import type { AcademicTerm } from "@/course/academic-term";

describe("academic terms", () => {
  test("deduplicates catalog and archived terms", () => {
    const terms: AcademicTerm[] = [
      { semester: "1", year: "2025" },
      { semester: "2", year: "2025" },
      { semester: "2", year: "2025" },
      { semester: "S", year: "2024" },
    ];

    expect(uniqueAcademicTerms(terms)).toEqual([
      { semester: "2", year: "2025" },
      { semester: "1", year: "2025" },
      { semester: "S", year: "2024" },
    ]);
  });

  test("sorts semesters newest-first as S, 2, 1", () => {
    expect(
      [
        { semester: "1" as const, year: "2025" },
        { semester: "S" as const, year: "2025" },
        { semester: "2" as const, year: "2025" },
      ].toSorted(compareAcademicTerms)
    ).toEqual([
      { semester: "S", year: "2025" },
      { semester: "2", year: "2025" },
      { semester: "1", year: "2025" },
    ]);
    expect(latestAcademicTerm([{ semester: "2", year: "2023" }])).toEqual({
      semester: "2",
      year: "2023",
    });
  });

  test("uses stable term key", () => {
    expect(academicTermKey({ semester: "2", year: "2025" })).toBe("2025-2");
  });

  test("includes catalog, archived, and active terms in selector options", () => {
    expect(
      availableAcademicTerms(
        [{ semester: "2", year: "2025" }],
        [{ semester: "1", year: "2024" }],
        { semester: "S", year: "2023" }
      )
    ).toEqual([
      { semester: "2", year: "2025" },
      { semester: "1", year: "2024" },
      { semester: "S", year: "2023" },
    ]);
  });

  test("prefills future academic years with all semesters", () => {
    expect(prefilledAcademicTerms("2025", 2)).toEqual([
      { semester: "1", year: "2025" },
      { semester: "2", year: "2025" },
      { semester: "S", year: "2025" },
      { semester: "1", year: "2026" },
      { semester: "2", year: "2026" },
      { semester: "S", year: "2026" },
    ]);
  });
});
