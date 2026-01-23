import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { SCHEDULE_SIZE } from "@/constants/schedule";

type ScheduleSize = keyof typeof SCHEDULE_SIZE;

interface ScheduleSettingsState {
  size: ScheduleSize;
  actions: {
    setSize: (size: ScheduleSize) => void;
  };
}

const useScheduleSettingsStore = create<ScheduleSettingsState>()(
  persist(
    (set) => ({
      size: "md",
      actions: {
        setSize: (size: ScheduleSize) => set({ size }),
      },
    }),
    {
      name: "schedule-settings-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ size: state.size }),
    }
  )
);

export const useScheduleSize = () =>
  useScheduleSettingsStore((state) => state.size);

export const useScheduleSettingsActions = () =>
  useScheduleSettingsStore((state) => state.actions);

export const getScheduleSettings = () => useScheduleSettingsStore.getState();
