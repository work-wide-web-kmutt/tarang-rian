import { parseTime } from "@/lib/parser/time";

export function getTimeSlotPosition(
  start: string,
  end: string
): {
  startCol: number;
  span: number;
} {
  const startMinutes = parseTime(start);
  const endMinutes = parseTime(end);
  const baseMinutes = 480;
  const startSlot = Math.floor((startMinutes - baseMinutes) / 60);
  const duration = (endMinutes - startMinutes) / 60;
  return {
    startCol: Math.max(0, startSlot),
    span: Math.max(1, Math.ceil(duration)),
  };
}
