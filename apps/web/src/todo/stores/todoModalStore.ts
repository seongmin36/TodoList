import { create } from "zustand";

type ModalMode = "create" | "edit";

interface TodoModalState {
  isOpen: boolean;
  mode: ModalMode;
  editingTodoId: number | null;
  openCreate: () => void;
  openEdit: (id: number) => void;
  close: () => void;
}

export const useTodoModalStore = create<TodoModalState>((set) => ({
  isOpen: false,
  mode: "create",
  editingTodoId: null,
  openCreate: () => set({ isOpen: true, mode: "create", editingTodoId: null }),
  openEdit: (id) => set({ isOpen: true, mode: "edit", editingTodoId: id }),
  close: () => set({ isOpen: false, editingTodoId: null }),
}));
