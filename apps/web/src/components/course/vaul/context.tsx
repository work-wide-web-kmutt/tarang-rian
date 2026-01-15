import {
  type CSSProperties,
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { SelectedClassSession } from "@/stores/selected";

interface CourseVaulContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  isHighlighted: boolean;
  session?: SelectedClassSession;
  overlappingSessions: SelectedClassSession[];
  onOpenOtherCourse?: (classKey: string) => void;
}

const CourseVaulContext = createContext<CourseVaulContextValue | null>(null);

interface CourseVaulProviderProps {
  children: ReactNode;
  triggerChildren: ReactNode;
  style?: CSSProperties;
  className?: string;
  isHighlighted?: boolean;
  onOpenChange?: (open: boolean) => void;
  session?: SelectedClassSession;
  overlappingSessions?: SelectedClassSession[];
  onOpenOtherCourse?: (classKey: string) => void;
}

export function CourseVaulProvider({
  children,
  triggerChildren,
  style,
  className,
  isHighlighted = false,
  onOpenChange,
  session,
  overlappingSessions = [],
  onOpenOtherCourse,
}: CourseVaulProviderProps) {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isHighlighted) {
      setOpen(true);
    }
  }, [isHighlighted]);

  useEffect(() => {
    if (!open) {
      setIsEditing(false);
    }
  }, [open]);

  const handleSetOpen = useCallback(
    (newOpen: boolean) => {
      setOpen(newOpen);
      onOpenChange?.(newOpen);
    },
    [onOpenChange]
  );

  const contextValue = useMemo(
    () => ({
      open,
      setOpen: handleSetOpen,
      isEditing,
      setIsEditing,
      children: triggerChildren,
      style,
      className,
      isHighlighted,
      session,
      overlappingSessions,
      onOpenOtherCourse,
    }),
    [
      open,
      isEditing,
      handleSetOpen,
      triggerChildren,
      style,
      className,
      isHighlighted,
      session,
      overlappingSessions,
      onOpenOtherCourse,
    ]
  );

  return (
    <CourseVaulContext.Provider value={contextValue}>
      {children}
    </CourseVaulContext.Provider>
  );
}

export function useCourseVaulContext() {
  const context = useContext(CourseVaulContext);
  if (!context) {
    throw new Error(
      "useCourseVaulContext must be used within CourseVaulProvider"
    );
  }
  return context;
}
