import type { CreateTagInput, UpdateTagInput } from "@repo/schemas";
import { apiClient } from "./client";

export interface TagResponse {
  id: number;
  name: string;
  color: string | null;
  createdAt: string;
  updatedAt: string;
}

export const tagsApi = {
  getAll: () =>
    apiClient.get<TagResponse[]>("/tags").then((r) => r.data),

  create: (data: CreateTagInput) =>
    apiClient.post<TagResponse>("/tags", data).then((r) => r.data),

  update: (id: number, data: UpdateTagInput) =>
    apiClient.patch<TagResponse>(`/tags/${id}`, data).then((r) => r.data),

  remove: (id: number) =>
    apiClient.delete<void>(`/tags/${id}`).then((r) => r.data),
};
