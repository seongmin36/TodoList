import { TodoTag } from "@/todo/components/TodoTag";

interface TodoItemProps {
  title: string;
  isDone: boolean;
  onToggle?: () => void;
  tag?: { name: string; color: string | null };
  dueDate?: string | null;
  isToday?: boolean;
  isRecurring?: boolean;
}

export function TodoItem({
  title,
  isDone,
  onToggle,
  tag,
  dueDate,
  isToday,
  isRecurring,
}: TodoItemProps) {
  return (
    <div
      onClick={onToggle}
      className={[
        "flex h-row items-center gap-3 border-[1.5px] border-todo-border rounded px-[0.844rem] py-[0.656rem] w-full cursor-pointer select-none",
        isDone ? "bg-done-bg" : "bg-white",
      ].join(" ")}
    >
      {/* 체크박스 */}
      <div
        className={[
          "shrink-0 size-4 rounded-[0.1875rem] border-2 flex items-center justify-center",
          isDone
            ? "bg-done-check border-done-check"
            : "border-done-check bg-transparent",
        ].join(" ")}
      >
        {isDone && (
          <span className="text-[0.625rem] text-white leading-none">✓</span>
        )}
      </div>

      {/* 제목 */}
      <span
        className={[
          "flex-1 text-[0.8125rem] leading-[1.21875rem] truncate",
          isDone ? "line-through text-done-text" : "text-todo-text",
        ].join(" ")}
      >
        {title}
      </span>

      {/* 반복 아이콘 */}
      {isRecurring && (
        <span className="shrink-0 text-xs text-subtext leading-[1.125rem]">
          ↻
        </span>
      )}

      {/* 태그 */}
      {tag && <TodoTag name={tag.name} color={tag.color} />}

      {/* 날짜 */}
      {(dueDate || isToday) && (
        <span
          className={[
            "shrink-0 text-[0.6875rem] leading-[1.03125rem]",
            isToday ? "font-bold text-today" : "text-subtext",
          ].join(" ")}
        >
          {isToday ? "오늘" : dueDate}
        </span>
      )}
    </div>
  );
}
