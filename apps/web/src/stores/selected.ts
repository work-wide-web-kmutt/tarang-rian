import { allCourses } from "content-collections";
import i18n from "i18next";
import { v7 } from "uuid";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  academicTermKey,
  DEFAULT_ACADEMIC_TERM,
  isAcademicTerm,
  latestAcademicTerm,
  sameAcademicTerm,
} from "@/course/academic-term";
import type { AcademicTerm } from "@/course/academic-term";
import type { GenElectiveOption } from "@/course/schema";
import { useActiveAcademicTerm } from "@/stores/academic-context";

export interface SelectedClassSession {
  id: string;
  courseCode: string;
  courseName: string;
  year: string;
  semester: GenElectiveOption["semester"];
  instructor: string[];
  group: string;
  day: GenElectiveOption["class"][number]["day"];
  start: string;
  end: string;
  type: "fixed" | "custom";
}

type SessionUpdates = Omit<
  SelectedClassSession,
  "id" | "type" | "year" | "semester"
>;

interface SelectedGenElectivesState {
  selected: SelectedClassSession[];
  actions: {
    add: (
      course: GenElectiveOption,
      classSession: GenElectiveOption["class"][number]
    ) => void;
    addCustom: (
      term: AcademicTerm,
      day: GenElectiveOption["class"][number]["day"],
      start: string,
      end: string
    ) => SelectedClassSession | null;
    remove: (id: string) => void;
    update: (
      id: string,
      newDay: GenElectiveOption["class"][number]["day"],
      newStart: string,
      newEnd: string
    ) => void;
    updateSession: (id: string, updates: SessionUpdates) => void;
    clear: () => void;
    clearTerm: (term: AcademicTerm) => void;
    importSchedule: (
      term: AcademicTerm,
      sessions: SelectedClassSession[],
      mode: "replace" | "merge"
    ) => void;
  };
}

const catalogDefaultTerm = latestAcademicTerm(
  allCourses.map((course) => ({ semester: course.semester, year: course.year }))
);

const DAY_VALUES = new Set([
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]);

const TIME_PATTERN = /^\d{2}:\d{2}$/u;

function getFallbackTerm(): AcademicTerm {
  return catalogDefaultTerm ?? DEFAULT_ACADEMIC_TERM;
}

function normalizeSessionYear(value: unknown, fallback: string): string {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return String(value);
  }
  return fallback;
}

function isSelectedSessionDay(
  value: unknown
): value is SelectedClassSession["day"] {
  return typeof value === "string" && DAY_VALUES.has(value);
}

function isValidSessionTime(value: unknown): value is string {
  return typeof value === "string" && TIME_PATTERN.test(value);
}

function hasValidSessionSchedule(
  candidate: Partial<SelectedClassSession>
): candidate is Partial<SelectedClassSession> & {
  day: SelectedClassSession["day"];
  start: string;
  end: string;
} {
  return (
    isSelectedSessionDay(candidate.day) &&
    isValidSessionTime(candidate.start) &&
    isValidSessionTime(candidate.end)
  );
}

function normalizeInstructors(
  value: Partial<SelectedClassSession>["instructor"]
): string[] {
  if (Array.isArray(value)) {
    const instructors = value.filter(
      (instructor): instructor is string => typeof instructor === "string"
    );
    return instructors.length > 0 ? instructors : ["TBA"];
  }
  if (typeof value === "string") {
    return [value];
  }
  return ["TBA"];
}

export function selectedSessionKey(session: SelectedClassSession): string {
  return [
    academicTermKey({ semester: session.semester, year: session.year }),
    session.type,
    session.courseCode,
    session.group,
    session.day,
    session.start,
    session.end,
  ].join("|");
}

export function normalizeSelectedSession(
  session: unknown,
  fallbackTerm: AcademicTerm = getFallbackTerm()
): SelectedClassSession | null {
  if (session === null || typeof session !== "object") {
    return null;
  }

  const candidate = session as Partial<SelectedClassSession>;
  const year = normalizeSessionYear(candidate.year, fallbackTerm.year);
  const candidateTerm = {
    semester: candidate.semester,
    year,
  };
  const term = isAcademicTerm(candidateTerm)
    ? { semester: candidateTerm.semester, year }
    : fallbackTerm;

  if (!hasValidSessionSchedule(candidate)) {
    return null;
  }

  return {
    courseCode:
      typeof candidate.courseCode === "string" ? candidate.courseCode : "",
    courseName:
      typeof candidate.courseName === "string" ? candidate.courseName : "",
    day: candidate.day,
    end: candidate.end,
    group: typeof candidate.group === "string" ? candidate.group : "",
    id: typeof candidate.id === "string" ? candidate.id : v7(),
    instructor: normalizeInstructors(candidate.instructor),
    semester: term.semester,
    start: candidate.start,
    type: candidate.type === "custom" ? "custom" : "fixed",
    year: term.year,
  };
}

export function normalizeSessions(
  sessions: unknown[],
  fallbackTerm: AcademicTerm = getFallbackTerm()
): SelectedClassSession[] {
  return sessions
    .map((session) => normalizeSelectedSession(session, fallbackTerm))
    .filter((session): session is SelectedClassSession => session !== null);
}

export function importSessionsForTerm(
  existing: readonly SelectedClassSession[],
  term: AcademicTerm,
  sessions: readonly unknown[],
  mode: "replace" | "merge"
): SelectedClassSession[] {
  const imported = normalizeSessions([...sessions], term).map((session) => ({
    ...session,
    id: v7(),
    semester: term.semester,
    year: term.year,
  }));
  const next =
    mode === "replace"
      ? existing.filter((session) => !sameAcademicTerm(session, term))
      : [...existing];
  const keys = new Set(next.map(selectedSessionKey));

  for (const session of imported) {
    const key = selectedSessionKey(session);
    if (!keys.has(key)) {
      next.push(session);
      keys.add(key);
    }
  }

  return next;
}

export function migrateSelectedStorageValue(parsed: unknown): string | null {
  if (Array.isArray(parsed)) {
    return JSON.stringify({
      state: { selected: normalizeSessions(parsed) },
      version: 0,
    });
  }

  if (
    parsed !== null &&
    typeof parsed === "object" &&
    "selected" in parsed &&
    !("state" in parsed)
  ) {
    return JSON.stringify({
      state: {
        selected: normalizeSessions(getSelectedArray(parsed)),
      },
      version: 0,
    });
  }

  return null;
}

function isUnknownArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

function getSelectedArray(value: unknown): unknown[] {
  if (value === null || typeof value !== "object" || !("selected" in value)) {
    return [];
  }

  return isUnknownArray(value.selected) ? value.selected : [];
}

function createSelectedStorage() {
  return {
    getItem: (name: string): string | null => {
      if (typeof window === "undefined") {
        return null;
      }

      try {
        const stored = localStorage.getItem(name);
        if (stored === null || stored === "") {
          return null;
        }

        const parsed: unknown = JSON.parse(stored);
        const migrated = migrateSelectedStorageValue(parsed);
        if (migrated !== null) {
          localStorage.setItem(name, migrated);
          return migrated;
        }

        return stored;
      } catch {
        return null;
      }
    },
    removeItem: (name: string): void => {
      if (typeof window === "undefined") {
        return;
      }

      try {
        localStorage.removeItem(name);
      } catch {
        // Ignore storage errors.
      }
    },
    setItem: (name: string, value: string): void => {
      if (typeof window === "undefined") {
        return;
      }

      try {
        localStorage.setItem(name, value);
      } catch {
        // Ignore storage errors.
      }
    },
  };
}

const useSelectedGenElectivesStore = create<SelectedGenElectivesState>()(
  persist(
    (set) => ({
      actions: {
        add: (course, classSession) => {
          set((state) => {
            const session: SelectedClassSession = {
              courseCode: course.code,
              courseName: course.name,
              day: classSession.day,
              end: classSession.end,
              group: classSession.group,
              id: v7(),
              instructor: classSession.instructor,
              semester: course.semester,
              start: classSession.start,
              type: "fixed",
              year: course.year,
            };

            if (
              state.selected.some(
                (current) =>
                  selectedSessionKey(current) === selectedSessionKey(session)
              )
            ) {
              return state;
            }

            return { selected: [...state.selected, session] };
          });
        },
        addCustom: (term, day, start, end) => {
          let createdSession: SelectedClassSession | null = null;
          set((state) => {
            const customSessions = state.selected.filter(
              (session) =>
                session.type === "custom" && sameAcademicTerm(session, term)
            );
            const session: SelectedClassSession = {
              // oxlint-disable-next-line import/no-named-as-default-member -- use i18next singleton for store-generated labels
              courseCode: i18n.t("translation:schedule.unassigned_code", {
                number: customSessions.length + 1,
              }),
              // oxlint-disable-next-line import/no-named-as-default-member -- use i18next singleton for store-generated labels
              courseName: i18n.t("translation:schedule.unassigned_class"),
              day,
              end,
              group: "TBA",
              id: v7(),
              instructor: ["TBA"],
              semester: term.semester,
              start,
              type: "custom",
              year: term.year,
            };

            if (
              state.selected.some(
                (current) =>
                  selectedSessionKey(current) === selectedSessionKey(session)
              )
            ) {
              return state;
            }

            createdSession = session;
            return { selected: [...state.selected, session] };
          });

          return createdSession;
        },
        clear: () => {
          set({ selected: [] });
        },
        clearTerm: (term) => {
          set((state) => ({
            selected: state.selected.filter(
              (session) => !sameAcademicTerm(session, term)
            ),
          }));
        },
        importSchedule: (term, sessions, mode) => {
          set((state) => ({
            selected: importSessionsForTerm(
              state.selected,
              term,
              sessions,
              mode
            ),
          }));
        },
        remove: (id) => {
          set((state) => ({
            selected: state.selected.filter((session) => session.id !== id),
          }));
        },
        update: (id, newDay, newStart, newEnd) => {
          set((state) => ({
            selected: state.selected.map((session) =>
              session.id === id
                ? { ...session, day: newDay, end: newEnd, start: newStart }
                : session
            ),
          }));
        },
        updateSession: (id, updates) => {
          set((state) => ({
            selected: state.selected.map((session) =>
              session.id === id ? { ...session, ...updates } : session
            ),
          }));
        },
      },
      selected: [],
    }),
    {
      migrate: (persistedState: unknown) => {
        const selected = getSelectedArray(persistedState);
        return { selected: normalizeSessions(selected) };
      },
      name: "selected-gen-electives-storage",
      partialize: (state) => ({ selected: state.selected }),
      storage: createJSONStorage(() => createSelectedStorage()),
      version: 1,
    }
  )
);

export function useSelectedGenElectives(): SelectedClassSession[] {
  return useSelectedGenElectivesStore((state) => state.selected);
}

export function useActiveSelectedSessions(): SelectedClassSession[] {
  const selected = useSelectedGenElectives();
  const activeTerm = useActiveAcademicTerm();
  return selected.filter((session) => sameAcademicTerm(session, activeTerm));
}

export function useSelectedGenElectivesActions(): SelectedGenElectivesState["actions"] {
  return useSelectedGenElectivesStore((state) => state.actions);
}
