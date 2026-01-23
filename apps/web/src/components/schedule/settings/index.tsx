import { Settings } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { SizeSelector } from "./size-selector";

interface ScheduleSettingsProps {
  triggerClassName?: string;
  onOpenChange?: (open: boolean) => void;
}

export function ScheduleSettings({
  triggerClassName,
  onOpenChange,
}: ScheduleSettingsProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <Sheet onOpenChange={handleOpenChange} open={open}>
      <SheetTrigger
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          triggerClassName
        )}
      >
        <Settings className="size-4" />
        {t("settings.title")}
      </SheetTrigger>

      <SheetContent
        className="flex h-full w-[80vw] flex-col rounded-l-lg border-l p-6 text-foreground sm:w-[60vw] lg:w-[40vw] xl:w-[20vw]"
        side="right"
      >
        <SheetHeader className="p-0 pr-10">
          <SheetTitle>{t("settings.title")}</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-3 overflow-y-auto">
          <SizeSelector />
        </div>
      </SheetContent>
    </Sheet>
  );
}
