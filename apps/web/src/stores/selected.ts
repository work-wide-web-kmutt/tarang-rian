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

const selectedGenElectivesStoreCreator: StateCreator<
  SelectedGenElectivesState
> = (set) => ({
  selected: [],
  actions: {
    add: (option: GenElectiveOption) =>
      set((state) => {
        const exists = state.selected.some(
          (current: GenElectiveOption) => current.code === option.code
        );

        if (exists) {
          return state;
        }

        return { selected: [...state.selected, option] };
      }),
    removeByCode: (code: string) =>
      set((state) => ({
        selected: state.selected.filter(
          (option: GenElectiveOption) => option.code !== code
        ),
      })),
    clear: () => set({ selected: [] }),
  },
});

const useSelectedGenElectivesStore = create<SelectedGenElectivesState>(
  selectedGenElectivesStoreCreator
);

export const useSelectedGenElectives = () =>
  useSelectedGenElectivesStore((state) => state.selected);

export const useSelectedGenElectivesActions = () =>
  useSelectedGenElectivesStore((state) => state.actions);
