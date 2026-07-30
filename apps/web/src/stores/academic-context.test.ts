import { describe, expect, test } from "bun:test";
import { restoreAcademicTerm } from "./academic-context";

describe("academic context persistence", () => {
  test("restores valid persisted term", () => {
    expect(
      restoreAcademicTerm({ activeTerm: { year: "2024", semester: "S" } })
    ).toEqual({ year: "2024", semester: "S" });
  });

  test("falls back when persisted term is invalid", () => {
    const fallback = { year: "2025", semester: "2" as const };
    expect(
      restoreAcademicTerm({ activeTerm: { year: "", semester: "3" } }, fallback)
    ).toEqual(fallback);
  });
});
