import { CheckCircleIcon, ClockIcon, User } from "lucide-react";
import { useTranslation } from "react-i18next";

import { SelectButton } from "@/components/class/select-button";
import {
  AccordionContent,
  AccordionItem as AccordionItemPrimitive,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import type { GenElectiveOption } from "@/course/schema";
import { formatLabel, useSelection } from "@/hooks/use-selection";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
  course: GenElectiveOption;
  cls: GenElectiveOption["class"][number];
  index: number;
  openIndexs?: number[];
}

export function AccordionItem({
  course,
  cls,
  index,
  openIndexs,
}: AccordionItemProps) {
  const { t, i18n } = useTranslation();
  const { isSelected } = useSelection(course, cls);

  return (
    <AccordionItemPrimitive
      className={cn(
        isSelected && "border-b-0!",
        isSelected && index > 0 && "-mt-px"
      )}
      value={index}
    >
      <AccordionTrigger
        className={cn(
          "px-4 transition-all",
          isSelected && "border border-primary",
          isSelected &&
            openIndexs !== undefined &&
            openIndexs.includes(index) &&
            "border-b-0",
          "flex items-center justify-center gap-2 hover:cursor-pointer hover:no-underline"
        )}
      >
        {isSelected && <CheckCircleIcon className="size-5 text-primary" />}{" "}
        <span className={cn("font-bold", isSelected && "text-primary")}>
          {formatLabel(cls, t)}
        </span>
      </AccordionTrigger>
      <AccordionContent
        className={cn(
          "px-4 transition-all",
          isSelected && "border border-primary border-t-0"
        )}
      >
        <div className="space-y-4">
          <h2 className="font-bold text-xl">
            <span>{t("course.group")}</span> <span>{cls.group}</span>{" "}
            {i18n.language !== "en" && <span>{t("days_time.day")}</span>}
            {t(`days_time.${cls.day.toLowerCase()}`)}
          </h2>
          <table className="table-fixed text-sm">
            <tbody>
              <tr>
                <td className="w-24 whitespace-nowrap py-1.5 pr-3 font-medium">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <ClockIcon className="h-3.5 w-3.5" />
                    <span>{t("days_time.time")}</span>
                  </div>
                </td>
                <td className="py-1.5">
                  {cls.start} - {cls.end}
                </td>
              </tr>
              <tr>
                <td className="w-24 whitespace-nowrap py-1.5 pr-3 font-medium">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <User className="h-3.5 w-3.5" />
                    <span>{t("course.instructor")}</span>
                  </div>
                </td>
                <td className="py-1.5">
                  <div className="flex flex-wrap gap-2">
                    {cls.instructor.map((instructor) => (
                      <Badge key={instructor} variant="outline">
                        {instructor}
                      </Badge>
                    ))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex justify-end">
            <SelectButton
              cls={cls}
              course={course}
              deselectLabel={t("courses.deselect_class")}
              selectLabel={t("courses.select_class")}
              showSelectPrefix={false}
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItemPrimitive>
  );
}
