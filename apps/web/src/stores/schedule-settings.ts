import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SCHEDULE_SIZE } from "@/constants/schedule";
import {
  DEFAULT_SCHEDULE_TIME_RANGE,
  normalizeScheduleTimeRange,
  type ScheduleTimeRange,
} from "@/constants/times";

export type ScheduleSize = keyof typeof SCHEDULE_SIZE;

interface ScheduleSettingsState {
  size: ScheduleSize;
  timeRange: ScheduleTimeRange;
  actions: {
    setSize: (size: ScheduleSize) => void;
    setTimeRange: (range: ScheduleTimeRange) => void;
  };
}

export type PersistedScheduleSettings = Pick<
  ScheduleSettingsState,
  "size" | "timeRange"
>;

export function migrateScheduleSettings(
  persistedState: unknown
): PersistedScheduleSettings {
  const persisted =
    persistedState && typeof persistedState === "object"
      ? (persistedState as Partial<PersistedScheduleSettings>)
      : {};

  const size =
    typeof persisted.size === "string" && persisted.size in SCHEDULE_SIZE
      ? persisted.size
      : "md";

  return {
    size,
    timeRange: normalizeScheduleTimeRange(persisted.timeRange),
  };
}

const useScheduleSettingsStore = create<ScheduleSettingsState>()(
  persist(
    (set) => ({
      size: "md",
      timeRange: DEFAULT_SCHEDULE_TIME_RANGE,
      actions: {
        setSize: (size: ScheduleSize) => set({ size }),
        setTimeRange: (range: ScheduleTimeRange) =>
          set({ timeRange: normalizeScheduleTimeRange(range) }),
      },
    }),
    {
      name: "schedule-settings-storage",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state): PersistedScheduleSettings => ({
        size: state.size,
        timeRange: state.timeRange,
      }),
      migrate: migrateScheduleSettings,
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...migrateScheduleSettings(persistedState),
      }),
    }
  )
);

export const useScheduleSize = () =>
  useScheduleSettingsStore((state) => state.size);

export const useScheduleTimeRange = () =>
  useScheduleSettingsStore((state) => state.timeRange);

export const useScheduleSettingsActions = () =>
  useScheduleSettingsStore((state) => state.actions);

export const getScheduleSettings = () => useScheduleSettingsStore.getState();
