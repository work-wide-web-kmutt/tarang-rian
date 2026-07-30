import { allCourses } from "content-collections";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  type AcademicTerm,
  DEFAULT_ACADEMIC_TERM,
  isAcademicTerm,
  latestAcademicTerm,
} from "@/course/academic-term";

interface AcademicContextState {
  activeTerm: AcademicTerm;
  actions: {
    activateTerm: (term: AcademicTerm) => void;
  };
}

const latestCatalogTerm = latestAcademicTerm(
  allCourses.map((course) => ({ year: course.year, semester: course.semester }))
);

const useAcademicContextStore = create<AcademicContextState>()(
  persist(
    (set) => ({
      activeTerm: latestCatalogTerm,
      actions: {
        activateTerm: (term) => {
          if (isAcademicTerm(term)) {
            set({ activeTerm: term });
          }
        },
      },
    }),
    {
      name: "academic-context-storage",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ activeTerm: state.activeTerm }),
      migrate: (persistedState: unknown) => {
        if (
          persistedState &&
          typeof persistedState === "object" &&
          "activeTerm" in persistedState &&
          isAcademicTerm((persistedState as { activeTerm: unknown }).activeTerm)
        ) {
          return {
            activeTerm: (persistedState as { activeTerm: AcademicTerm })
              .activeTerm,
          };
        }

        return { activeTerm: latestCatalogTerm ?? DEFAULT_ACADEMIC_TERM };
      },
    }
  )
);

export const useActiveAcademicTerm = () =>
  useAcademicContextStore((state) => state.activeTerm);

export const useAcademicTermActions = () =>
  useAcademicContextStore((state) => state.actions);

export const useCurrentYear = () =>
  Number(useAcademicContextStore((state) => state.activeTerm.year));

export const useCurrentSemester = () =>
  useAcademicContextStore((state) => state.activeTerm.semester);

export const getAcademicContext = () => useAcademicContextStore.getState();
