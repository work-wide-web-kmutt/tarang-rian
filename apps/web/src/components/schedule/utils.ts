import { parseTime } from "@/lib/parser/time";
import type { SelectedClassSession } from "@/stores/selected";

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

export function getClassKey(session: SelectedClassSession): string {
  return `${session.courseCode}-${session.group}-${session.day}-${session.start}-${session.end}`;
}

function doSessionsOverlap(
  session1: SelectedClassSession,
  session2: SelectedClassSession
): boolean {
  if (session1.day !== session2.day) {
    return false;
  }

  const start1 = parseTime(session1.start);
  const end1 = parseTime(session1.end);
  const start2 = parseTime(session2.start);
  const end2 = parseTime(session2.end);

  return start1 < end2 && start2 < end1;
}

export function hasOverlap(
  session: SelectedClassSession,
  allSessions: SelectedClassSession[]
): boolean {
  return allSessions.some(
    (other) =>
      getClassKey(session) !== getClassKey(other) &&
      doSessionsOverlap(session, other)
  );
}

export function getOverlappingSessions(
  session: SelectedClassSession,
  allSessions: SelectedClassSession[]
): SelectedClassSession[] {
  return allSessions.filter(
    (other) =>
      getClassKey(session) !== getClassKey(other) &&
      doSessionsOverlap(session, other)
  );
}

const BASE_MINUTES = 480;

export function get30MinuteSlotFromPosition(
  x: number,
  cellWidth: number,
  timeColIndex: number
): { slotIndex: number; time: string } {
  const xPercent = x / cellWidth;
  const halfSlot = xPercent < 0.5 ? 0 : 1;
  const slotIndex = timeColIndex * 2 + halfSlot;
  const time = getTimeFrom30MinuteSlot(slotIndex);
  return { slotIndex, time };
}

export function getTimeFrom30MinuteSlot(slotIndex: number): string {
  const totalMinutes = BASE_MINUTES + slotIndex * 30;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

export function formatTimeRange(start: string, end: string): string {
  return `${start}–${end}`;
}
