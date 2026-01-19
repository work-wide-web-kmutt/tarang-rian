import type { CSSProperties, ReactNode } from "react";
import { CourseVaulProvider } from "@/components/course/vaul/context";
import { CourseVaulSheet } from "@/components/course/vaul/sheet";
import type { SelectedClassSession } from "@/stores/selected";

interface CourseVaulProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  onOpenChange?: (open: boolean) => void;
  session?: SelectedClassSession;
  overlappingSessions?: SelectedClassSession[];
  shouldOpen?: boolean;
  defaultEditMode?: boolean;
}

export default function CourseVaul({
  children,
  style,
  className,
  onOpenChange,
  session,
  overlappingSessions = [],
  shouldOpen = false,
  defaultEditMode = false,
}: CourseVaulProps) {
  return (
    <CourseVaulProvider
      className={className}
      defaultEditMode={defaultEditMode}
      onOpenChange={onOpenChange}
      overlappingSessions={overlappingSessions}
      session={session}
      shouldOpen={shouldOpen}
      style={style}
      triggerChildren={children}
    >
      <CourseVaulSheet />
    </CourseVaulProvider>
  );
}
