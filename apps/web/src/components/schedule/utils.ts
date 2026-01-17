import { BASE_MINUTES, SLOT_DURATION_MINUTES } from "@/constants/schedule";
import { DAYS, TIME_SLOTS } from "@/constants/times";
import type { GenElectiveOption } from "@/course/schema";
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
  const baseMinutes = BASE_MINUTES;

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
  return session.id;
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
    (other) => session.id !== other.id && doSessionsOverlap(session, other)
  );
}

export function getOverlappingSessions(
  session: SelectedClassSession,
  allSessions: SelectedClassSession[]
): SelectedClassSession[] {
  return allSessions.filter(
    (other) => session.id !== other.id && doSessionsOverlap(session, other)
  );
}

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
  const totalMinutes = BASE_MINUTES + slotIndex * SLOT_DURATION_MINUTES;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

export function formatTimeRange(start: string, end: string): string {
  return `${start}–${end}`;
}

export function calculateSnappedPreview(
  session: SelectedClassSession,
  _targetDay: GenElectiveOption["class"][number]["day"],
  targetSlotIndex: number
): { newStart: string; newEnd: string } {
  const startMinutes = parseTime(session.start);
  const endMinutes = parseTime(session.end);
  const duration = endMinutes - startMinutes;

  const newStartMinutes =
    BASE_MINUTES + targetSlotIndex * SLOT_DURATION_MINUTES;
  const newEndMinutes = newStartMinutes + duration;

  const newStartHours = Math.floor(newStartMinutes / 60);
  const newStartMins = newStartMinutes % 60;
  const newEndHours = Math.floor(newEndMinutes / 60);
  const newEndMins = newEndMinutes % 60;

  const newStart = `${newStartHours.toString().padStart(2, "0")}:${newStartMins.toString().padStart(2, "0")}`;
  const newEnd = `${newEndHours.toString().padStart(2, "0")}:${newEndMins.toString().padStart(2, "0")}`;

  return { newStart, newEnd };
}

export function findDayRowFromMousePosition(
  mouseEvent: MouseEvent,
  cellSize: number,
  dayColumnWidth: number
): { day: string; timeColIndex: number; cellX: number } | null {
  for (const day of DAYS) {
    const dayRowElement = document.querySelector(
      `[data-day-row="${day}"]`
    ) as HTMLElement;

    if (!dayRowElement) {
      continue;
    }

    const rect = dayRowElement.getBoundingClientRect();
    const { clientX: mouseX, clientY: mouseY } = mouseEvent;

    const isWithinBounds =
      mouseY >= rect.top &&
      mouseY <= rect.bottom &&
      mouseX >= rect.left &&
      mouseX <= rect.right;

    if (!isWithinBounds) {
      continue;
    }

    const x = mouseX - rect.left - dayColumnWidth;

    if (x < 0) {
      continue;
    }

    const timeColIndex = Math.floor(x / cellSize);

    if (timeColIndex < 0 || timeColIndex >= TIME_SLOTS.length) {
      continue;
    }

    const cellX = x - timeColIndex * cellSize;
    return { day, timeColIndex, cellX };
  }

  return null;
}

export function parseOverId(overId: string): {
  day: string;
  timeColIndex: number;
} | null {
  const [day, timeColIndexStr] = overId.split("-");
  const timeColIndex = Number.parseInt(timeColIndexStr, 10);

  if (
    Number.isNaN(timeColIndex) ||
    !DAYS.includes(day as (typeof DAYS)[number])
  ) {
    return null;
  }

  return { day, timeColIndex };
}

export function getMousePositionInDayRow(
  day: string,
  mouseEvent: MouseEvent,
  timeColIndex: number,
  cellSize: number,
  dayColumnWidth: number
): { x: number; cellX: number } | null {
  const dayRowElement = document.querySelector(
    `[data-day-row="${day}"]`
  ) as HTMLElement;

  if (!dayRowElement) {
    return null;
  }

  const rect = dayRowElement.getBoundingClientRect();
  const x = mouseEvent.clientX - rect.left - dayColumnWidth;

  if (x < 0) {
    return null;
  }

  const cellX = x - timeColIndex * cellSize;
  return { x, cellX };
}

export function getClassesForCell(
  day: string,
  timeColIndex: number,
  sessions: SelectedClassSession[]
): SelectedClassSession[] {
  return sessions.filter((session) => {
    if (session.day !== day) {
      return false;
    }
    const { startCol, span } = getTimeSlotPosition(session.start, session.end);
    const endCol = startCol + span;
    return timeColIndex >= startCol && timeColIndex < Math.ceil(endCol);
  });
}

export function isFirstCol(
  session: SelectedClassSession,
  timeColIndex: number
): boolean {
  const { startCol } = getTimeSlotPosition(session.start, session.end);
  return timeColIndex === startCol;
}

export function calculateResizePreview(
  session: SelectedClassSession,
  edge: "left" | "right",
  targetSlotIndex: number
): { newStart: string; newEnd: string; isValid: boolean } {
  const startMinutes = parseTime(session.start);
  const endMinutes = parseTime(session.end);
  const minDuration = SLOT_DURATION_MINUTES;

  let newStartMinutes = startMinutes;
  let newEndMinutes = endMinutes;

  if (edge === "left") {
    // Left edge = adjusting start time
    newStartMinutes = BASE_MINUTES + targetSlotIndex * SLOT_DURATION_MINUTES;
    if (newEndMinutes - newStartMinutes < minDuration) {
      newStartMinutes = newEndMinutes - minDuration;
    }
  } else {
    // Right edge = adjusting end time
    newEndMinutes =
      BASE_MINUTES + (targetSlotIndex + 1) * SLOT_DURATION_MINUTES;
    if (newEndMinutes - newStartMinutes < minDuration) {
      newEndMinutes = newStartMinutes + minDuration;
    }
  }

  const minTime = BASE_MINUTES;
  const maxTime = BASE_MINUTES + TIME_SLOTS.length * 60;

  const isValid =
    newStartMinutes >= minTime &&
    newEndMinutes <= maxTime &&
    newStartMinutes < newEndMinutes;

  newStartMinutes = Math.max(
    minTime,
    Math.min(newStartMinutes, maxTime - minDuration)
  );
  newEndMinutes = Math.min(
    maxTime,
    Math.max(newEndMinutes, minTime + minDuration)
  );

  const formatTime = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  return {
    newStart: formatTime(newStartMinutes),
    newEnd: formatTime(newEndMinutes),
    isValid,
  };
}
