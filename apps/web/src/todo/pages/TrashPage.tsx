import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes";
import { MOCK_DELETED_TODOS, type MockDeletedTodo } from "../mocks/trash";

export default function TrashPage() {
  const [items, setItems] = useState<MockDeletedTodo[]>(MOCK_DELETED_TODOS);

  const remove = (id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  };

  const clearAll = () => setItems([]);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[800px]">
        <header className="flex h-12 items-center justify-between border-b-2 border-[#222222] px-[18px] py-[10px]">
          <Link
            to={ROUTES.TODOS}
            className="text-[17px] font-bold leading-[25.5px] tracking-[0.0588em] text-[#0A0A0A] no-underline hover:opacity-85"
          >
            ✓ TodoList
          </Link>
          <div className="flex size-7 shrink-0 items-center justify-center rounded-[14px] border-2 border-[#222222] bg-[#E0DDD8]">
            <span className="text-[11px] leading-[16.5px] text-[#222222]">
              JD
            </span>
          </div>
        </header>

        <div className="flex h-[52px] items-center justify-between border-b-2 border-[#EEEEEE] px-[18px] py-[14px]">
          <div className="flex min-w-0 items-center gap-1.5">
            <h1 className="m-0 shrink-0 whitespace-nowrap text-[15px] font-bold leading-[22.5px] text-[#111111]">
              🗑 삭제된 투두
            </h1>
            <p className="m-0 truncate text-[12px] leading-[18px] text-[#AAAAAA]">
              (30일 이내 복원 가능)
            </p>
          </div>
          <button
            type="button"
            onClick={clearAll}
            disabled={items.length === 0}
            className="h-[30px] shrink-0 rounded border-2 border-[#C0392B] bg-transparent px-3 text-[12px] leading-[18px] text-[#C0392B] hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
          >
            전체 영구삭제
          </button>
        </div>

        <div className="flex flex-col gap-[6px] px-[18px] py-[14px]">
          {items.length === 0 ? (
            <p className="py-10 text-center text-[13px] leading-[19.5px] text-[#AAAAAA]">
              삭제된 투두가 없습니다.
            </p>
          ) : (
            <ul className="m-0 flex list-none flex-col gap-[6px] p-0">
              {items.map((todo) => (
                <li
                  key={todo.id}
                  className="flex h-11 min-h-[44px] items-center justify-between gap-3 rounded border-[1.5px] border-[#CCCCCC] bg-[#F7F6F4] py-[9px] pl-3 pr-3"
                >
                  <span className="min-w-0 flex-1 text-[13px] leading-[19.5px] text-[#AAAAAA] line-through">
                    {todo.title}
                  </span>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="whitespace-nowrap text-[11px] leading-[16.5px] text-[#BBBBBB]">
                      삭제 {todo.daysLeft}일 전
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(todo.id)}
                      className="h-[26.5px] rounded border-2 border-[#27AE60] bg-transparent px-3 text-[11px] leading-[16.5px] text-[#27AE60] hover:opacity-85"
                    >
                      복원
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(todo.id)}
                      className="h-[26.5px] min-w-[63px] rounded border-2 border-[#C0392B] bg-transparent px-3 text-[11px] leading-[16.5px] text-[#C0392B] hover:opacity-85"
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
