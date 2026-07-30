import type { GenElectiveOption } from "./schema";

export type Semester = GenElectiveOption["semester"];

export interface AcademicTerm {
  year: string;
  semester: Semester;
}

export const SEMESTERS: readonly Semester[] = ["1", "2", "S"];

const SEMESTER_ORDER: Record<Semester, number> = {
  "1": 0,
  "2": 1,
  S: 2,
};

export const DEFAULT_ACADEMIC_TERM: AcademicTerm = {
  year: "2025",
  semester: "2",
};

export function academicTermKey(term: AcademicTerm): string {
  return `${term.year}-${term.semester}`;
}

export function isAcademicTerm(value: unknown): value is AcademicTerm {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<AcademicTerm>;
  return (
    typeof candidate.year === "string" &&
    candidate.year.length > 0 &&
    typeof candidate.semester === "string" &&
    SEMESTERS.includes(candidate.semester as Semester)
  );
}

export function sameAcademicTerm(
  first: AcademicTerm,
  second: AcademicTerm
): boolean {
  return academicTermKey(first) === academicTermKey(second);
}

export function compareAcademicTerms(
  first: AcademicTerm,
  second: AcademicTerm
): number {
  const yearDifference = Number(second.year) - Number(first.year);
  if (!Number.isNaN(yearDifference) && yearDifference !== 0) {
    return yearDifference;
  }

  const yearOrder = second.year.localeCompare(first.year);
  if (yearOrder !== 0) {
    return yearOrder;
  }

  return SEMESTER_ORDER[second.semester] - SEMESTER_ORDER[first.semester];
}

export function uniqueAcademicTerms(
  terms: readonly AcademicTerm[]
): AcademicTerm[] {
  const unique = new Map<string, AcademicTerm>();
  for (const term of terms) {
    if (isAcademicTerm(term)) {
      unique.set(academicTermKey(term), term);
    }
  }

  return [...unique.values()].sort(compareAcademicTerms);
}

export function latestAcademicTerm(
  terms: readonly AcademicTerm[],
  fallback: AcademicTerm = DEFAULT_ACADEMIC_TERM
): AcademicTerm {
  return uniqueAcademicTerms(terms)[0] ?? fallback;
}

export function termFromSession(session: {
  year: string;
  semester: Semester;
}): AcademicTerm {
  return { year: session.year, semester: session.semester };
}
