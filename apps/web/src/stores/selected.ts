import { v7 } from "uuid";
import { create, type StateCreator } from "zustand";

import type { GenElectiveOption } from "../course/schema";
import { getAcademicContext } from "./academic-context";

export interface SelectedClassSession {
  id: string;
  courseCode: string;
  courseName: string;
  year: string;
  semester: GenElectiveOption["semester"];
  instructor: string;
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
        instructor: string;
      }
    ) => void;
    clear: () => void;
  };
}

const STORAGE_KEY = "selected-gen-electives-storage";

const getStoredSelected = (): SelectedClassSession[] => {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored) as SelectedClassSession[];
    return parsed.map((session) => ({
      ...session,
      id: session.id ?? v7(),
      type: session.type ?? "fixed",
    }));
  } catch {
    return [];
  }
};

const saveToStorage = (selected: SelectedClassSession[]) => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
  } catch {
    // Ignore storage errors
  }
};

const selectedGenElectivesStoreCreator: StateCreator<
  SelectedGenElectivesState
> = (set) => ({
  selected: getStoredSelected(),
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
          instructor: course.instructor,
          group: classSession.group,
          day: classSession.day,
          start: classSession.start,
          end: classSession.end,
          type: "fixed",
        };

        const updated = [...state.selected, newSession];
        saveToStorage(updated);
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
            current.courseCode.toLowerCase().startsWith("unassigned") &&
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
          courseCode: `Unassigned (${state.selected.length + 1})`,
          courseName: "Unassigned Class",
          year: academicContext.currentYear.toString(),
          semester: academicContext.currentSemester,
          instructor: "TBA",
          group: "TBA",
          day,
          start,
          end,
          type: "custom",
        };

        createdSession = newSession;
        const updated = [...state.selected, newSession];
        saveToStorage(updated);
        return { selected: updated };
      });

      return createdSession;
    },
    remove: (id: string) =>
      set((state) => {
        const updated = state.selected.filter((session) => session.id !== id);
        saveToStorage(updated);
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
        saveToStorage(updated);
        return { selected: updated };
      }),
    updateSession: (
      id: string,
      updates: {
        courseCode: string;
        courseName: string;
        instructor: string;
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
            };
          }
          return session;
        });
        saveToStorage(updated);
        return { selected: updated };
      }),
    clear: () => {
      saveToStorage([]);
      set({ selected: [] });
    },
  },
});

const useSelectedGenElectivesStore = create<SelectedGenElectivesState>(
  selectedGenElectivesStoreCreator
);

export const useSelectedGenElectives = () =>
  useSelectedGenElectivesStore((state) => state.selected);

export const useSelectedGenElectivesActions = () =>
  useSelectedGenElectivesStore((state) => state.actions);
