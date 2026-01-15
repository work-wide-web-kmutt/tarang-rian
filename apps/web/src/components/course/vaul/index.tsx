import type { CSSProperties, ReactNode } from "react";
import { CourseVaulContent } from "@/components/course/vaul/content";
import { CourseVaulProvider } from "@/components/course/vaul/context";
import type { SelectedClassSession } from "@/stores/selected";

interface CourseVaulProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  isHighlighted?: boolean;
  onOpenChange?: (open: boolean) => void;
  session?: SelectedClassSession;
  overlappingSessions?: SelectedClassSession[];
  onOpenOtherCourse?: (classKey: string) => void;
}

function CourseVaul({
  children,
  style,
  className,
  isHighlighted = false,
  onOpenChange,
  session,
  overlappingSessions = [],
  onOpenOtherCourse,
}: CourseVaulProps) {
  return (
    <CourseVaulProvider
      className={className}
      isHighlighted={isHighlighted}
      onOpenChange={onOpenChange}
      onOpenOtherCourse={onOpenOtherCourse}
      overlappingSessions={overlappingSessions}
      session={session}
      style={style}
      triggerChildren={children}
    >
      <CourseVaulContent />
    </CourseVaulProvider>
  );
}

export default CourseVaul;
