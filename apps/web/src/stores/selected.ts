import { create, type StateCreator } from "zustand";

import type { GenElectiveOption } from "../course/schema";

export interface SelectedClassSession {
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
    ) => void;
    remove: (
      courseCode: string,
      group: string,
      day: string,
      start: string,
      end: string
    ) => void;
    update: (
      oldSession: SelectedClassSession,
      newDay: GenElectiveOption["class"][number]["day"],
      newStart: string,
      newEnd: string
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
    ) =>
      set((state) => {
        const exists = state.selected.some(
          (current) =>
            current.courseCode === "CUSTOM" &&
            current.day === day &&
            current.start === start &&
            current.end === end
        );

        if (exists) {
          return state;
        }

        const newSession: SelectedClassSession = {
          courseCode: "CUSTOM",
          courseName: "Custom Class",
          year: "2025",
          semester: "1",
          instructor: "TBA",
          group: "1",
          day,
          start,
          end,
          type: "custom",
        };

        const updated = [...state.selected, newSession];
        saveToStorage(updated);
        return { selected: updated };
      }),
    remove: (
      courseCode: string,
      group: string,
      day: string,
      start: string,
      end: string
    ) =>
      set((state) => {
        const updated = state.selected.filter(
          (session) =>
            !(
              session.courseCode === courseCode &&
              session.group === group &&
              session.day === day &&
              session.start === start &&
              session.end === end
            )
        );
        saveToStorage(updated);
        return { selected: updated };
      }),
    update: (
      oldSession: SelectedClassSession,
      newDay: GenElectiveOption["class"][number]["day"],
      newStart: string,
      newEnd: string
    ) =>
      set((state) => {
        const updated = state.selected.map((session) => {
          if (
            session.courseCode === oldSession.courseCode &&
            session.group === oldSession.group &&
            session.day === oldSession.day &&
            session.start === oldSession.start &&
            session.end === oldSession.end
          ) {
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
