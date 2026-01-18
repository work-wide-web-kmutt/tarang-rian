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
  SelectedCourseFilterSetters,
  SelectedCourseFilters as SelectedCourseFiltersType,
} from "@/hooks/use-selected-course-filters";

const TIME_SLOTS = [
  { value: "all", label: "All Times" },
  { value: "morning", label: "Morning (before 12:00)" },
  { value: "afternoon", label: "Afternoon (12:00+)" },
] as const;

interface ScheduleFiltersProps {
  filters: SelectedCourseFiltersType;
  setters: SelectedCourseFilterSetters;
}

export function ScheduleFilters({ filters, setters }: ScheduleFiltersProps) {
  const { t } = useTranslation();

  const { searchQuery, dayFilter, timeSlotFilter } = filters;

  const { setSearchQuery, setDayFilter, setTimeSlotFilter } = setters;

  const getDayLabel = (value: string): string => {
    return value === "all"
      ? t("filter.days.all")
      : t(`days_time.${value.toLowerCase()}`);
  };

  const getTimeSlotLabel = (value: string): string => {
    return value === "all" ? t("filter.times.all") : t(`filter.times.${value}`);
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
    </div>
  );
}
