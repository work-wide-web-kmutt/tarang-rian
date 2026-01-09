import { parseTime } from "@/lib/parser/time";

export function getTimeSlotPosition(
  start: string,
  end: string
): {
  startCol: number;
  startOffset: number;
  span: number;
  endOffset: number;
} {
  const startMinutes = parseTime(start);
  const endMinutes = parseTime(end);
  const baseMinutes = 480;

  const startCol = Math.floor((startMinutes - baseMinutes) / 60);
  const startOffset = ((startMinutes - baseMinutes) % 60) / 60;

  const endCol = Math.floor((endMinutes - baseMinutes) / 60);
  const endOffset = ((endMinutes - baseMinutes) % 60) / 60;

  const span = endCol - startCol + (endOffset - startOffset);

  return {
    startCol: Math.max(0, startCol),
    startOffset,
    span: Math.max(0.5, span),
    endOffset,
  };
}
