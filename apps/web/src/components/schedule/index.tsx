import { DndContext } from "@dnd-kit/core";
import { useRef, useState } from "react";
import { SessionBlock } from "@/components/schedule/block";
import {
  formatTimeRange,
  get30MinuteSlotFromPosition,
  getClassKey,
  getTimeFrom30MinuteSlot,
  getTimeSlotPosition,
} from "@/components/schedule/utils";
import { CELL_SIZE, DAY_COLUMN_WIDTH, MIN_WIDTH } from "@/constants/schedule";
import { DAYS, TIME_SLOTS } from "@/constants/times";
import type { GenElectiveOption } from "@/course/schema";
import {
  type SelectedClassSession,
  useSelectedGenElectivesActions,
} from "@/stores/selected";

interface ScheduleProps {
  sessions: SelectedClassSession[];
}

interface DragState {
  day: GenElectiveOption["class"][number]["day"];
  startSlot: number;
  endSlot: number;
}

export function Schedule({ sessions }: ScheduleProps) {
  const [openClassKey, setOpenClassKey] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const dragStartRef = useRef<{
    day: string;
    timeColIndex: number;
    x: number;
  } | null>(null);
  const { addCustom } = useSelectedGenElectivesActions();

  const getClassesForCell = (day: string, timeColIndex: number) => {
    return sessions.filter((session) => {
      if (session.day !== day) {
        return false;
      }
      const { startCol, span } = getTimeSlotPosition(
        session.start,
        session.end
      );
      const endCol = startCol + span;
      return timeColIndex >= startCol && timeColIndex < Math.ceil(endCol);
    });
  };

  const isFirstCol = (session: SelectedClassSession, timeColIndex: number) => {
    const { startCol } = getTimeSlotPosition(session.start, session.end);
    return timeColIndex === startCol;
  };

  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    day: GenElectiveOption["class"][number]["day"],
    timeColIndex: number
  ) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("[data-session-block]") ||
      target.closest("[data-day-label]")
    ) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const { slotIndex } = get30MinuteSlotFromPosition(
      x,
      CELL_SIZE,
      timeColIndex
    );

    dragStartRef.current = { day, timeColIndex, x };
    setDragState({ day, startSlot: slotIndex, endSlot: slotIndex });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!(dragStartRef.current && dragState)) {
      return;
    }

    const dayRow = e.currentTarget.closest("[data-day-row]") as HTMLElement;
    if (!dayRow) {
      return;
    }

    const rect = dayRow.getBoundingClientRect();
    const x = e.clientX - rect.left - DAY_COLUMN_WIDTH;

    if (x < 0) {
      return;
    }

    const timeColIndex = Math.floor(x / CELL_SIZE);
    if (timeColIndex < 0 || timeColIndex >= TIME_SLOTS.length) {
      return;
    }

    const cellX = x - timeColIndex * CELL_SIZE;
    const { slotIndex } = get30MinuteSlotFromPosition(
      cellX,
      CELL_SIZE,
      timeColIndex
    );

    const startSlot = Math.min(dragState.startSlot, slotIndex);
    const endSlot = Math.max(dragState.startSlot, slotIndex);

    setDragState({ ...dragState, startSlot, endSlot });
  };

  const handleMouseUp = () => {
    if (!(dragState && dragStartRef.current)) {
      dragStartRef.current = null;
      setDragState(null);
      return;
    }

    const startSlot = Math.min(dragState.startSlot, dragState.endSlot);
    const endSlot = Math.max(dragState.startSlot, dragState.endSlot);
    const duration = (endSlot - startSlot) * 30;

    if (duration >= 30) {
      const startTime = getTimeFrom30MinuteSlot(startSlot);
      const endTime = getTimeFrom30MinuteSlot(endSlot + 1);
      addCustom(dragState.day, startTime, endTime);

      const newSession: SelectedClassSession = {
        courseCode: "CUSTOM",
        courseName: "Custom Class",
        year: "2025",
        semester: "1",
        instructor: "TBA",
        group: "1",
        day: dragState.day,
        start: startTime,
        end: endTime,
        type: "custom",
      };
      const classKey = getClassKey(newSession);
      setOpenClassKey(classKey);
    }

    dragStartRef.current = null;
    setDragState(null);
  };

  return (
    <DndContext>
      <div style={{ width: `${MIN_WIDTH}px` }}>
        <div
          className="grid border border-border"
          style={{
            gridTemplateColumns: `${DAY_COLUMN_WIDTH}px repeat(${TIME_SLOTS.length}, ${CELL_SIZE}px)`,
          }}
        >
          <div className="sticky left-0 z-0 border-border border-r bg-muted p-2 text-center font-medium text-muted-foreground text-xs">
            Day
          </div>
          {TIME_SLOTS.map((time) => (
            <div
              className="border-border border-r bg-muted/50 p-2 text-center font-medium text-muted-foreground text-xs last:border-r-0"
              key={time}
            >
              {time}
            </div>
          ))}
        </div>

        <div className="border-border border-r border-b border-l">
          {DAYS.map((day) => (
            <div
              className="grid border-border border-b last:border-b-0"
              data-day-row
              key={day}
              onMouseLeave={handleMouseUp}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              style={{
                gridTemplateColumns: `120px repeat(${TIME_SLOTS.length}, ${CELL_SIZE}px)`,
              }}
            >
              <div
                className="sticky left-0 z-0 border-border border-r bg-muted p-2 text-center font-medium text-muted-foreground text-xs"
                data-day-label
              >
                {day}
              </div>
              {TIME_SLOTS.map((time, timeColIndex) => {
                const cellClasses = getClassesForCell(day, timeColIndex);
                const firstColClasses = cellClasses.filter((session) =>
                  isFirstCol(session, timeColIndex)
                );

                return (
                  <div
                    aria-label={`${day} ${time} - Drag to create custom class`}
                    className="relative min-h-[80px] border-border border-r bg-background last:border-r-0"
                    key={`${day}-${time}`}
                    onClick={() => {
                      // No-op: drag interaction uses onMouseDown
                    }}
                    onKeyDown={() => {
                      // No-op: keyboard support for drag not implemented yet
                    }}
                    onMouseDown={(e) => handleMouseDown(e, day, timeColIndex)}
                    role="button"
                    tabIndex={0}
                  >
                    {firstColClasses.map((session) => {
                      const classKey = getClassKey(session);
                      return (
                        <SessionBlock
                          allSessions={sessions}
                          key={classKey}
                          onOpenChange={setOpenClassKey}
                          openClassKey={openClassKey}
                          session={session}
                        />
                      );
                    })}
                    {dragState &&
                      dragState.day === day &&
                      (() => {
                        const startSlot = Math.min(
                          dragState.startSlot,
                          dragState.endSlot
                        );
                        const endSlot = Math.max(
                          dragState.startSlot,
                          dragState.endSlot
                        );
                        const startTime = getTimeFrom30MinuteSlot(startSlot);
                        const endTime = getTimeFrom30MinuteSlot(endSlot + 1);
                        const { startCol, startOffset, span } =
                          getTimeSlotPosition(startTime, endTime);

                        if (timeColIndex === startCol) {
                          return (
                            <div
                              className="absolute inset-y-0 z-10 m-0.5 rounded border border-primary bg-primary p-1.5 text-xs"
                              style={{
                                left: `${startOffset * 100}%`,
                                width: `calc(${span * 100}% - 0.25rem)`,
                              }}
                            >
                              <div className="font-medium text-primary-foreground">
                                Custom Class
                              </div>
                              <div className="text-[10px] text-primary-foreground/80">
                                {formatTimeRange(startTime, endTime)}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </DndContext>
  );
}
