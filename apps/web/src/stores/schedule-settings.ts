import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { SCHEDULE_SIZE } from "@/constants/schedule";
import {
  DEFAULT_SCHEDULE_TIME_RANGE,
  normalizeScheduleTimeRange,
} from "@/constants/times";
import type { ScheduleTimeRange } from "@/constants/times";

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
    persistedState !== null && typeof persistedState === "object"
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
      actions: {
        setSize: (size: ScheduleSize) => {
          set({ size });
        },
        setTimeRange: (range: ScheduleTimeRange) => {
          set({ timeRange: normalizeScheduleTimeRange(range) });
        },
      },
      size: "md",
      timeRange: DEFAULT_SCHEDULE_TIME_RANGE,
    }),
    {
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...migrateScheduleSettings(persistedState),
      }),
      migrate: migrateScheduleSettings,
      name: "schedule-settings-storage",
      partialize: (state): PersistedScheduleSettings => ({
        size: state.size,
        timeRange: state.timeRange,
      }),
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);

export function useScheduleSize(): ScheduleSize {
  return useScheduleSettingsStore((state) => state.size);
}

export function useScheduleTimeRange(): ScheduleTimeRange {
  return useScheduleSettingsStore((state) => state.timeRange);
}

export function useScheduleSettingsActions(): ScheduleSettingsState["actions"] {
  return useScheduleSettingsStore((state) => state.actions);
}

export function getScheduleSettings(): ScheduleSettingsState {
  return useScheduleSettingsStore.getState();
}
