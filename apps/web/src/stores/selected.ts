import { allCourses } from "content-collections";
import i18n from "i18next";
import { v7 } from "uuid";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  type AcademicTerm,
  academicTermKey,
  DEFAULT_ACADEMIC_TERM,
  isAcademicTerm,
  latestAcademicTerm,
  sameAcademicTerm,
} from "@/course/academic-term";
import type { GenElectiveOption } from "@/course/schema";
import { useActiveAcademicTerm } from "./academic-context";

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
  allCourses.map((course) => ({ year: course.year, semester: course.semester }))
);

const DAY_VALUES = new Set<SelectedClassSession["day"]>([
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]);

const TIME_PATTERN = /^\d{2}:\d{2}$/;

function getFallbackTerm(): AcademicTerm {
  return catalogDefaultTerm ?? DEFAULT_ACADEMIC_TERM;
}

export function selectedSessionKey(session: SelectedClassSession): string {
  return [
    academicTermKey({ year: session.year, semester: session.semester }),
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
  if (!session || typeof session !== "object") {
    return null;
  }

  const candidate = session as Partial<SelectedClassSession>;
  let year = fallbackTerm.year;
  if (typeof candidate.year === "string") {
    year = candidate.year;
  } else if (typeof candidate.year === "number") {
    year = String(candidate.year);
  }
  const candidateTerm = {
    year,
    semester: candidate.semester,
  };
  const term = isAcademicTerm(candidateTerm)
    ? { year, semester: candidateTerm.semester }
    : fallbackTerm;

  if (
    typeof candidate.day !== "string" ||
    !DAY_VALUES.has(candidate.day as SelectedClassSession["day"]) ||
    typeof candidate.start !== "string" ||
    !TIME_PATTERN.test(candidate.start) ||
    typeof candidate.end !== "string" ||
    !TIME_PATTERN.test(candidate.end)
  ) {
    return null;
  }

  let instructor = ["TBA"];
  if (Array.isArray(candidate.instructor)) {
    instructor = candidate.instructor.filter(
      (value): value is string => typeof value === "string"
    );
  } else if (typeof candidate.instructor === "string") {
    instructor = [candidate.instructor];
  }

  return {
    id: typeof candidate.id === "string" ? candidate.id : v7(),
    courseCode:
      typeof candidate.courseCode === "string" ? candidate.courseCode : "",
    courseName:
      typeof candidate.courseName === "string" ? candidate.courseName : "",
    year: term.year,
    semester: term.semester,
    instructor: instructor.length > 0 ? instructor : ["TBA"],
    group: typeof candidate.group === "string" ? candidate.group : "",
    day: candidate.day as SelectedClassSession["day"],
    start: candidate.start,
    end: candidate.end,
    type: candidate.type === "custom" ? "custom" : "fixed",
  };
}

function normalizeSessions(
  sessions: unknown[],
  fallbackTerm: AcademicTerm = getFallbackTerm()
): SelectedClassSession[] {
  return sessions
    .map((session) => normalizeSelectedSession(session, fallbackTerm))
    .filter((session): session is SelectedClassSession => session !== null);
}

function migrateToPersistFormat(parsed: unknown): string | null {
  if (Array.isArray(parsed)) {
    return JSON.stringify({
      state: { selected: normalizeSessions(parsed) },
      version: 0,
    });
  }

  if (
    parsed &&
    typeof parsed === "object" &&
    "selected" in parsed &&
    !("state" in parsed)
  ) {
    return JSON.stringify({
      state: {
        selected: normalizeSessions(
          Array.isArray((parsed as { selected: unknown }).selected)
            ? (parsed as { selected: unknown[] }).selected
            : []
        ),
      },
      version: 0,
    });
  }

  return null;
}

const createSelectedStorage = () => ({
  getItem: (name: string): string | null => {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const stored = localStorage.getItem(name);
      if (!stored) {
        return null;
      }

      const parsed = JSON.parse(stored);
      const migrated = migrateToPersistFormat(parsed);
      if (migrated) {
        localStorage.setItem(name, migrated);
        return migrated;
      }

      return stored;
    } catch {
      return null;
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
});

const useSelectedGenElectivesStore = create<SelectedGenElectivesState>()(
  persist(
    (set) => ({
      selected: [],
      actions: {
        add: (course, classSession) =>
          set((state) => {
            const session: SelectedClassSession = {
              id: v7(),
              courseCode: course.code,
              courseName: course.name,
              year: course.year,
              semester: course.semester,
              instructor: classSession.instructor,
              group: classSession.group,
              day: classSession.day,
              start: classSession.start,
              end: classSession.end,
              type: "fixed",
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
          }),
        addCustom: (term, day, start, end) => {
          let createdSession: SelectedClassSession | null = null;
          set((state) => {
            const customSessions = state.selected.filter(
              (session) =>
                session.type === "custom" && sameAcademicTerm(session, term)
            );
            const session: SelectedClassSession = {
              id: v7(),
              courseCode: i18n.t("translation:schedule.unassigned_code", {
                number: customSessions.length + 1,
              }),
              courseName: i18n.t("translation:schedule.unassigned_class"),
              year: term.year,
              semester: term.semester,
              instructor: ["TBA"],
              group: "TBA",
              day,
              start,
              end,
              type: "custom",
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
        remove: (id) =>
          set((state) => ({
            selected: state.selected.filter((session) => session.id !== id),
          })),
        update: (id, newDay, newStart, newEnd) =>
          set((state) => ({
            selected: state.selected.map((session) =>
              session.id === id
                ? { ...session, day: newDay, start: newStart, end: newEnd }
                : session
            ),
          })),
        updateSession: (id, updates) =>
          set((state) => ({
            selected: state.selected.map((session) =>
              session.id === id ? { ...session, ...updates } : session
            ),
          })),
        clear: () => set({ selected: [] }),
        clearTerm: (term) =>
          set((state) => ({
            selected: state.selected.filter(
              (session) => !sameAcademicTerm(session, term)
            ),
          })),
        importSchedule: (term, sessions, mode) =>
          set((state) => {
            const imported = normalizeSessions(sessions, term).map(
              (session) => ({
                ...session,
                id: v7(),
                year: term.year,
                semester: term.semester,
              })
            );
            const existing =
              mode === "replace"
                ? state.selected.filter(
                    (session) => !sameAcademicTerm(session, term)
                  )
                : [...state.selected];
            const keys = new Set(existing.map(selectedSessionKey));

            for (const session of imported) {
              const key = selectedSessionKey(session);
              if (!keys.has(key)) {
                existing.push(session);
                keys.add(key);
              }
            }

            return { selected: existing };
          }),
      },
    }),
    {
      name: "selected-gen-electives-storage",
      version: 1,
      storage: createJSONStorage(() => createSelectedStorage()),
      partialize: (state) => ({ selected: state.selected }),
      migrate: (persistedState: unknown) => {
        const selected =
          persistedState &&
          typeof persistedState === "object" &&
          "selected" in persistedState &&
          Array.isArray((persistedState as { selected: unknown }).selected)
            ? (persistedState as { selected: unknown[] }).selected
            : [];
        return { selected: normalizeSessions(selected) };
      },
    }
  )
);

export const useSelectedGenElectives = () =>
  useSelectedGenElectivesStore((state) => state.selected);

export const useActiveSelectedSessions = () => {
  const selected = useSelectedGenElectives();
  const activeTerm = useActiveAcademicTerm();
  return selected.filter((session) => sameAcademicTerm(session, activeTerm));
};

export const useSelectedGenElectivesActions = () =>
  useSelectedGenElectivesStore((state) => state.actions);
