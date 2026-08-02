import { describe, expect, test } from "bun:test";

import { restoreAcademicTerm } from "@/stores/academic-context";

describe("academic context persistence", () => {
  test("restores valid persisted term", () => {
    expect(
      restoreAcademicTerm({ activeTerm: { semester: "S", year: "2024" } })
    ).toEqual({ semester: "S", year: "2024" });
  });

  test("falls back when persisted term is invalid", () => {
    const fallback = { semester: "2" as const, year: "2025" };
    expect(
      restoreAcademicTerm({ activeTerm: { semester: "3", year: "" } }, fallback)
    ).toEqual(fallback);
  });
});
