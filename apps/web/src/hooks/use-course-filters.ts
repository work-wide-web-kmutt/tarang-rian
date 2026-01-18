import { allCourses, type Course } from "content-collections";
import { parseAsString, useQueryState } from "nuqs";
import { useMemo } from "react";

export interface CourseFilters {
  searchQuery: string;
  dayFilter: string;
  timeSlotFilter: string;
  yearFilter: string;
  semesterFilter: string;
  availableYears: string[];
}

export interface CourseFilterSetters {
  setSearchQuery: (value: string) => void;
  setDayFilter: (value: string) => void;
  setTimeSlotFilter: (value: string) => void;
  setYearFilter: (value: string) => void;
  setSemesterFilter: (value: string) => void;
}

export interface UseCourseFiltersReturn {
  filters: CourseFilters;
  setters: CourseFilterSetters;
  filteredCourses: Course[];
  totalCourses: number;
}

export function useCourseFilters(): UseCourseFiltersReturn {
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
  const [yearFilter, setYearFilter] = useQueryState(
    "year",
    parseAsString.withDefault("all")
  );
  const [semesterFilter, setSemesterFilter] = useQueryState(
    "semester",
    parseAsString.withDefault("all")
  );

  const availableYears = useMemo(() => {
    const years = [...new Set(allCourses.map((course) => course.year))];
    return years.sort((a, b) => a.localeCompare(b));
  }, []);

  const sortedCourses = useMemo(() => {
    return [...allCourses].sort((a, b) => {
      if (a.year === b.year) {
        if (a.semester === b.semester) {
          return a.code.localeCompare(b.code);
        }
        return a.semester.localeCompare(b.semester);
      }
      return a.year.localeCompare(b.year);
    });
  }, []);

  const filteredCourses = useMemo(() => {
    return sortedCourses.filter((course) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        course.code.toLowerCase().includes(searchLower) ||
        course.name.toLowerCase().includes(searchLower);

      if (!matchesSearch) {
        return false;
      }

      const matchesDay =
        dayFilter === "all" ||
        course.class.some((cls) => cls.day === dayFilter);

      if (!matchesDay) {
        return false;
      }

      const matchesTimeSlot =
        timeSlotFilter === "all" ||
        course.class.some((cls) => {
          const startHour = Number.parseInt(cls.start.split(":")[0], 10);
          if (timeSlotFilter === "morning") {
            return startHour < 12;
          }
          if (timeSlotFilter === "afternoon") {
            return startHour >= 12;
          }
          return true;
        });

      if (!matchesTimeSlot) {
        return false;
      }

      const matchesYear = yearFilter === "all" || course.year === yearFilter;

      if (!matchesYear) {
        return false;
      }

      const matchesSemester =
        semesterFilter === "all" || course.semester === semesterFilter;

      return matchesSemester;
    });
  }, [
    sortedCourses,
    searchQuery,
    dayFilter,
    timeSlotFilter,
    yearFilter,
    semesterFilter,
  ]);

  const filters: CourseFilters = {
    searchQuery,
    dayFilter,
    timeSlotFilter,
    yearFilter,
    semesterFilter,
    availableYears,
  };

  const setters: CourseFilterSetters = {
    setSearchQuery,
    setDayFilter,
    setTimeSlotFilter,
    setYearFilter,
    setSemesterFilter,
  };

  return {
    filters,
    setters,
    filteredCourses,
    totalCourses: sortedCourses.length,
  };
}
