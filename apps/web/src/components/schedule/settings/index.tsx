import { Search, Settings, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { buttonVariants } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { filterSettings, getSettingsRegistry } from "./settings-registry";

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
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSearchQuery("");
    }
    onOpenChange?.(newOpen);
  };

  const settingsRegistry = useMemo(() => getSettingsRegistry(t), [t]);

  const filteredSettings = useMemo(
    () => filterSettings(settingsRegistry, searchQuery),
    [settingsRegistry, searchQuery]
  );

  const hasResults = filteredSettings.length > 0;
  const hasQuery = searchQuery.trim() !== "";

  return (
    <Sheet onOpenChange={handleOpenChange} open={open}>
      <SheetTrigger
        aria-label={t("settings.title")}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          triggerClassName
        )}
      >
        <Settings className="size-5 sm:size-4" />
        <span className="hidden sm:inline">{t("settings.title")}</span>
      </SheetTrigger>

      <SheetContent
        className="flex h-full w-[80vw] flex-col overflow-x-hidden rounded-l-lg border-l p-6 text-foreground sm:w-[60vw] lg:w-[40vw] xl:w-[20vw]"
        side="right"
      >
        <SheetHeader className="p-0 pr-10">
          <SheetTitle>{t("settings.title")}</SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden">
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <Search className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              aria-label={t("settings.search_placeholder")}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("settings.search_placeholder")}
              role="searchbox"
              type="search"
              value={searchQuery}
            />
            {hasQuery && (
              <InputGroupAddon align="inline-end">
                <button
                  aria-label={t("settings.search_clear")}
                  className="flex items-center justify-center"
                  onClick={() => setSearchQuery("")}
                  type="button"
                >
                  <X className="size-4" />
                </button>
              </InputGroupAddon>
            )}
          </InputGroup>

          {(() => {
            if (hasResults) {
              return (
                <div className="space-y-3">
                  {filteredSettings.map((setting) => (
                    <div key={setting.id}>{setting.render()}</div>
                  ))}
                </div>
              );
            }

            if (hasQuery) {
              return (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
                  <p className="text-muted-foreground text-sm">
                    {t("settings.search_no_results")}
                  </p>
                  <button
                    className="text-muted-foreground text-xs underline underline-offset-4 transition-colors hover:text-foreground"
                    onClick={() => setSearchQuery("")}
                    type="button"
                  >
                    {t("settings.search_clear")}
                  </button>
                </div>
              );
            }

            return (
              <div className="space-y-3">
                {settingsRegistry.map((setting) => (
                  <div key={setting.id}>{setting.render()}</div>
                ))}
              </div>
            );
          })()}
        </div>
      </SheetContent>
    </Sheet>
  );
}
