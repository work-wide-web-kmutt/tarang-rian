export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export interface ScheduleTimeRange {
  // inclusive, 0–23
  startHour: number;
  // exclusive, 1–24
  endHour: number;
}

export const DEFAULT_SCHEDULE_TIME_RANGE: ScheduleTimeRange = {
  endHour: 19,
  startHour: 8,
};

export const SCHEDULE_TIME_RANGE_LIMITS = {
  maxHour: 24,
  minDurationHours: 1,
  minHour: 0,
} as const;

export function normalizeScheduleTimeRange(value: unknown): ScheduleTimeRange {
  if (value === null || typeof value !== "object") {
    return DEFAULT_SCHEDULE_TIME_RANGE;
  }

  const range = value as Partial<ScheduleTimeRange>;
  const { startHour, endHour } = range;
  const isValid =
    typeof startHour === "number" &&
    typeof endHour === "number" &&
    Number.isInteger(startHour) &&
    Number.isInteger(endHour) &&
    startHour >= SCHEDULE_TIME_RANGE_LIMITS.minHour &&
    startHour < SCHEDULE_TIME_RANGE_LIMITS.maxHour &&
    endHour > SCHEDULE_TIME_RANGE_LIMITS.minHour &&
    endHour <= SCHEDULE_TIME_RANGE_LIMITS.maxHour &&
    endHour - startHour >= SCHEDULE_TIME_RANGE_LIMITS.minDurationHours;

  return isValid ? { endHour, startHour } : DEFAULT_SCHEDULE_TIME_RANGE;
}

export function formatScheduleHour(hour: number): string {
  return `${hour.toString().padStart(2, "0")}:00`;
}

export function getScheduleTimeSlots(range: ScheduleTimeRange): string[] {
  const normalizedRange = normalizeScheduleTimeRange(range);

  return Array.from(
    { length: normalizedRange.endHour - normalizedRange.startHour },
    (_, index) => formatScheduleHour(normalizedRange.startHour + index)
  );
}

export function getFullDayTimeSlots(): string[] {
  return Array.from({ length: 49 }, (_, slotIndex) => {
    const totalMinutes = slotIndex * 30;
    const hour = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hour.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  });
}
