import i18n from "i18next";
import { v7 } from "uuid";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { GenElectiveOption } from "../course/schema";
import { getAcademicContext } from "./academic-context";

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

interface SelectedGenElectivesState {
  selected: SelectedClassSession[];
  actions: {
    add: (
      course: GenElectiveOption,
      classSession: GenElectiveOption["class"][number]
    ) => void;
    addCustom: (
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
    updateSession: (
      id: string,
      updates: {
        courseCode: string;
        courseName: string;
        instructor: string[];
        group: string;
        day: GenElectiveOption["class"][number]["day"];
        year: string;
        semester: GenElectiveOption["semester"];
        start: string;
        end: string;
      }
    ) => void;
    clear: () => void;
    importSchedule: (
      sessions: SelectedClassSession[],
      mode: "replace" | "merge"
    ) => void;
  };
}

const transformSession = (session: unknown): SelectedClassSession | null => {
  if (!session || typeof session !== "object") {
    return null;
  }

  const s = session as Partial<SelectedClassSession>;
  return {
    ...s,
    id: s.id ?? v7(),
    type: s.type ?? "fixed",
    courseCode: s.courseCode ?? "",
    courseName: s.courseName ?? "",
    instructor: (() => {
      if (Array.isArray(s.instructor)) {
        return s.instructor;
      }
      if (s.instructor) {
        return [s.instructor];
      }
      return ["TBA"];
    })(),
    group: s.group ?? "",
    year: s.year ?? "",
  } as SelectedClassSession;
};

const migrateToPersistFormat = (parsed: unknown): string | null => {
  if (Array.isArray(parsed)) {
    const migrated = parsed
      .map(transformSession)
      .filter((session): session is SelectedClassSession => session !== null);
    const persistFormat = {
      state: { selected: migrated },
      version: 0,
    };
    return JSON.stringify(persistFormat);
  }

  if (
    parsed &&
    typeof parsed === "object" &&
    "selected" in parsed &&
    !("state" in parsed)
  ) {
    const persistFormat = {
      state: { selected: (parsed as { selected: unknown }).selected },
      version: 0,
    };
    return JSON.stringify(persistFormat);
  }

  return null;
};

const createSelectedStorage = () => {
  return {
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
        // Ignore storage errors
      }
    },
    removeItem: (name: string): void => {
      if (typeof window === "undefined") {
        return;
      }
      try {
        localStorage.removeItem(name);
      } catch {
        // Ignore storage errors
      }
    },
  };
};

const useSelectedGenElectivesStore = create<SelectedGenElectivesState>()(
  persist(
    (set) => ({
      selected: [],
      actions: {
        add: (
          course: GenElectiveOption,
          classSession: GenElectiveOption["class"][number]
        ) =>
          set((state) => {
            const exists = state.selected.some(
              (current) =>
                current.courseCode === course.code &&
                current.group === classSession.group &&
                current.day === classSession.day &&
                current.start === classSession.start &&
                current.end === classSession.end
            );

            if (exists) {
              return state;
            }

            const newSession: SelectedClassSession = {
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

            const updated = [...state.selected, newSession];
            return { selected: updated };
          }),
        addCustom: (
          day: GenElectiveOption["class"][number]["day"],
          start: string,
          end: string
        ) => {
          let createdSession: SelectedClassSession | null = null;
          set((state) => {
            const exists = state.selected.some(
              (current) =>
                current.courseCode?.toLowerCase().startsWith("unassigned") &&
                current.day === day &&
                current.start === start &&
                current.end === end
            );

            if (exists) {
              return state;
            }

            const academicContext = getAcademicContext();
            const newSession: SelectedClassSession = {
              id: v7(),
              courseCode: i18n.t("translation:schedule.unassigned_code", {
                number: state.selected.length + 1,
              }),
              courseName: i18n.t("translation:schedule.unassigned_class"),
              year: academicContext.currentYear.toString(),
              semester: academicContext.currentSemester,
              instructor: ["TBA"],
              group: "TBA",
              day,
              start,
              end,
              type: "custom",
            };

            createdSession = newSession;
            const updated = [...state.selected, newSession];
            return { selected: updated };
          });

          return createdSession;
        },
        remove: (id: string) =>
          set((state) => {
            const updated = state.selected.filter(
              (session) => session.id !== id
            );
            return { selected: updated };
          }),
        update: (
          id: string,
          newDay: GenElectiveOption["class"][number]["day"],
          newStart: string,
          newEnd: string
        ) =>
          set((state) => {
            const updated = state.selected.map((session) => {
              if (session.id === id) {
                return {
                  ...session,
                  day: newDay,
                  start: newStart,
                  end: newEnd,
                };
              }
              return session;
            });
            return { selected: updated };
          }),
        updateSession: (
          id: string,
          updates: {
            courseCode: string;
            courseName: string;
            instructor: string[];
            group: string;
            day: GenElectiveOption["class"][number]["day"];
            year: string;
            semester: GenElectiveOption["semester"];
            start: string;
            end: string;
          }
        ) =>
          set((state) => {
            const updated = state.selected.map((session) => {
              if (session.id === id) {
                return {
                  ...session,
                  courseCode: updates.courseCode,
                  courseName: updates.courseName,
                  instructor: updates.instructor,
                  group: updates.group,
                  day: updates.day,
                  year: updates.year,
                  semester: updates.semester,
                  start: updates.start,
                  end: updates.end,
                };
              }
              return session;
            });
            return { selected: updated };
          }),
        clear: () => {
          set({ selected: [] });
        },
        importSchedule: (
          sessions: SelectedClassSession[],
          mode: "replace" | "merge"
        ) =>
          set((state) => {
            // Regenerate IDs to avoid conflicts
            const importedSessions = sessions.map((session) => ({
              ...session,
              id: v7(),
              type: session.type ?? "fixed",
              courseCode: session.courseCode ?? "",
              courseName: session.courseName ?? "",
              instructor: (() => {
                if (Array.isArray(session.instructor)) {
                  return session.instructor;
                }
                if (session.instructor) {
                  return [session.instructor];
                }
                return ["TBA"];
              })(),
              group: session.group ?? "",
              year: session.year ?? "",
            }));

            const updated =
              mode === "replace"
                ? importedSessions
                : [...state.selected, ...importedSessions];

            return { selected: updated };
          }),
      },
    }),
    {
      name: "selected-gen-electives-storage",
      storage: createJSONStorage(() => createSelectedStorage()),
      partialize: (state) => ({ selected: state.selected }),
    }
  )
);

export const useSelectedGenElectives = () =>
  useSelectedGenElectivesStore((state) => state.selected);

export const useSelectedGenElectivesActions = () =>
  useSelectedGenElectivesStore((state) => state.actions);
