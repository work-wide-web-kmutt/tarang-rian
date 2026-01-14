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
    remove: (
      courseCode: string,
      group: string,
      day: string,
      start: string,
      end: string
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
