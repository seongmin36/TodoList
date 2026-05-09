import { useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes";
import { TodoAppHeader, ProfileAvatarLink } from "@/todo/components/TodoAppHeader";
import { TagManager } from "@/todo/components/TagManager";
import { TodoModal } from "@/todo/components/TodoModal";
import { DateRangeFilter } from "@/todo/components/DateRangeFilter";
import { FilterTabBar, type FilterType, type TabItem } from "@/todo/components/FilterTabBar";
import { SearchInput } from "@/todo/components/SearchInput";
import { TodoItem } from "@/todo/components/TodoItem";
import { useTodoModalStore } from "@/todo/stores/todoModalStore";
import { useTagStore } from "@/todo/stores/tagStore";
import { useTodos } from "@/todo/hooks/useTodos";
import { tagsApi } from "@/lib/api/tags";

interface FilterState {
  activeTab: FilterType;
  search: string;
  startDate: string;
  endDate: string;
}

type FilterAction =
  | { type: "SET_TAB"; tab: FilterType }
  | { type: "SET_SEARCH"; search: string }
  | { type: "SET_START_DATE"; date: string }
  | { type: "SET_END_DATE"; date: string }
  | { type: "RESET_DATES" }
  | { type: "RESET_ALL" };

const initialFilter: FilterState = {
  activeTab: "all",
  search: "",
  startDate: "",
  endDate: "",
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_TAB":
      return { ...state, activeTab: action.tab };
    case "SET_SEARCH":
      return { ...state, search: action.search };
    case "SET_START_DATE":
      return { ...state, startDate: action.date };
    case "SET_END_DATE":
      return { ...state, endDate: action.date };
    case "RESET_DATES":
      return { ...state, startDate: "", endDate: "" };
    case "RESET_ALL":
      return initialFilter;
  }
}

export default function TodoPage() {
  const [filter, dispatch] = useReducer(filterReducer, initialFilter);
  const openCreate = useTodoModalStore((s) => s.openCreate);
  const setTags = useTagStore((s) => s.setTags);
  const { todos, isLoading, fetchTodos, toggle } = useTodos();

  useEffect(() => {
    void fetchTodos(filter.activeTab, filter.startDate, filter.endDate);
  }, [filter.activeTab, filter.startDate, filter.endDate, fetchTodos]);

  useEffect(() => {
    tagsApi.getAll().then(setTags).catch(() => {});
  }, [setTags]);

  const filteredTodos = filter.search
    ? todos.filter((t) =>
        t.title.toLowerCase().includes(filter.search.toLowerCase()),
      )
    : todos;

  const tabs: TabItem[] = [
    { id: "all", label: "전체", count: todos.length },
    { id: "incomplete", label: "미완료", count: todos.filter((t) => !t.isDone).length },
    { id: "complete", label: "완료", count: todos.filter((t) => t.isDone).length },
    { id: "recurring", label: "반복", count: 0 },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full">
        <TodoAppHeader
          edge="subtle"
          trailing={
            <div className="flex items-center gap-3">
              <Link
                to={ROUTES.TRASH}
                className="h-8 px-3.5 inline-flex items-center border-[1.5px] border-border-input text-[#444] text-[0.8125rem] font-bold rounded no-underline hover:opacity-85"
              >
                휴지통
              </Link>
              <button
                type="button"
                onClick={openCreate}
                className="h-8 px-3.5 bg-dark text-white text-[0.8125rem] font-bold rounded border-0 cursor-pointer"
              >
                + 새 투두
              </button>
              <ProfileAvatarLink />
            </div>
          }
        />
      </div>

      <div className="mx-auto">
        <div className="h-subheader bg-input-bg border-b-2 border-dark flex items-center justify-between">
          <FilterTabBar
            activeTab={filter.activeTab}
            tabs={tabs}
            onChange={(tab) => dispatch({ type: "SET_TAB", tab })}
          />
          <button
            type="button"
            onClick={() => dispatch({ type: "RESET_ALL" })}
            className="mr-3.5 h-7 px-3 border-[1.5px] border-border-input text-[#444] text-[0.75rem] rounded bg-transparent cursor-pointer shrink-0"
          >
            필터 초기화
          </button>
        </div>

        <div className="px-[1.125rem] py-3 border-b border-divider">
          <DateRangeFilter
            startDate={filter.startDate}
            endDate={filter.endDate}
            onStartChange={(date) => dispatch({ type: "SET_START_DATE", date })}
            onEndChange={(date) => dispatch({ type: "SET_END_DATE", date })}
            onApply={() => {}}
            onReset={() => dispatch({ type: "RESET_DATES" })}
          />
        </div>

        <div className="h-toolbar flex items-center justify-between px-[1.125rem]">
          <span className="text-[0.8125rem] text-label">
            {isLoading ? "로딩 중..." : `${filteredTodos.length}개 항목`}
          </span>
          <SearchInput
            value={filter.search}
            onChange={(search) => dispatch({ type: "SET_SEARCH", search })}
          />
        </div>

        <div className="flex flex-col gap-1.5 px-[1.125rem] py-[0.875rem]">
          {!isLoading && filteredTodos.length === 0 ? (
            <p className="text-center text-[0.8125rem] text-muted py-10">
              항목이 없습니다.
            </p>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                title={todo.title}
                isDone={todo.isDone}
                onToggle={() => void toggle(todo.id, todo.isDone)}
                tag={todo.tags[0] ?? undefined}
                dueDate={
                  todo.dueAt
                    ? new Date(todo.dueAt).toLocaleDateString("ko-KR")
                    : undefined
                }
              />
            ))
          )}
        </div>
      </div>

      <TodoModal />
      <TagManager />

      <button
        type="button"
        onClick={openCreate}
        className="fixed bottom-6 right-6 flex size-10 items-center justify-center rounded-full border-0 bg-dark text-xl font-bold text-white shadow-lg"
      >
        <span className="-translate-y-[2px] -translate-x-[1px]">+</span>
      </button>
    </div>
  );
}
