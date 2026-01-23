import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SizeSelector } from "./size-selector";

export function ScheduleSettings() {
  const { t } = useTranslation();

  return (
    <Accordion className="w-full">
      <AccordionItem value="settings">
        <AccordionTrigger className="px-4">
          {t("settings.title")}
        </AccordionTrigger>
        <AccordionContent className="px-4">
          <div className="space-y-3">
            <SizeSelector />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
