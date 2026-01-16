import CourseVaul from "@/components/course/vaul";
import {
  getClassKey,
  getOverlappingSessions,
  getTimeSlotPosition,
  hasOverlap,
} from "@/components/schedule/utils";
import type { SelectedClassSession } from "@/stores/selected";

interface SessionBlockProps {
  session: SelectedClassSession;
  allSessions: SelectedClassSession[];
  openClassKey: string | null;
  onOpenChange: (classKey: string | null) => void;
  extraLeftPadding?: string;
  isCustom?: boolean;
}

export function SessionBlock({
  session,
  allSessions,
  openClassKey,
  onOpenChange,
  extraLeftPadding,
}: SessionBlockProps) {
  const { startOffset, span } = getTimeSlotPosition(session.start, session.end);
  const classKey = getClassKey(session);
  const hasOverlapping = hasOverlap(session, allSessions);
  const overlappingSessions = getOverlappingSessions(session, allSessions);

  return (
    <CourseVaul
      className={`absolute inset-y-0 z-20 m-0.5 cursor-pointer rounded border p-1.5 text-xs ${
        hasOverlapping
          ? "border-destructive bg-destructive/40"
          : "border-primary bg-primary"
      }`}
      data-session-block
      key={classKey}
      onOpenChange={(open) => {
        onOpenChange(open ? classKey : null);
      }}
      overlappingSessions={overlappingSessions}
      session={session}
      style={{
        left: `${startOffset * 100}%`,
        width: `calc(${span * 100}% - 0.25rem)`,
        paddingLeft: extraLeftPadding,
      }}
    >
      <div>
        <div
          className={`${
            hasOverlapping
              ? "text-destructive-foreground"
              : "text-primary-foreground"
          }`}
        >
          <p>{session.courseCode}</p>{" "}
          <p className="font-bold">{session.courseName}</p>
        </div>
        <div
          className={`text-[10px] ${
            hasOverlapping
              ? "text-destructive-foreground/80"
              : "text-primary-foreground/80"
          }`}
        >
          {session.start} - {session.end}
        </div>
      </div>
    </CourseVaul>
  );
}
