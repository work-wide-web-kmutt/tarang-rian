import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useEffect, useRef, useState } from "react";
import { SessionBlock } from "@/components/schedule/block";
import { DraggableBlock } from "@/components/schedule/draggable-block";
import {
  calculateSnappedPreview,
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

interface SnappedPreview {
  day: GenElectiveOption["class"][number]["day"];
  start: string;
  end: string;
  startCol: number;
  startOffset: number;
  span: number;
}

function DroppableCell({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div className="relative h-full w-full" ref={setNodeRef}>
      {children}
    </div>
  );
}

function findDayRowFromMousePosition(
  mouseEvent: MouseEvent
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

    const x = mouseX - rect.left - DAY_COLUMN_WIDTH;

    if (x < 0) {
      continue;
    }

    const timeColIndex = Math.floor(x / CELL_SIZE);

    if (timeColIndex < 0 || timeColIndex >= TIME_SLOTS.length) {
      continue;
    }

    const cellX = x - timeColIndex * CELL_SIZE;
    return { day, timeColIndex, cellX };
  }

  return null;
}

export function Schedule({ sessions }: ScheduleProps) {
  const [openClassKey, setOpenClassKey] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [activeSession, setActiveSession] =
    useState<SelectedClassSession | null>(null);
  const [snappedPreview, setSnappedPreview] = useState<SnappedPreview | null>(
    null
  );
  const [dragOverPosition, setDragOverPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const dragStartRef = useRef<{
    day: string;
    timeColIndex: number;
    x: number;
  } | null>(null);
  const { addCustom, update } = useSelectedGenElectivesActions();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    if (!activeSession) {
      return;
    }

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const dayRowInfo = findDayRowFromMousePosition(e);

      if (!dayRowInfo) {
        setSnappedPreview(null);
        setDragOverPosition({ x: e.clientX, y: e.clientY });
        return;
      }

      const { day, timeColIndex, cellX } = dayRowInfo;
      const { slotIndex } = get30MinuteSlotFromPosition(
        cellX,
        CELL_SIZE,
        timeColIndex
      );

      const { newStart, newEnd } = calculateSnappedPreview(
        activeSession,
        day as GenElectiveOption["class"][number]["day"],
        slotIndex
      );

      const { startCol, startOffset, span } = getTimeSlotPosition(
        newStart,
        newEnd
      );

      setSnappedPreview({
        day: day as GenElectiveOption["class"][number]["day"],
        start: newStart,
        end: newEnd,
        startCol,
        startOffset,
        span,
      });
      setDragOverPosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener("mousemove", handleGlobalMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, [activeSession]);

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

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const sessionData = active.data.current?.session as
      | SelectedClassSession
      | undefined;

    if (sessionData) {
      setActiveSession(sessionData);
    }
  };

  const parseOverId = (
    overId: string
  ): {
    day: string;
    timeColIndex: number;
  } | null => {
    const [day, timeColIndexStr] = overId.split("-");
    const timeColIndex = Number.parseInt(timeColIndexStr, 10);

    if (
      Number.isNaN(timeColIndex) ||
      !DAYS.includes(day as (typeof DAYS)[number])
    ) {
      return null;
    }

    return { day, timeColIndex };
  };

  const getMousePositionInDayRow = (
    day: string,
    mouseEvent: MouseEvent,
    timeColIndex: number
  ): { x: number; cellX: number } | null => {
    const dayRowElement = document.querySelector(
      `[data-day-row="${day}"]`
    ) as HTMLElement;

    if (!dayRowElement) {
      return null;
    }

    const rect = dayRowElement.getBoundingClientRect();
    const x = mouseEvent.clientX - rect.left - DAY_COLUMN_WIDTH;

    if (x < 0) {
      return null;
    }

    const cellX = x - timeColIndex * CELL_SIZE;
    return { x, cellX };
  };

  const handleSessionDragOver = (
    sessionData: SelectedClassSession,
    day: string,
    timeColIndex: number,
    mouseEvent: MouseEvent
  ) => {
    const position = getMousePositionInDayRow(day, mouseEvent, timeColIndex);
    if (!position) {
      return;
    }

    const { slotIndex } = get30MinuteSlotFromPosition(
      position.cellX,
      CELL_SIZE,
      timeColIndex
    );

    const { newStart, newEnd } = calculateSnappedPreview(
      sessionData,
      day as GenElectiveOption["class"][number]["day"],
      slotIndex
    );

    const { startCol, startOffset, span } = getTimeSlotPosition(
      newStart,
      newEnd
    );

    setSnappedPreview({
      day: day as GenElectiveOption["class"][number]["day"],
      start: newStart,
      end: newEnd,
      startCol,
      startOffset,
      span,
    });
  };

  const handleCreateDragOver = (
    day: string,
    timeColIndex: number,
    mouseEvent: MouseEvent
  ) => {
    if (!dragState) {
      return;
    }

    const position = getMousePositionInDayRow(day, mouseEvent, timeColIndex);
    if (!position) {
      return;
    }

    const { slotIndex } = get30MinuteSlotFromPosition(
      position.cellX,
      CELL_SIZE,
      timeColIndex
    );

    const startSlot = Math.min(dragState.startSlot, slotIndex);
    const endSlot = Math.max(dragState.startSlot, slotIndex);

    setDragState({ ...dragState, startSlot, endSlot });
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!(over && event.activatorEvent)) {
      setSnappedPreview(null);
      return;
    }

    const parsed = parseOverId(over.id as string);
    if (!parsed) {
      setSnappedPreview(null);
      return;
    }

    const { day, timeColIndex } = parsed;
    const mouseEvent = event.activatorEvent as MouseEvent;

    const sessionData = active.data.current?.session as
      | SelectedClassSession
      | undefined;

    if (sessionData) {
      handleSessionDragOver(sessionData, day, timeColIndex, mouseEvent);
    } else if (dragState) {
      handleCreateDragOver(day, timeColIndex, mouseEvent);
    }

    setDragOverPosition({
      x: mouseEvent.clientX,
      y: mouseEvent.clientY,
    });
  };

  const calculateFinalPosition = (
    sessionData: SelectedClassSession,
    day: string,
    timeColIndex: number,
    mouseEvent: MouseEvent | null
  ): {
    start: string;
    end: string;
    day: GenElectiveOption["class"][number]["day"];
  } | null => {
    if (snappedPreview) {
      return {
        start: snappedPreview.start,
        end: snappedPreview.end,
        day: snappedPreview.day,
      };
    }

    if (!mouseEvent) {
      return null;
    }

    const position = getMousePositionInDayRow(day, mouseEvent, timeColIndex);
    if (!position) {
      return null;
    }

    const { slotIndex } = get30MinuteSlotFromPosition(
      position.cellX,
      CELL_SIZE,
      timeColIndex
    );

    const result = calculateSnappedPreview(
      sessionData,
      day as GenElectiveOption["class"][number]["day"],
      slotIndex
    );

    return {
      start: result.newStart,
      end: result.newEnd,
      day: day as GenElectiveOption["class"][number]["day"],
    };
  };

  const resetDragState = () => {
    setActiveSession(null);
    setSnappedPreview(null);
    setDragOverPosition(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      resetDragState();
      return;
    }

    const sessionData = active.data.current?.session as
      | SelectedClassSession
      | undefined;

    if (!sessionData) {
      resetDragState();
      return;
    }

    const parsed = parseOverId(over.id as string);
    if (!parsed) {
      resetDragState();
      return;
    }

    const { day, timeColIndex } = parsed;
    const mouseEvent = dragOverPosition
      ? ({
          clientX: dragOverPosition.x,
          clientY: dragOverPosition.y,
        } as MouseEvent)
      : (event.activatorEvent as MouseEvent | null);

    const finalPosition = calculateFinalPosition(
      sessionData,
      day,
      timeColIndex,
      mouseEvent
    );

    if (!finalPosition) {
      resetDragState();
      return;
    }

    update(
      sessionData,
      finalPosition.day,
      finalPosition.start,
      finalPosition.end
    );
    resetDragState();
  };

  const handleDragCancel = () => {
    setActiveSession(null);
    setSnappedPreview(null);
    setDragOverPosition(null);
    dragStartRef.current = null;
    setDragState(null);
  };

  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    day: GenElectiveOption["class"][number]["day"],
    timeColIndex: number
  ) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("[data-session-block]") ||
      target.closest("[data-day-label]") ||
      target.closest("[data-drag-handle]")
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
      const createdSession = addCustom(dragState.day, startTime, endTime);

      if (createdSession) {
        const classKey = getClassKey(createdSession);
        setOpenClassKey(classKey);
      }
    }

    dragStartRef.current = null;
    setDragState(null);
  };

  return (
    <DndContext
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
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
              data-day-row={day}
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
                const dropId = `${day}-${timeColIndex}`;

                return (
                  <DroppableCell id={dropId} key={dropId}>
                    <div
                      aria-label={`${day} ${time} - Drag to create custom class`}
                      className="relative h-[80px] border-border border-r bg-background last:border-r-0"
                      onMouseDown={(e) => handleMouseDown(e, day, timeColIndex)}
                    >
                      {firstColClasses.map((session) => {
                        const classKey = getClassKey(session);
                        return session.type === "custom" ? (
                          <DraggableBlock
                            allSessions={sessions}
                            key={classKey}
                            onOpenChange={setOpenClassKey}
                            openClassKey={openClassKey}
                            session={session}
                          />
                        ) : (
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
                                  Unassigned Class
                                </div>
                                <div className="text-[10px] text-primary-foreground/80">
                                  {formatTimeRange(startTime, endTime)}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })()}
                      {snappedPreview &&
                        snappedPreview.day === day &&
                        timeColIndex === snappedPreview.startCol && (
                          <div
                            className="absolute inset-y-0 z-30 m-0.5 rounded border border-primary border-dashed bg-primary/20 p-1.5 text-xs"
                            style={{
                              left: `${snappedPreview.startOffset * 100}%`,
                              width: `calc(${snappedPreview.span * 100}% - 0.25rem)`,
                            }}
                          >
                            <div className="font-medium text-primary-foreground">
                              {activeSession?.courseCode || "Unassigned Class"}
                            </div>
                            <div className="text-[10px] text-primary-foreground/80">
                              {formatTimeRange(
                                snappedPreview.start,
                                snappedPreview.end
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </DroppableCell>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeSession ? (
          <div className="m-0.5 rounded border border-primary bg-primary/80 p-1.5 text-xs">
            <div className="font-medium text-primary-foreground">
              {activeSession.courseCode}
            </div>
            <div className="text-[10px] text-primary-foreground/80">
              {activeSession.start}–{activeSession.end}
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
