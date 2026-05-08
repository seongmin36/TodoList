import { create } from "zustand";

interface TagManagerState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useTagManagerStore = create<TagManagerState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
