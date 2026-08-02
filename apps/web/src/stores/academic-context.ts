import { allCourses } from "content-collections";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  DEFAULT_ACADEMIC_TERM,
  isAcademicTerm,
  latestAcademicTerm,
} from "@/course/academic-term";
import type { AcademicTerm } from "@/course/academic-term";

interface AcademicContextState {
  activeTerm: AcademicTerm;
  actions: {
    activateTerm: (term: AcademicTerm) => void;
  };
}

const latestCatalogTerm = latestAcademicTerm(
  allCourses.map((course) => ({ semester: course.semester, year: course.year }))
);

export function restoreAcademicTerm(
  persistedState: unknown,
  fallback: AcademicTerm = latestCatalogTerm ?? DEFAULT_ACADEMIC_TERM
): AcademicTerm {
  if (
    persistedState !== null &&
    typeof persistedState === "object" &&
    "activeTerm" in persistedState &&
    isAcademicTerm(persistedState.activeTerm)
  ) {
    return persistedState.activeTerm;
  }

  return fallback;
}

const useAcademicContextStore = create<AcademicContextState>()(
  persist(
    (set) => ({
      actions: {
        activateTerm: (term) => {
          if (isAcademicTerm(term)) {
            set({ activeTerm: term });
          }
        },
      },
      activeTerm: latestCatalogTerm,
    }),
    {
      migrate: (persistedState: unknown) => ({
        activeTerm: restoreAcademicTerm(persistedState),
      }),
      name: "academic-context-storage",
      partialize: (state) => ({ activeTerm: state.activeTerm }),
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);

export function useActiveAcademicTerm(): AcademicTerm {
  return useAcademicContextStore((state) => state.activeTerm);
}

export function useAcademicTermActions(): AcademicContextState["actions"] {
  return useAcademicContextStore((state) => state.actions);
}

export function useCurrentYear(): number {
  return Number(useAcademicContextStore((state) => state.activeTerm.year));
}

export function useCurrentSemester(): AcademicTerm["semester"] {
  return useAcademicContextStore((state) => state.activeTerm.semester);
}

export function getAcademicContext(): AcademicContextState {
  return useAcademicContextStore.getState();
}
