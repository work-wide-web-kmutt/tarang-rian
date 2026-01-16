import { create, type StateCreator } from "zustand";
import type { GenElectiveOption } from "@/course/schema";

interface AcademicContextState {
  currentYear: number;
  currentSemester: GenElectiveOption["semester"];
  actions: {
    setYear: (year: number) => void;
    setSemester: (semester: GenElectiveOption["semester"]) => void;
  };
}

const academicContextStoreCreator: StateCreator<AcademicContextState> = (
  set
) => ({
  currentYear: 2025,
  currentSemester: "2",
  actions: {
    setYear: (year: number) => set({ currentYear: year }),
    setSemester: (semester: GenElectiveOption["semester"]) =>
      set({ currentSemester: semester }),
  },
});

const useAcademicContextStore = create<AcademicContextState>(
  academicContextStoreCreator
);

export const useCurrentYear = () =>
  useAcademicContextStore((state) => state.currentYear);

export const useCurrentSemester = () =>
  useAcademicContextStore((state) => state.currentSemester);

export const useAcademicContextActions = () =>
  useAcademicContextStore((state) => state.actions);

export const getAcademicContext = () => useAcademicContextStore.getState();
