import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { SessionBlock } from "@/components/schedule/block";
import { DraggableBlock } from "@/components/schedule/draggable-block";
import {
  calculateResizePreview,
  calculateSnappedPreview,
  findDayRowFromMousePosition,
  formatTimeRange,
  get30MinuteSlotFromPosition,
  getClassesForCell,
  getClassKey,
  getMousePositionInDayRow,
  getTimeFrom30MinuteSlot,
  getTimeSlotPosition,
  isFirstCol,
  parseOverId,
} from "@/components/schedule/utils";
import {
  ACTIVATION_DISTANCE,
  MIN_DRAG_DURATION,
  SCHEDULE_SIZE,
  SLOT_DURATION_MINUTES,
} from "@/constants/schedule";
import { DAYS, TIME_SLOTS } from "@/constants/times";
import type { AcademicTerm } from "@/course/academic-term";
import type { GenElectiveOption } from "@/course/schema";
import { cn } from "@/lib/utils";
import { useScheduleSize } from "@/stores/schedule-settings";
import {
  type SelectedClassSession,
  useSelectedGenElectivesActions,
} from "@/stores/selected";

interface ScheduleStyles {
  borderTop?: string;
  borderBottom?: string;
}

interface ScheduleProps {
  sessions: SelectedClassSession[];
  term: AcademicTerm;
  styles?: ScheduleStyles;
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

interface ResizeState {
  session: SelectedClassSession;
  edge: "left" | "right";
  originalStart: string;
  originalEnd: string;
}

interface ResizePreview {
  session: SelectedClassSession;
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

export function Schedule({ sessions, term, styles }: ScheduleProps) {
  const size = useScheduleSize();
  const { cellSize, dayColumnWidth, rowHeight, textClass, subTextClass } =
    SCHEDULE_SIZE[size];
  const minWidth = dayColumnWidth + TIME_SLOTS.length * cellSize + 2;
  const { t } = useTranslation();

  const [openClassKey, setOpenClassKey] = useState<string | null>(null);
  const [newClassKey, setNewClassKey] = useState<string | null>(null);
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

  const [resizeState, setResizeState] = useState<ResizeState | null>(null);
  const [resizePreview, setResizePreview] = useState<ResizePreview | null>(
    null
  );

  const { addCustom, update } = useSelectedGenElectivesActions();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: ACTIVATION_DISTANCE,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  const handleResizePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!resizeState) {
        return;
      }

      const dayRowInfo = findDayRowFromMousePosition(
        e,
        cellSize,
        dayColumnWidth
      );
      if (!dayRowInfo || dayRowInfo.day !== resizeState.session.day) {
        return;
      }

      const { timeColIndex, cellX } = dayRowInfo;
      const { slotIndex } = get30MinuteSlotFromPosition(
        cellX,
        cellSize,
        timeColIndex
      );

      const { newStart, newEnd } = calculateResizePreview(
        resizeState.session,
        resizeState.edge,
        slotIndex
      );

      const { startCol, startOffset, span } = getTimeSlotPosition(
        newStart,
        newEnd
      );

      setResizePreview({
        session: resizeState.session,
        start: newStart,
        end: newEnd,
        startCol,
        startOffset,
        span,
      });
    },
    [resizeState, cellSize, dayColumnWidth]
  );

  const handleResizePointerUp = useCallback(() => {
    if (resizeState && resizePreview) {
      update(
        resizeState.session.id,
        resizeState.session.day,
        resizePreview.start,
        resizePreview.end
      );
    }

    setResizeState(null);
    setResizePreview(null);
  }, [resizeState, resizePreview, update]);

  useEffect(() => {
    if (!resizeState) {
      return;
    }

    document.addEventListener("pointermove", handleResizePointerMove);
    document.addEventListener("pointerup", handleResizePointerUp);
    document.addEventListener("pointercancel", handleResizePointerUp);

    return () => {
      document.removeEventListener("pointermove", handleResizePointerMove);
      document.removeEventListener("pointerup", handleResizePointerUp);
      document.removeEventListener("pointercancel", handleResizePointerUp);
    };
  }, [resizeState, handleResizePointerMove, handleResizePointerUp]);

  const handleResizeStart = (
    session: SelectedClassSession,
    edge: "left" | "right"
  ) => {
    setResizeState({
      session,
      edge,
      originalStart: session.start,
      originalEnd: session.end,
    });

    const { startCol, startOffset, span } = getTimeSlotPosition(
      session.start,
      session.end
    );

    setResizePreview({
      session,
      start: session.start,
      end: session.end,
      startCol,
      startOffset,
      span,
    });
  };

  useEffect(() => {
    if (!activeSession) {
      return;
    }

    const handleGlobalPointerMove = (e: PointerEvent) => {
      const dayRowInfo = findDayRowFromMousePosition(
        e,
        cellSize,
        dayColumnWidth
      );

      if (!dayRowInfo) {
        setSnappedPreview(null);
        setDragOverPosition({ x: e.clientX, y: e.clientY });
        return;
      }

      const { day, timeColIndex, cellX } = dayRowInfo;
      const { slotIndex } = get30MinuteSlotFromPosition(
        cellX,
        cellSize,
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

    document.addEventListener("pointermove", handleGlobalPointerMove);

    return () => {
      document.removeEventListener("pointermove", handleGlobalPointerMove);
    };
  }, [activeSession, cellSize, dayColumnWidth]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const sessionData = active.data.current?.session as
      | SelectedClassSession
      | undefined;

    if (sessionData) {
      setActiveSession(sessionData);
    }
  };

  const handleSessionDragOver = (
    sessionData: SelectedClassSession,
    day: string,
    timeColIndex: number,
    mouseEvent: MouseEvent
  ) => {
    const position = getMousePositionInDayRow(
      day,
      mouseEvent,
      timeColIndex,
      cellSize,
      dayColumnWidth
    );
    if (!position) {
      return;
    }

    const { slotIndex } = get30MinuteSlotFromPosition(
      position.cellX,
      cellSize,
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

    const position = getMousePositionInDayRow(
      day,
      mouseEvent,
      timeColIndex,
      cellSize,
      dayColumnWidth
    );
    if (!position) {
      return;
    }

    const { slotIndex } = get30MinuteSlotFromPosition(
      position.cellX,
      cellSize,
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

    const position = getMousePositionInDayRow(
      day,
      mouseEvent,
      timeColIndex,
      cellSize,
      dayColumnWidth
    );
    if (!position) {
      return null;
    }

    const { slotIndex } = get30MinuteSlotFromPosition(
      position.cellX,
      cellSize,
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
      sessionData.id,
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

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    day: GenElectiveOption["class"][number]["day"],
    timeColIndex: number
  ) => {
    // Only allow left mouse button (0) or touch
    if (e.pointerType === "mouse" && e.button !== 0) {
      return;
    }

    // Don't create new class if vaul/sheet is open
    if (openClassKey !== null) {
      return;
    }

    // Don't create new class if resizing
    if (resizeState !== null) {
      return;
    }

    // Only allow creating new class if clicking directly on the grid cell background
    // This prevents clicks on children (SessionBlock, etc.) or overlaying elements (sheets, dialogs, etc.)
    if (e.target !== e.currentTarget) {
      return;
    }

    // Capture pointer for touch events to receive move events outside element
    if (e.pointerType === "touch") {
      e.currentTarget.setPointerCapture(e.pointerId);
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const { slotIndex } = get30MinuteSlotFromPosition(
      x,
      cellSize,
      timeColIndex
    );

    dragStartRef.current = { day, timeColIndex, x };
    setDragState({ day, startSlot: slotIndex, endSlot: slotIndex });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!(dragStartRef.current && dragState)) {
      return;
    }

    // Don't update drag state if vaul/sheet is open
    if (openClassKey !== null) {
      return;
    }

    const dayRow = e.currentTarget.closest("[data-day-row]") as HTMLElement;
    if (!dayRow) {
      return;
    }

    const rect = dayRow.getBoundingClientRect();
    const x = e.clientX - rect.left - dayColumnWidth;

    if (x < 0) {
      return;
    }

    const timeColIndex = Math.floor(x / cellSize);
    if (timeColIndex < 0 || timeColIndex >= TIME_SLOTS.length) {
      return;
    }

    const cellX = x - timeColIndex * cellSize;
    const { slotIndex } = get30MinuteSlotFromPosition(
      cellX,
      cellSize,
      timeColIndex
    );

    const startSlot = Math.min(dragState.startSlot, slotIndex);
    const endSlot = Math.max(dragState.startSlot, slotIndex);

    setDragState({ ...dragState, startSlot, endSlot });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    // Release pointer capture if it was set
    if (
      e.pointerType === "touch" &&
      e.currentTarget.hasPointerCapture(e.pointerId)
    ) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    if (!(dragState && dragStartRef.current)) {
      dragStartRef.current = null;
      setDragState(null);
      return;
    }

    // Don't create new class if vaul/sheet is open
    if (openClassKey !== null) {
      dragStartRef.current = null;
      setDragState(null);
      return;
    }

    const startSlot = Math.min(dragState.startSlot, dragState.endSlot);
    const endSlot = Math.max(dragState.startSlot, dragState.endSlot);
    const duration = (endSlot - startSlot) * SLOT_DURATION_MINUTES;

    if (duration >= MIN_DRAG_DURATION) {
      const startTime = getTimeFrom30MinuteSlot(startSlot);
      const endTime = getTimeFrom30MinuteSlot(endSlot + 1);
      const createdSession = addCustom(term, dragState.day, startTime, endTime);

      if (createdSession) {
        const classKey = getClassKey(createdSession);
        setNewClassKey(classKey);
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
      <div style={{ width: `${minWidth}px` }}>
        <div
          className={cn("grid border border-border", styles?.borderTop)}
          style={{
            gridTemplateColumns: `${dayColumnWidth}px repeat(${TIME_SLOTS.length}, ${cellSize}px)`,
          }}
        >
          <div className="sticky left-0 z-10 border-border border-r bg-muted p-2 text-center font-medium text-muted-foreground text-xs">
            {t("days_time.day")}
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

        <div
          className={cn(
            "border-border border-r border-b border-l",
            styles?.borderBottom
          )}
        >
          {DAYS.map((day) => (
            <div
              className={cn(
                "grid border-border border-b last:border-b-0",
                dragState && "cursor-crosshair select-none"
              )}
              data-day-row={day}
              key={day}
              onPointerLeave={handlePointerUp}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              style={{
                gridTemplateColumns: `${dayColumnWidth}px repeat(${TIME_SLOTS.length}, ${cellSize}px)`,
              }}
            >
              <div
                className="sticky left-0 z-40 flex items-center justify-center border-border border-r bg-muted font-medium text-muted-foreground text-xs"
                data-day-label
              >
                {t(`days_short.${day.toLowerCase()}`)}
              </div>
              {TIME_SLOTS.map((time, timeColIndex) => {
                const cellClasses = getClassesForCell(
                  day,
                  timeColIndex,
                  sessions
                );
                const firstColClasses = cellClasses.filter((session) =>
                  isFirstCol(session, timeColIndex)
                );
                const dropId = `${day}-${timeColIndex}`;

                return (
                  <DroppableCell id={dropId} key={dropId}>
                    <div
                      aria-label={`${day} ${time} - ${t("schedule.drag_to_create")}`}
                      className="relative touch-none border-border border-r bg-background last:border-r-0"
                      onPointerDown={(e) =>
                        handlePointerDown(e, day, timeColIndex)
                      }
                      style={{ height: `${rowHeight}px` }}
                    >
                      {firstColClasses.map((session) => {
                        const classKey = getClassKey(session);
                        const isResizingThis =
                          resizeState?.session.id === session.id;

                        // Hide the block being resized - we'll show a preview instead
                        if (isResizingThis) {
                          return null;
                        }

                        const handleOpenChange = (key: string | null) => {
                          setOpenClassKey(key);
                          if (key === null) {
                            setNewClassKey(null);
                          }
                        };

                        return session.type === "custom" ? (
                          <DraggableBlock
                            allSessions={sessions}
                            defaultEditMode={classKey === newClassKey}
                            isResizing={resizeState !== null}
                            key={classKey}
                            onOpenChange={handleOpenChange}
                            onResizeStart={handleResizeStart}
                            openClassKey={openClassKey}
                            session={session}
                            subTextClass={subTextClass}
                            textClass={textClass}
                          />
                        ) : (
                          <SessionBlock
                            allSessions={sessions}
                            key={classKey}
                            onOpenChange={handleOpenChange}
                            openClassKey={openClassKey}
                            session={session}
                            subTextClass={subTextClass}
                            textClass={textClass}
                          />
                        );
                      })}
                      {/* Resize preview */}
                      {resizePreview &&
                        resizePreview.session.day === day &&
                        timeColIndex === resizePreview.startCol && (
                          <div
                            className={`absolute inset-y-0 z-30 m-0.5 cursor-ew-resize select-none rounded border border-primary bg-primary p-1.5 ${textClass}`}
                            style={{
                              left: `${resizePreview.startOffset * 100}%`,
                              width: `calc(${resizePreview.span * 100}% - 0.25rem)`,
                            }}
                          >
                            {resizeState?.edge === "left" && (
                              <div className="absolute inset-y-1 -left-2 w-1 rounded-full bg-primary" />
                            )}
                            {resizeState?.edge === "right" && (
                              <div className="absolute inset-y-1 -right-2 w-1 rounded-full bg-primary" />
                            )}
                            <div className="min-w-0">
                              <div className="truncate text-primary-foreground">
                                {resizePreview.session.courseCode}
                              </div>
                              <div className="truncate">
                                <span className="font-bold text-primary-foreground">
                                  {resizePreview.session.courseName}
                                </span>
                              </div>
                              <div
                                className={`truncate ${subTextClass} text-primary-foreground/80`}
                              >
                                {resizePreview.start} - {resizePreview.end}
                              </div>
                            </div>
                          </div>
                        )}
                      {/* Creating new block preview */}
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
                                className={`absolute inset-y-0 z-30 m-0.5 select-none rounded border border-primary border-dashed bg-primary/20 p-1.5 ${textClass}`}
                                style={{
                                  left: `${startOffset * 100}%`,
                                  width: `calc(${span * 100}% - 0.25rem)`,
                                }}
                              >
                                <div className="min-w-0">
                                  <div className="truncate font-medium text-primary-foreground">
                                    {t("schedule.unassigned_class")}
                                  </div>
                                  <div
                                    className={`truncate ${subTextClass} text-primary-foreground/80`}
                                  >
                                    {formatTimeRange(startTime, endTime)}
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })()}
                      {/* Drag (move) preview */}
                      {snappedPreview &&
                        snappedPreview.day === day &&
                        timeColIndex === snappedPreview.startCol && (
                          <div
                            className={`absolute inset-y-0 z-30 m-0.5 select-none rounded border border-primary border-dashed bg-primary/20 p-1.5 ${textClass}`}
                            style={{
                              left: `${snappedPreview.startOffset * 100}%`,
                              width: `calc(${snappedPreview.span * 100}% - 0.25rem)`,
                            }}
                          >
                            <div className="min-w-0">
                              <div className="truncate font-medium text-primary-foreground">
                                {activeSession?.courseCode ||
                                  t("schedule.unassigned_class")}
                              </div>
                              <div
                                className={`truncate ${subTextClass} text-primary-foreground/80`}
                              >
                                {formatTimeRange(
                                  snappedPreview.start,
                                  snappedPreview.end
                                )}
                              </div>
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
      <DragOverlay dropAnimation={null}>
        {activeSession ? (
          <div
            className={`m-0.5 rounded border border-primary bg-primary/80 p-1.5 ${textClass}`}
          >
            <div className="font-medium text-primary-foreground">
              {activeSession.courseCode}
            </div>
            <div className={`${subTextClass} text-primary-foreground/80`}>
              {activeSession.start}–{activeSession.end}
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
