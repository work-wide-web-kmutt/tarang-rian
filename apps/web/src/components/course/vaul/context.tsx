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
  overlappingSessions = [],
  shouldOpen = false,
  defaultEditMode = false,
}: CourseVaulProviderProps) {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { remove } = useSelectedGenElectivesActions();

  useEffect(() => {
    if (shouldOpen) {
      setOpen(true);
      if (defaultEditMode) {
        setIsEditing(true);
      }
    } else if (!shouldOpen && open) {
      setOpen(false);
    }
  }, [shouldOpen, open, defaultEditMode]);

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

  const handleRemove = useCallback(() => {
    if (!session) {
      return;
    }
    remove(session.id);
    handleSetOpen(false);
  }, [session, remove, handleSetOpen]);

  const contextValue = useMemo(
    () => ({
      open,
      setOpen: handleSetOpen,
      isEditing,
      setIsEditing,
      children: triggerChildren,
      style,
      className,
      session,
      overlappingSessions,
      handleRemove,
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
