import { useDraggable } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import { getClassKey, getTimeSlotPosition } from "@/components/schedule/utils";
import type { SelectedClassSession } from "@/stores/selected";
import { SessionBlock } from "./block";

interface DraggableBlockProps {
  session: SelectedClassSession;
  allSessions: SelectedClassSession[];
  openClassKey: string | null;
  onOpenChange: (classKey: string | null) => void;
  onResizeStart?: (
    session: SelectedClassSession,
    edge: "left" | "right"
  ) => void;
  isResizing?: boolean;
}

export function DraggableBlock({
  session,
  allSessions,
  openClassKey,
  onOpenChange,
  onResizeStart,
  isResizing,
}: DraggableBlockProps) {
  const classKey = getClassKey(session);
  const isCustom = session.type === "custom";
  const { startOffset, span } = getTimeSlotPosition(session.start, session.end);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: classKey,
    disabled: !isCustom || isResizing,
    data: {
      session,
    },
  });

  const handleResizeMouseDown = (
    e: React.MouseEvent,
    edge: "left" | "right"
  ) => {
    if (!isCustom) {
      return;
    }
    e.stopPropagation();
    e.preventDefault();
    onResizeStart?.(session, edge);
  };

  return (
    <div
      className="group absolute inset-y-0 w-full"
      ref={setNodeRef}
      style={{
        opacity: isDragging ? 0 : undefined,
      }}
    >
      {/* Left resize handle (adjust start time) */}
      {isCustom && (
        <div
          className="absolute top-0 z-40 h-full w-2 cursor-ew-resize"
          onMouseDown={(e) => handleResizeMouseDown(e, "left")}
          style={{
            left: `${startOffset * 100}%`,
          }}
          title="Drag to change start time"
        />
      )}

      {/* Drag handle */}
      <div
        {...(isCustom && !isResizing ? attributes : {})}
        {...(isCustom && !isResizing ? listeners : {})}
        className={`absolute top-0 z-30 flex h-full w-6 items-center justify-center rounded-l bg-primary/20 ${
          isCustom && !isResizing
            ? "cursor-grab active:cursor-grabbing"
            : "cursor-default opacity-50"
        }`}
        data-drag-handle
        style={{
          left: `${startOffset * 100}%`,
        }}
      >
        <GripVertical className="h-3 w-3 text-primary-foreground" />
      </div>

      {/* Right resize handle (adjust end time) */}
      {isCustom && (
        <div
          className="absolute top-0 z-40 h-full w-2 cursor-ew-resize"
          onMouseDown={(e) => handleResizeMouseDown(e, "right")}
          style={{
            right: `calc(${(1 - startOffset - span) * 100}%)`,
          }}
          title="Drag to change end time"
        />
      )}

      <SessionBlock
        allSessions={allSessions}
        extraLeftPadding="1.5rem"
        isCustom={isCustom}
        onOpenChange={onOpenChange}
        openClassKey={openClassKey}
        session={session}
      />
    </div>
  );
}
