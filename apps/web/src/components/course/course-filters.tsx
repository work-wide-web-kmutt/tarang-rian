import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
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
  { value: "all", label: "All Times" },
  { value: "morning", label: "Morning (before 12:00)" },
  { value: "afternoon", label: "Afternoon (12:00+)" },
] as const;

const SEMESTERS = ["1", "2", "S"] as const;

interface CourseFiltersProps {
  filters: CourseFiltersType;
  setters: CourseFilterSetters;
}

export function CourseFilters({ filters, setters }: CourseFiltersProps) {
  const { t } = useTranslation();

  const {
    searchQuery,
    dayFilter,
    timeSlotFilter,
    yearFilter,
    semesterFilter,
    availableYears,
  } = filters;

  const {
    setSearchQuery,
    setDayFilter,
    setTimeSlotFilter,
    setYearFilter,
    setSemesterFilter,
  } = setters;

  const getDayLabel = (value: string): string => {
    return value === "all"
      ? t("filter.days.all")
      : t(`days_time.${value.toLowerCase()}`);
  };

  const getTimeSlotLabel = (value: string): string => {
    return value === "all" ? t("filter.times.all") : t(`filter.times.${value}`);
  };

  const getYearLabel = (value: string): string => {
    return value === "all" ? t("filter.years.all") : value;
  };

  const getSemesterLabel = (value: string): string => {
    return value === "all"
      ? t("filter.semesters.all")
      : t(`filter.semesters.${value}`);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <InputGroup className="border-r-0 border-l-0 md:border-r">
        <InputGroupInput
          onChange={(e) => setSearchQuery(e.target.value)}
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
            if (value !== null) {
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
            if (value !== null) {
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

      <div className="flex w-full md:w-fit">
        <Select
          onValueChange={(value) => {
            if (value !== null) {
              setYearFilter(value);
            }
          }}
          value={yearFilter}
        >
          <SelectTrigger className="w-full border-l-0 md:w-35 md:border">
            <SelectValue>{getYearLabel(yearFilter)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filter.years.all")}</SelectItem>
            {availableYears.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => {
            if (value !== null) {
              setSemesterFilter(value);
            }
          }}
          value={semesterFilter}
        >
          <SelectTrigger className="w-full border-r-0 md:w-35 md:border">
            <SelectValue>{getSemesterLabel(semesterFilter)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filter.semesters.all")}</SelectItem>
            {SEMESTERS.map((semester) => (
              <SelectItem key={semester} value={semester}>
                {t(`filter.semesters.${semester}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
