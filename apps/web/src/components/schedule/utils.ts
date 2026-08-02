import { SLOT_DURATION_MINUTES } from "@/constants/schedule";
import {
  DAYS,
  DEFAULT_SCHEDULE_TIME_RANGE,
  getScheduleTimeSlots,
  normalizeScheduleTimeRange,
  type ScheduleTimeRange,
} from "@/constants/times";
import type { GenElectiveOption } from "@/course/schema";
import { parseTime } from "@/lib/parser/time";
import type { SelectedClassSession } from "@/stores/selected";

export interface TimeSlotPosition {
  startCol: number;
  startOffset: number;
  span: number;
  endOffset: number;
}

interface VisibleSessionInterval {
  startMinutes: number;
  endMinutes: number;
}

function formatMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

export function getVisibleSessionInterval(
  start: string,
  end: string,
  range: ScheduleTimeRange = DEFAULT_SCHEDULE_TIME_RANGE
): VisibleSessionInterval | null {
  const normalizedRange = normalizeScheduleTimeRange(range);
  const startMinutes = parseTime(start);
  const endMinutes = parseTime(end);
  const rangeStartMinutes = normalizedRange.startHour * 60;
  const rangeEndMinutes = normalizedRange.endHour * 60;

  if (
    !(Number.isFinite(startMinutes) && Number.isFinite(endMinutes)) ||
    startMinutes >= endMinutes
  ) {
    return null;
  }

  const visibleStartMinutes = Math.max(startMinutes, rangeStartMinutes);
  const visibleEndMinutes = Math.min(endMinutes, rangeEndMinutes);

  if (visibleStartMinutes >= visibleEndMinutes) {
    return null;
  }

  return {
    startMinutes: visibleStartMinutes,
    endMinutes: visibleEndMinutes,
  };
}

export function getTimeSlotPosition(
  start: string,
  end: string,
  range: ScheduleTimeRange = DEFAULT_SCHEDULE_TIME_RANGE
): TimeSlotPosition | null {
  const normalizedRange = normalizeScheduleTimeRange(range);
  const visibleInterval = getVisibleSessionInterval(
    start,
    end,
    normalizedRange
  );

  if (!visibleInterval) {
    return null;
  }

  const rangeStartMinutes = normalizedRange.startHour * 60;
  const relativeStartMinutes = visibleInterval.startMinutes - rangeStartMinutes;
  const relativeEndMinutes = visibleInterval.endMinutes - rangeStartMinutes;

  const startCol = Math.floor(relativeStartMinutes / 60);
  const startOffset = (relativeStartMinutes % 60) / 60;
  const endCol = Math.floor(relativeEndMinutes / 60);
  const endOffset = (relativeEndMinutes % 60) / 60;
  const span = endCol - startCol + (endOffset - startOffset);

  return {
    startCol,
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
  timeColIndex: number,
  range: ScheduleTimeRange = DEFAULT_SCHEDULE_TIME_RANGE
): { slotIndex: number; time: string } {
  const xPercent = x / cellWidth;
  const halfSlot = xPercent < 0.5 ? 0 : 1;
  const slotIndex = timeColIndex * 2 + halfSlot;
  const time = getTimeFrom30MinuteSlot(slotIndex, range);
  return { slotIndex, time };
}

export function getTimeFrom30MinuteSlot(
  slotIndex: number,
  range: ScheduleTimeRange = DEFAULT_SCHEDULE_TIME_RANGE
): string {
  const normalizedRange = normalizeScheduleTimeRange(range);
  const totalMinutes =
    normalizedRange.startHour * 60 + slotIndex * SLOT_DURATION_MINUTES;
  return formatMinutes(totalMinutes);
}

export function formatTimeRange(start: string, end: string): string {
  return `${start}–${end}`;
}

export function calculateSnappedPreview(
  session: SelectedClassSession,
  _targetDay: GenElectiveOption["class"][number]["day"],
  targetSlotIndex: number,
  range: ScheduleTimeRange = DEFAULT_SCHEDULE_TIME_RANGE
): { newStart: string; newEnd: string } {
  const startMinutes = parseTime(session.start);
  const endMinutes = parseTime(session.end);
  const duration = endMinutes - startMinutes;
  const normalizedRange = normalizeScheduleTimeRange(range);
  const newStartMinutes =
    normalizedRange.startHour * 60 + targetSlotIndex * SLOT_DURATION_MINUTES;

  return {
    newStart: formatMinutes(newStartMinutes),
    newEnd: formatMinutes(newStartMinutes + duration),
  };
}

export function findDayRowFromMousePosition(
  mouseEvent: MouseEvent,
  cellSize: number,
  dayColumnWidth: number,
  range: ScheduleTimeRange = DEFAULT_SCHEDULE_TIME_RANGE
): { day: string; timeColIndex: number; cellX: number } | null {
  const columnCount = getScheduleTimeSlots(range).length;

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

    if (timeColIndex < 0 || timeColIndex >= columnCount) {
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
  sessions: SelectedClassSession[],
  range: ScheduleTimeRange = DEFAULT_SCHEDULE_TIME_RANGE
): SelectedClassSession[] {
  return sessions.filter((session) => {
    if (session.day !== day) {
      return false;
    }

    const position = getTimeSlotPosition(session.start, session.end, range);
    if (!position) {
      return false;
    }

    const endCol = position.startCol + position.span;
    return (
      timeColIndex >= position.startCol && timeColIndex < Math.ceil(endCol)
    );
  });
}

export function isFirstCol(
  session: SelectedClassSession,
  timeColIndex: number,
  range: ScheduleTimeRange = DEFAULT_SCHEDULE_TIME_RANGE
): boolean {
  const position = getTimeSlotPosition(session.start, session.end, range);
  return position !== null && timeColIndex === position.startCol;
}

export function calculateResizePreview(
  session: SelectedClassSession,
  edge: "left" | "right",
  targetSlotIndex: number,
  range: ScheduleTimeRange = DEFAULT_SCHEDULE_TIME_RANGE
): { newStart: string; newEnd: string; isValid: boolean } {
  const startMinutes = parseTime(session.start);
  const endMinutes = parseTime(session.end);
  const minDuration = SLOT_DURATION_MINUTES;
  const normalizedRange = normalizeScheduleTimeRange(range);
  const rangeStartMinutes = normalizedRange.startHour * 60;

  let newStartMinutes = startMinutes;
  let newEndMinutes = endMinutes;

  if (edge === "left") {
    newStartMinutes =
      rangeStartMinutes + targetSlotIndex * SLOT_DURATION_MINUTES;
    if (newEndMinutes - newStartMinutes < minDuration) {
      newStartMinutes = newEndMinutes - minDuration;
    }
  } else {
    newEndMinutes =
      rangeStartMinutes + (targetSlotIndex + 1) * SLOT_DURATION_MINUTES;
    if (newEndMinutes - newStartMinutes < minDuration) {
      newEndMinutes = newStartMinutes + minDuration;
    }
  }

  return {
    newStart: formatMinutes(newStartMinutes),
    newEnd: formatMinutes(newEndMinutes),
    isValid:
      Number.isFinite(newStartMinutes) &&
      Number.isFinite(newEndMinutes) &&
      newStartMinutes < newEndMinutes,
  };
}
