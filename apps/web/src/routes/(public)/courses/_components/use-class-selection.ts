import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { GenElectiveOption } from "@/course/schema";
import {
  type SelectedClassSession,
  useSelectedGenElectives,
  useSelectedGenElectivesActions,
} from "@/stores/selected";

export interface ClassSelectionResult {
  isSelected: boolean;
  selectedSession: SelectedClassSession | undefined;
  label: string;
  toggle: () => void;
}

export function useClassSelection(
  course: GenElectiveOption,
  cls: GenElectiveOption["class"][number]
): ClassSelectionResult {
  const { t } = useTranslation();
  const selected = useSelectedGenElectives();
  const { add, remove } = useSelectedGenElectivesActions();

  const selectedSession = useMemo(
    () =>
      selected.find(
        (s) =>
          s.courseCode === course.code &&
          s.group === cls.group &&
          s.day === cls.day &&
          s.start === cls.start &&
          s.end === cls.end
      ),
    [selected, course.code, cls.group, cls.day, cls.start, cls.end]
  );

  const isSelected = selectedSession !== undefined;

  const label = `${t(`days_short.${cls.day.toLowerCase()}`)} ${cls.start} - ${cls.end}`;

  const toggle = useCallback(() => {
    if (isSelected && selectedSession) {
      remove(selectedSession.id);
    } else {
      add(course, cls);
    }
  }, [isSelected, selectedSession, remove, add, course, cls]);

  return {
    isSelected,
    selectedSession,
    label,
    toggle,
  };
}

export function formatClassLabel(
  cls: GenElectiveOption["class"][number],
  t: (key: string) => string
): string {
  return `${t(`days_short.${cls.day.toLowerCase()}`)} ${cls.start} - ${cls.end}`;
}
