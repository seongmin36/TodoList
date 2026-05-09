import { create } from "zustand";

export interface Tag {
  id: number;
  name: string;
  color: string | null;
}

interface TagState {
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
  addTag: (tag: Tag) => void;
  updateTag: (id: number, data: Partial<Omit<Tag, "id">>) => void;
  deleteTag: (id: number) => void;
}

export const useTagStore = create<TagState>((set) => ({
  tags: [],
  setTags: (tags) => set({ tags }),
  addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
  updateTag: (id, data) =>
    set((state) => ({
      tags: state.tags.map((t) => (t.id === id ? { ...t, ...data } : t)),
    })),
  deleteTag: (id) =>
    set((state) => ({ tags: state.tags.filter((t) => t.id !== id) })),
}));
