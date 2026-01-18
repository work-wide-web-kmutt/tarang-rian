import { CheckCircleIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import type { GenElectiveOption } from "@/course/schema";
import { useClassSelection } from "@/routes/(public)/courses/_components/use-class-selection";

interface ClassSelectButtonProps {
  course: GenElectiveOption;
  cls: GenElectiveOption["class"][number];
  showSelectPrefix?: boolean;
  selectLabel?: string;
  deselectLabel?: string;
}

export function ClassSelectButton({
  course,
  cls,
  showSelectPrefix = true,
  selectLabel,
  deselectLabel,
}: ClassSelectButtonProps) {
  const { t } = useTranslation();
  const { isSelected, label, toggle } = useClassSelection(course, cls);

  const getButtonText = () => {
    if (isSelected) {
      return deselectLabel ?? label;
    }
    if (selectLabel) {
      return selectLabel;
    }
    return showSelectPrefix ? `${t("courses.select_class")} ${label}` : label;
  };

  return (
    <Button
      onClick={toggle}
      size="lg"
      variant={isSelected ? "secondary" : "outline"}
    >
      {isSelected && <CheckCircleIcon />}
      {getButtonText()}
    </Button>
  );
}
