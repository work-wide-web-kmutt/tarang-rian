import { useTranslation } from "react-i18next";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SCHEDULE_SIZE } from "@/constants/schedule";
import {
  useScheduleSettingsActions,
  useScheduleSize,
} from "@/stores/schedule-settings";

function isScheduleSize(value: string): value is keyof typeof SCHEDULE_SIZE {
  return value in SCHEDULE_SIZE;
}

export function SizeSelector() {
  const { t } = useTranslation();
  const size = useScheduleSize();
  const { setSize } = useScheduleSettingsActions();

  return (
    <div className="flex flex-col">
      <span className="text-muted-foreground text-sm">
        {t("settings.size")}
      </span>
      <Select
        onValueChange={(val: string | null) => {
          if (val !== null && val !== "" && isScheduleSize(val)) {
            setSize(val);
          }
        }}
        value={size}
      >
        <SelectTrigger className="h-8 w-full">
          <SelectValue>{`${t(`settings.size_${size}`)} (${size})`}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.keys(SCHEDULE_SIZE).map((sizeKey) => {
            const translatedName = t(`settings.size_${sizeKey}`);
            return (
              <SelectItem key={sizeKey} value={sizeKey}>
                {`${translatedName} (${sizeKey})`}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
