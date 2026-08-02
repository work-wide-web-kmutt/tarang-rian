import { useTranslation } from "react-i18next";
import { RangeSlider } from "@/components/ui/slider";
import {
  formatScheduleHour,
  SCHEDULE_TIME_RANGE_LIMITS,
} from "@/constants/times";
import {
  useScheduleSettingsActions,
  useScheduleTimeRange,
} from "@/stores/schedule-settings";

export function TimeRangeSelector() {
  const { t } = useTranslation();
  const timeRange = useScheduleTimeRange();
  const { setTimeRange } = useScheduleSettingsActions();

  const value: readonly [number, number] = [
    timeRange.startHour,
    timeRange.endHour,
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="text-muted-foreground">
          {t("settings.time_range")}
        </span>
        <span className="font-medium tabular-nums">
          {formatScheduleHour(timeRange.startHour)} –{" "}
          {formatScheduleHour(timeRange.endHour)}
        </span>
      </div>
      <RangeSlider
        getAriaLabel={(index) =>
          index === 0
            ? t("settings.time_range_start_aria")
            : t("settings.time_range_end_aria")
        }
        getAriaValueText={(_formattedValue, value, index) =>
          `${index === 0 ? t("settings.time_range_start") : t("settings.time_range_end")}: ${formatScheduleHour(value)}`
        }
        max={SCHEDULE_TIME_RANGE_LIMITS.maxHour}
        min={SCHEDULE_TIME_RANGE_LIMITS.minHour}
        minStepsBetweenValues={SCHEDULE_TIME_RANGE_LIMITS.minDurationHours}
        onValueChange={(nextValue) => {
          const [startHour, endHour] = nextValue;
          if (
            typeof startHour === "number" &&
            typeof endHour === "number" &&
            endHour - startHour >= SCHEDULE_TIME_RANGE_LIMITS.minDurationHours
          ) {
            setTimeRange({ startHour, endHour });
          }
        }}
        step={1}
        thumbCollisionBehavior="none"
        value={value}
      />
      <div className="flex justify-between text-muted-foreground text-xs tabular-nums">
        <span>{formatScheduleHour(SCHEDULE_TIME_RANGE_LIMITS.minHour)}</span>
        <span>{formatScheduleHour(SCHEDULE_TIME_RANGE_LIMITS.maxHour)}</span>
      </div>
    </div>
  );
}
