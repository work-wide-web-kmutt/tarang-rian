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
}

export function DraggableBlock({
  session,
  allSessions,
  openClassKey,
  onOpenChange,
}: DraggableBlockProps) {
  const classKey = getClassKey(session);
  const isCustom = session.type === "custom";
  const { startOffset } = getTimeSlotPosition(session.start, session.end);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: classKey,
    disabled: !isCustom,
    data: {
      session,
    },
  });

  return (
    <div
      className="group absolute inset-y-0 w-full"
      ref={setNodeRef}
      style={{ opacity: isDragging ? 0 : undefined }}
    >
      {isCustom && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-0 z-30 flex h-full w-6 cursor-grab items-center justify-center rounded-l bg-primary/20 opacity-0 transition-opacity hover:opacity-100 active:cursor-grabbing group-hover:opacity-100"
          data-drag-handle
          style={{
            left: `${startOffset * 100}%`,
          }}
        >
          <GripVertical className="h-3 w-3 text-primary-foreground" />
        </div>
      )}
      <SessionBlock
        allSessions={allSessions}
        extraLeftPadding={isCustom ? "1.5rem" : undefined}
        onOpenChange={onOpenChange}
        openClassKey={openClassKey}
        session={session}
      />
    </div>
  );
}
