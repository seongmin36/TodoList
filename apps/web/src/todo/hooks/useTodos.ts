import { useState, useCallback } from "react";
import { todosApi, type TodoResponse } from "@/lib/api/todos";
import type { GetTodosQuery } from "@repo/schemas";
import type { FilterType } from "@/todo/components/FilterTabBar";

function buildParams(
  activeTab: FilterType,
  startDate: string,
  endDate: string,
): Partial<GetTodosQuery> {
  const params: Partial<GetTodosQuery> = {};
  if (activeTab === "incomplete") params.isDone = false;
  if (activeTab === "complete") params.isDone = true;
  if (activeTab === "recurring") params.onlyRecurring = true;
  if (startDate) params.dueFrom = startDate;
  if (endDate) params.dueTo = endDate;
  return params;
}

export function useTodos() {
  const [todos, setTodos] = useState<TodoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTodos = useCallback(
    async (activeTab: FilterType, startDate: string, endDate: string) => {
      setIsLoading(true);
      try {
        const data = await todosApi.getAll(
          buildParams(activeTab, startDate, endDate),
        );
        setTodos(data);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const toggle = useCallback(async (id: number, currentIsDone: boolean) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isDone: !currentIsDone } : t)),
    );
    try {
      await todosApi.update(id, { isDone: !currentIsDone });
    } catch {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isDone: currentIsDone } : t)),
      );
    }
  }, []);

  const remove = useCallback(async (id: number) => {
    const snapshot = todos.find((t) => t.id === id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
    try {
      await todosApi.remove(id);
    } catch {
      if (snapshot) setTodos((prev) => [...prev, snapshot]);
    }
  }, [todos]);

  const addTodo = useCallback((todo: TodoResponse) => {
    setTodos((prev) => [todo, ...prev]);
  }, []);

  return { todos, isLoading, fetchTodos, toggle, remove, addTodo };
}
