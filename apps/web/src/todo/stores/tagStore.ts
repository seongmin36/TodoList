import { create } from "zustand";

export interface Tag {
  id: number;
  name: string;
  color: string;
}

interface TagState {
  tags: Tag[];
  addTag: (tag: Omit<Tag, "id">) => void;
  updateTag: (id: number, data: Partial<Omit<Tag, "id">>) => void;
  deleteTag: (id: number) => void;
}

export const useTagStore = create<TagState>((set) => ({
  tags: [
    { id: 1, name: "업무", color: "#4a90d9" },
    { id: 2, name: "학습", color: "#27ae60" },
    { id: 3, name: "생활", color: "#e67e22" },
    { id: 4, name: "건강", color: "#8e44ad" },
  ],
  addTag: (tag) =>
    set((state) => ({
      tags: [...state.tags, { ...tag, id: Date.now() }],
    })),
  updateTag: (id, data) =>
    set((state) => ({
      tags: state.tags.map((t) => (t.id === id ? { ...t, ...data } : t)),
    })),
  deleteTag: (id) =>
    set((state) => ({
      tags: state.tags.filter((t) => t.id !== id),
    })),
}));
