import type {
  CreateTodoInput,
  UpdateTodoInput,
  GetTodosQuery,
  UpdateTodoTagsInput,
} from "@repo/schemas";
import { apiClient } from "./client";
import type { TagResponse } from "./tags";

export interface TodoResponse {
  id: number;
  title: string;
  description: string | null;
  isDone: boolean;
  dueAt: string | null;
  tags: TagResponse[];
  createdAt: string;
  updatedAt: string;
}

export const todosApi = {
  getAll: (params?: Partial<GetTodosQuery>) =>
    apiClient.get<TodoResponse[]>("/todos", { params }).then((r) => r.data),

  getDeleted: () =>
    apiClient.get<TodoResponse[]>("/todos/deleted").then((r) => r.data),

  getOne: (id: number) =>
    apiClient.get<TodoResponse>(`/todos/${id}`).then((r) => r.data),

  create: (data: CreateTodoInput) =>
    apiClient.post<TodoResponse>("/todos", data).then((r) => r.data),

  update: (id: number, data: UpdateTodoInput) =>
    apiClient.patch<TodoResponse>(`/todos/${id}`, data).then((r) => r.data),

  remove: (id: number) =>
    apiClient.delete<void>(`/todos/${id}`).then((r) => r.data),

  restore: (id: number) =>
    apiClient.patch<TodoResponse>(`/todos/${id}/restore`).then((r) => r.data),

  updateTags: (id: number, data: UpdateTodoTagsInput) =>
    apiClient.patch<TodoResponse>(`/todos/${id}/tags`, data).then((r) => r.data),
};
