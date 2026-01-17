import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DAYS } from "@/constants/times";

const TIME_SLOTS = [
  { value: "all", label: "All Times" },
  { value: "morning", label: "Morning (before 12:00)" },
  { value: "afternoon", label: "Afternoon (12:00+)" },
] as const;

interface CourseFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  dayFilter: string;
  onDayChange: (value: string) => void;
  timeSlotFilter: string;
  onTimeSlotChange: (value: string) => void;
}

function getDayLabel(value: string): string {
  return value === "all" ? "All Days" : value;
}

function getTimeSlotLabel(value: string): string {
  const slot = TIME_SLOTS.find((s) => s.value === value);
  return slot ? slot.label : value;
}

export function CourseFilters({
  searchQuery,
  onSearchChange,
  dayFilter,
  onDayChange,
  timeSlotFilter,
  onTimeSlotChange,
}: CourseFiltersProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-6 space-y-4">
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("filter.search")}
          value={searchQuery}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Select
          onValueChange={(value) => {
            if (value !== null) {
              onDayChange(value);
            }
          }}
          value={dayFilter}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue>{getDayLabel(dayFilter)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Days</SelectItem>
            {DAYS.map((day) => (
              <SelectItem key={day} value={day}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => {
            if (value !== null) {
              onTimeSlotChange(value);
            }
          }}
          value={timeSlotFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue>{getTimeSlotLabel(timeSlotFilter)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {TIME_SLOTS.map((slot) => (
              <SelectItem key={slot.value} value={slot.value}>
                {slot.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
