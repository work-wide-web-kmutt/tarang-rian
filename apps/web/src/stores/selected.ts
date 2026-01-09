import { create, type StateCreator } from "zustand";

import type { GenElectiveOption } from "../course/schema";

interface SelectedGenElectivesState {
  selected: GenElectiveOption[];
  actions: {
    add: (option: GenElectiveOption) => void;
    removeByCode: (code: string) => void;
    clear: () => void;
  };
}

const STORAGE_KEY = "selected-gen-electives-storage";

const getStoredSelected = (): GenElectiveOption[] => {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (selected: GenElectiveOption[]) => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
  } catch {
    // Ignore storage errors
  }
};

const selectedGenElectivesStoreCreator: StateCreator<
  SelectedGenElectivesState
> = (set) => ({
  selected: getStoredSelected(),
  actions: {
    add: (option: GenElectiveOption) =>
      set((state) => {
        const exists = state.selected.some(
          (current: GenElectiveOption) => current.code === option.code
        );

        if (exists) {
          return state;
        }

        const updated = [...state.selected, option];
        saveToStorage(updated);
        return { selected: updated };
      }),
    removeByCode: (code: string) =>
      set((state) => {
        const updated = state.selected.filter(
          (option: GenElectiveOption) => option.code !== code
        );
        saveToStorage(updated);
        return { selected: updated };
      }),
    clear: () => {
      saveToStorage([]);
      set({ selected: [] });
    },
  },
});

const useSelectedGenElectivesStore = create<SelectedGenElectivesState>(
  selectedGenElectivesStoreCreator
);

export const useSelectedGenElectives = () =>
  useSelectedGenElectivesStore((state) => state.selected);

export const useSelectedGenElectivesActions = () =>
  useSelectedGenElectivesStore((state) => state.actions);
