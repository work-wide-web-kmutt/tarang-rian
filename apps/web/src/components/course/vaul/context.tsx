import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface CourseVaulContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

const CourseVaulContext = createContext<CourseVaulContextValue | null>(null);

interface CourseVaulProviderProps {
  children: ReactNode;
  isHighlighted?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CourseVaulProvider({
  children,
  isHighlighted = false,
  onOpenChange,
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
    }),
    [open, isEditing, handleSetOpen]
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
