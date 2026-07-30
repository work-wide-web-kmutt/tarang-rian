import { allCourses, type Course } from "content-collections";
import { parseAsString, useQueryState } from "nuqs";
import { useMemo } from "react";
import { sameAcademicTerm } from "@/course/academic-term";
import { useActiveAcademicTerm } from "@/stores/academic-context";
import {
  type SelectedClassSession,
  useSelectedGenElectives,
} from "@/stores/selected";

export interface CourseFilters {
  searchQuery: string;
  dayFilter: string;
  timeSlotFilter: string;
}

export interface CourseFilterSetters {
  setSearchQuery: (value: string) => void;
  setDayFilter: (value: string) => void;
  setTimeSlotFilter: (value: string) => void;
}

export interface UseCourseFiltersReturn {
  filters: CourseFilters;
  setters: CourseFilterSetters;
  filteredCourses: Course[];
  totalCourses: number;
}

export interface UseSelectedFiltersReturn {
  filters: CourseFilters;
  setters: CourseFilterSetters;
  filteredSessions: SelectedClassSession[];
  totalSessions: number;
}

interface CommonFilters {
  filters: CourseFilters;
  setters: CourseFilterSetters;
  searchQuery: string;
  dayFilter: string;
  timeSlotFilter: string;
  activeTerm: ReturnType<typeof useActiveAcademicTerm>;
}

function matchesSearch(
  searchQuery: string,
  courseCode: string,
  courseName: string
): boolean {
  const searchLower = searchQuery.toLowerCase();
  return (
    searchQuery === "" ||
    courseCode.toLowerCase().includes(searchLower) ||
    courseName.toLowerCase().includes(searchLower)
  );
}

function matchesTimeSlot(timeSlotFilter: string, start: string): boolean {
  if (timeSlotFilter === "all") {
    return true;
  }

  const startHour = Number.parseInt(start.split(":")[0], 10);
  return timeSlotFilter === "morning" ? startHour < 12 : startHour >= 12;
}

function useCommonFilters(): CommonFilters {
  const activeTerm = useActiveAcademicTerm();
  const [searchQuery, setSearchQuery] = useQueryState(
    "q",
    parseAsString.withDefault("")
  );
  const [dayFilter, setDayFilter] = useQueryState(
    "day",
    parseAsString.withDefault("all")
  );
  const [timeSlotFilter, setTimeSlotFilter] = useQueryState(
    "time",
    parseAsString.withDefault("all")
  );

  return {
    activeTerm,
    searchQuery,
    dayFilter,
    timeSlotFilter,
    filters: { searchQuery, dayFilter, timeSlotFilter },
    setters: { setSearchQuery, setDayFilter, setTimeSlotFilter },
  };
}

export function useCourseFilters(): UseCourseFiltersReturn {
  const {
    activeTerm,
    dayFilter,
    filters,
    searchQuery,
    setters,
    timeSlotFilter,
  } = useCommonFilters();

  const activeCourses = useMemo(
    () =>
      [...allCourses]
        .filter((course) => sameAcademicTerm(course, activeTerm))
        .sort((first, second) => first.code.localeCompare(second.code)),
    [activeTerm]
  );

  const filteredCourses = useMemo(
    () =>
      activeCourses.filter((course) => {
        if (!matchesSearch(searchQuery, course.code, course.name)) {
          return false;
        }
        if (
          dayFilter !== "all" &&
          !course.class.some((session) => session.day === dayFilter)
        ) {
          return false;
        }
        return course.class.some((session) =>
          matchesTimeSlot(timeSlotFilter, session.start)
        );
      }),
    [activeCourses, dayFilter, searchQuery, timeSlotFilter]
  );

  return {
    filters,
    setters,
    filteredCourses,
    totalCourses: activeCourses.length,
  };
}

export function useSelectedCourseFilters(): UseSelectedFiltersReturn {
  const {
    activeTerm,
    dayFilter,
    filters,
    searchQuery,
    setters,
    timeSlotFilter,
  } = useCommonFilters();
  const selected = useSelectedGenElectives();

  const activeSessions = useMemo(
    () => selected.filter((session) => sameAcademicTerm(session, activeTerm)),
    [activeTerm, selected]
  );

  const filteredSessions = useMemo(
    () =>
      activeSessions.filter((session) => {
        if (
          !matchesSearch(searchQuery, session.courseCode, session.courseName)
        ) {
          return false;
        }
        if (dayFilter !== "all" && session.day !== dayFilter) {
          return false;
        }
        return matchesTimeSlot(timeSlotFilter, session.start);
      }),
    [activeSessions, dayFilter, searchQuery, timeSlotFilter]
  );

  return {
    filters,
    setters,
    filteredSessions,
    totalSessions: activeSessions.length,
  };
}
