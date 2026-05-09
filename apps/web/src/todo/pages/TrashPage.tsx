import { useState } from "react";
import { TodoAppHeader } from "../components/TodoAppHeader";
import { MOCK_DELETED_TODOS, type MockDeletedTodo } from "../mocks/trash";

export default function TrashPage() {
  const [items, setItems] = useState<MockDeletedTodo[]>(MOCK_DELETED_TODOS);

  const remove = (id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  };

  const clearAll = () => setItems([]);

  const hasItems = items.length > 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full">
        <TodoAppHeader />

        <div className="flex h-[3.25rem] items-center justify-between border-b-2 border-[#EEEEEE] px-4.5 py-3.5">
          <div className="flex min-w-0 items-center gap-1.5">
            <h1 className="m-0 shrink-0 whitespace-nowrap text-[0.9375rem] font-bold leading-[1.40625rem] text-todo-text">
              🗑 삭제된 투두
            </h1>
            <p className="m-0 truncate text-xs leading-[1.125rem] text-muted">
              (30일 이내 복원 가능)
            </p>
          </div>
          <button
            type="button"
            onClick={clearAll}
            disabled={!hasItems}
            className={
              hasItems
                ? "h-[1.875rem] shrink-0 rounded border-2 border-today bg-transparent px-3 text-xs leading-[1.125rem] text-today hover:opacity-85"
                : "h-[1.875rem] shrink-0 cursor-not-allowed rounded border-2 border-divider bg-transparent px-3 text-xs leading-[1.125rem] text-todo-border"
            }
          >
            전체 영구삭제
          </button>
        </div>

        <div className="flex flex-col gap-1.5 px-4.5 py-3.5">
          {!hasItems ? (
            <div className="flex min-h-[22.5rem] flex-col items-center justify-center gap-3.5 py-[5.75rem]">
              <div className="flex size-[6.25rem] items-center justify-center rounded-lg border-[0.09375rem] border-dashed border-todo-border">
                <span
                  className="text-[2.5rem] leading-[3.75rem] text-[#0A0A0A]"
                  aria-hidden
                >
                  🗑
                </span>
              </div>
              <p className="m-0 text-center text-lg font-bold leading-[1.6875rem] text-[#333333]">
                휴지통이 비어있습니다
              </p>
              <p className="m-0 text-center text-sm leading-[1.3125rem] text-muted">
                삭제된 항목이 없습니다
              </p>
            </div>
          ) : (
            <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
              {items.map((todo) => (
                <li
                  key={todo.id}
                  className="flex h-11 min-h-[2.75rem] items-center justify-between gap-3 rounded border-[0.09375rem] border-todo-border bg-done-bg py-2.25 px-3"
                >
                  <span className="min-w-0 flex-1 text-[0.8125rem] leading-[1.21875rem] text-muted line-through">
                    {todo.title}
                  </span>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="whitespace-nowrap text-[0.6875rem] leading-[1.03125rem] text-[#BBBBBB]">
                      삭제 {todo.daysLeft}일 전
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(todo.id)}
                      className="h-[1.65625rem] rounded border-2 border-[#27AE60] bg-transparent px-3 text-[0.6875rem] leading-[1.03125rem] text-[#27AE60] hover:opacity-85"
                    >
                      복원
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(todo.id)}
                      className="h-[1.65625rem] min-w-[3.9375rem] rounded border-2 border-today bg-transparent px-3 text-[0.6875rem] leading-[1.03125rem] text-today hover:opacity-85"
                    >
                      영구삭제
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
