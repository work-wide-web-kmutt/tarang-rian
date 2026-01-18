import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { GenElectiveOption } from "@/course/schema";
import { formatLabel } from "@/hooks/use-selection";
import {
  useSelectedGenElectives,
  useSelectedGenElectivesActions,
} from "@/stores/selected";

interface SelectDropdownProps {
  course: GenElectiveOption;
}

export function SelectDropdown({ course }: SelectDropdownProps) {
  const { t } = useTranslation();
  const selected = useSelectedGenElectives();
  const { add, remove } = useSelectedGenElectivesActions();

  const isClassSelected = (cls: GenElectiveOption["class"][number]) =>
    selected.find(
      (s) =>
        s.courseCode === course.code &&
        s.group === cls.group &&
        s.day === cls.day &&
        s.start === cls.start &&
        s.end === cls.end
    );

  const selectedClasses = course.class.filter((cls) => isClassSelected(cls));
  const selectedCount = selectedClasses.length;

  const getButtonLabel = (): string => {
    if (selectedCount === 0) {
      return t("courses.select_class");
    }
    if (selectedCount === 1) {
      const cls = selectedClasses[0];
      return formatLabel(cls, t);
    }
    return t("courses.selected_count", { count: selectedCount });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={(props) => (
          <Button
            {...props}
            variant={selectedCount > 0 ? "secondary" : "outline"}
          >
            {getButtonLabel()}
          </Button>
        )}
      />
      <DropdownMenuContent>
        {course.class.map((cls) => {
          const selectedSession = isClassSelected(cls);
          const isSelected = selectedSession !== undefined;

          return (
            <DropdownMenuCheckboxItem
              checked={isSelected}
              key={`${course.code}-${cls.group}-${cls.day}-${cls.start}-${cls.end}`}
              onCheckedChange={() => {
                if (isSelected && selectedSession) {
                  remove(selectedSession.id);
                } else {
                  add(course, cls);
                }
              }}
            >
              {formatLabel(cls, t)}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
