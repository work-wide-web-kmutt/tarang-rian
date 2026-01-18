import { parseAsString, useQueryState } from "nuqs";
import { useMemo } from "react";
import {
  type SelectedClassSession,
  useSelectedGenElectives,
} from "@/stores/selected";

export interface SelectedCourseFilters {
  searchQuery: string;
  dayFilter: string;
  timeSlotFilter: string;
}

export interface SelectedCourseFilterSetters {
  setSearchQuery: (value: string) => void;
  setDayFilter: (value: string) => void;
  setTimeSlotFilter: (value: string) => void;
}

export interface UseSelectedCourseFiltersReturn {
  filters: SelectedCourseFilters;
  setters: SelectedCourseFilterSetters;
  filteredSessions: SelectedClassSession[];
  totalSessions: number;
}

export function useSelectedCourseFilters(): UseSelectedCourseFiltersReturn {
  const selected = useSelectedGenElectives();

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

  const filteredSessions = useMemo(() => {
    return selected.filter((session) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        session.courseCode.toLowerCase().includes(searchLower) ||
        session.courseName.toLowerCase().includes(searchLower);

      if (!matchesSearch) {
        return false;
      }

      const matchesDay = dayFilter === "all" || session.day === dayFilter;

      if (!matchesDay) {
        return false;
      }

      const matchesTimeSlot =
        timeSlotFilter === "all" ||
        (() => {
          const startHour = Number.parseInt(session.start.split(":")[0], 10);
          if (timeSlotFilter === "morning") {
            return startHour < 12;
          }
          if (timeSlotFilter === "afternoon") {
            return startHour >= 12;
          }
          return true;
        })();

      return matchesTimeSlot;
    });
  }, [selected, searchQuery, dayFilter, timeSlotFilter]);

  const filters: SelectedCourseFilters = {
    searchQuery,
    dayFilter,
    timeSlotFilter,
  };

  const setters: SelectedCourseFilterSetters = {
    setSearchQuery,
    setDayFilter,
    setTimeSlotFilter,
  };

  return {
    filters,
    setters,
    filteredSessions,
    totalSessions: selected.length,
  };
}
