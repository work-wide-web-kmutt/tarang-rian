import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CSSProperties, ReactNode } from "react";

import type { SelectedClassSession } from "@/stores/selected";
import { useSelectedGenElectivesActions } from "@/stores/selected";

interface CourseVaulContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  session?: SelectedClassSession;
  overlappingSessions: SelectedClassSession[];
  handleRemove: () => void;
}

const CourseVaulContext = createContext<CourseVaulContextValue | null>(null);

const EMPTY_OVERLAPPING_SESSIONS: SelectedClassSession[] = [];

interface CourseVaulProviderProps {
  children: ReactNode;
  triggerChildren: ReactNode;
  style?: CSSProperties;
  className?: string;
  onOpenChange?: (open: boolean) => void;
  session?: SelectedClassSession;
  overlappingSessions?: SelectedClassSession[];
  shouldOpen?: boolean;
  defaultEditMode?: boolean;
}

export function CourseVaulProvider({
  children,
  triggerChildren,
  style,
  className,
  onOpenChange,
  session,
  overlappingSessions = EMPTY_OVERLAPPING_SESSIONS,
  shouldOpen = false,
  defaultEditMode = false,
}: CourseVaulProviderProps) {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { remove } = useSelectedGenElectivesActions();

  useEffect(() => {
    if (shouldOpen) {
      // oxlint-disable-next-line react/react-compiler -- synchronize controlled open state from parent props
      setOpen(true);
      if (defaultEditMode) {
        // oxlint-disable-next-line react/react-compiler -- synchronize controlled edit state from parent props
        setIsEditing(true);
      }
    } else if (!shouldOpen && open) {
      setOpen(false);
    }
  }, [shouldOpen, open, defaultEditMode]);

  useEffect(() => {
    if (!open) {
      // oxlint-disable-next-line react/react-compiler -- reset edit state when controlled sheet closes
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

  const handleRemove = useCallback(() => {
    if (!session) {
      return;
    }
    remove(session.id);
    handleSetOpen(false);
  }, [session, remove, handleSetOpen]);

  const contextValue = useMemo(
    () => ({
      children: triggerChildren,
      className,
      handleRemove,
      isEditing,
      open,
      overlappingSessions,
      session,
      setIsEditing,
      setOpen: handleSetOpen,
      style,
    }),
    [
      open,
      isEditing,
      handleSetOpen,
      triggerChildren,
      style,
      className,
      session,
      overlappingSessions,
      handleRemove,
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
