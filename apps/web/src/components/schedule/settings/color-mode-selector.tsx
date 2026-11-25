import { useTranslation } from "react-i18next";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SCHEDULE_COLOR_MODES } from "@/constants/schedule";
import {
  isScheduleColorMode,
  useScheduleColorMode,
  useScheduleSettingsActions,
} from "@/stores/schedule-settings";

export function ColorModeSelector() {
  const { t } = useTranslation();
  const colorMode = useScheduleColorMode();
  const { setColorMode } = useScheduleSettingsActions();

  return (
    <div className="flex flex-col">
      <span className="text-muted-foreground text-sm">
        {t("settings.color_mode")}
      </span>
      <Select
        onValueChange={(val: string | null) => {
          if (isScheduleColorMode(val)) {
            setColorMode(val);
          }
        }}
        value={colorMode}
      >
        <SelectTrigger className="h-8 w-full">
          <SelectValue>{t(`settings.color_mode_${colorMode}`)}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {SCHEDULE_COLOR_MODES.map((mode) => (
            <SelectItem key={mode} value={mode}>
              {t(`settings.color_mode_${mode}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
