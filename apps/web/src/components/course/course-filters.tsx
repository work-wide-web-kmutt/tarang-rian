import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import { AcademicTermSelector } from "@/components/academic-term-selector";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DAYS } from "@/constants/times";
import type {
  CourseFilterSetters,
  CourseFilters as CourseFiltersType,
} from "@/hooks/use-course-filters";

const TIME_SLOTS = [
  { label: "All Times", value: "all" },
  { label: "Morning (before 12:00)", value: "morning" },
  { label: "Afternoon (12:00+)", value: "afternoon" },
] as const;

interface CourseFiltersProps {
  filters: CourseFiltersType;
  setters: CourseFilterSetters;
}

export function CourseFilters({ filters, setters }: CourseFiltersProps) {
  const { t } = useTranslation();
  const { searchQuery, dayFilter, timeSlotFilter } = filters;
  const { setSearchQuery, setDayFilter, setTimeSlotFilter } = setters;

  function getDayLabel(value: string): string {
    return value === "all"
      ? t("filter.days.all")
      : t(`days_time.${value.toLowerCase()}`);
  }

  function getTimeSlotLabel(value: string): string {
    return value === "all" ? t("filter.times.all") : t(`filter.times.${value}`);
  }

  return (
    <div className="flex flex-col md:flex-row">
      <InputGroup className="border-r-0 border-l-0 md:border-r">
        <InputGroupInput
          onChange={(event) => {
            setSearchQuery(event.target.value);
          }}
          placeholder={t("filter.search")}
          value={searchQuery}
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>

      <div className="flex w-full md:w-fit">
        <Select
          onValueChange={(value) => {
            if (value !== null && value !== "") {
              setDayFilter(value);
            }
          }}
          value={dayFilter}
        >
          <SelectTrigger className="w-full border-l-0 md:w-35 md:border">
            <SelectValue>{getDayLabel(dayFilter)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filter.days.all")}</SelectItem>
            {DAYS.map((day) => (
              <SelectItem key={day} value={day}>
                {t(`days_time.${day.toLowerCase()}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => {
            if (value !== null && value !== "") {
              setTimeSlotFilter(value);
            }
          }}
          value={timeSlotFilter}
        >
          <SelectTrigger className="w-full border-r-0 md:w-35 md:border">
            <SelectValue>{getTimeSlotLabel(timeSlotFilter)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {TIME_SLOTS.map((slot) => (
              <SelectItem key={slot.value} value={slot.value}>
                {slot.value === "all"
                  ? t("filter.times.all")
                  : t(`filter.times.${slot.value}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <AcademicTermSelector className="w-full md:w-96" />
    </div>
  );
}
