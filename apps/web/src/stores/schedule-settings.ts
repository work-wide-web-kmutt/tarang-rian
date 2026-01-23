import { create, type StateCreator } from "zustand";
import { SCHEDULE_SIZE } from "@/constants/schedule";

type ScheduleSize = keyof typeof SCHEDULE_SIZE;

interface ScheduleSettingsState {
  size: ScheduleSize;
  actions: {
    setSize: (size: ScheduleSize) => void;
  };
}

const STORAGE_KEY = "schedule-settings-storage";

const getStoredSize = (): ScheduleSize => {
  if (typeof window === "undefined") {
    return "md";
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return "md";
    }
    const parsed = JSON.parse(stored) as { size?: ScheduleSize };
    const size = parsed.size;
    if (size && size in SCHEDULE_SIZE) {
      return size;
    }
    return "md";
  } catch {
    return "md";
  }
};

const saveToStorage = (size: ScheduleSize) => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ size }));
  } catch {
    // Ignore storage errors
  }
};

const scheduleSettingsStoreCreator: StateCreator<ScheduleSettingsState> = (
  set
) => ({
  size: getStoredSize(),
  actions: {
    setSize: (size: ScheduleSize) => {
      saveToStorage(size);
      set({ size });
    },
  },
});

const useScheduleSettingsStore = create<ScheduleSettingsState>(
  scheduleSettingsStoreCreator
);

export const useScheduleSize = () =>
  useScheduleSettingsStore((state) => state.size);

export const useScheduleSettingsActions = () =>
  useScheduleSettingsStore((state) => state.actions);

export const getScheduleSettings = () => useScheduleSettingsStore.getState();
