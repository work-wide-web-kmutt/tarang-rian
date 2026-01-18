import { ClockIcon, User } from "lucide-react";
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
}

export function AccordionItem({ course, cls, index }: AccordionItemProps) {
  const { t, i18n } = useTranslation();
  const { isSelected } = useSelection(course, cls);

  return (
    <AccordionItemPrimitive value={index}>
      <AccordionTrigger
        className={cn(
          "px-4 transition-all",
          isSelected && "border border-primary",
          "hover:cursor-pointer hover:no-underline"
        )}
      >
        {formatLabel(cls, t)}
      </AccordionTrigger>
      <AccordionContent
        className={cn(
          "px-4 transition-all",
          isSelected && "border border-primary border-t-0 pt-4"
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
