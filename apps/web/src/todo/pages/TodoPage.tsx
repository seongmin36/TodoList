import { useReducer, useState } from "react";
import { TodoModal } from "../components/TodoModal";
import { DateRangeFilter } from "../components/DateRangeFilter";
import {
  FilterTabBar,
  type FilterType,
  type TabItem,
} from "../components/FilterTabBar";
import { SearchInput } from "../components/SearchInput";
import { TodoItem } from "../components/TodoItem";
import { MOCK_TODOS, type MockTodo } from "../mocks/todos";
import { useTodoModalStore } from "../stores/todoModalStore";

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
  const [todos, setTodos] = useState<MockTodo[]>(MOCK_TODOS);
  const [filter, dispatch] = useReducer(filterReducer, initialFilter);
  const openCreate = useTodoModalStore((s) => s.openCreate);

  const filteredTodos = todos.filter((todo) => {
    if (filter.activeTab === "incomplete" && todo.isDone) return false;
    if (filter.activeTab === "complete" && !todo.isDone) return false;
    if (filter.activeTab === "recurring" && !todo.isRecurring) return false;
    if (
      filter.search &&
      !todo.title.toLowerCase().includes(filter.search.toLowerCase())
    )
      return false;
    return true;
  });

  const tabs: TabItem[] = [
    { id: "all", label: "전체", count: todos.length },
    {
      id: "incomplete",
      label: "미완료",
      count: todos.filter((t) => !t.isDone).length,
    },
    {
      id: "complete",
      label: "완료",
      count: todos.filter((t) => t.isDone).length,
    },
    {
      id: "recurring",
      label: "반복",
      count: todos.filter((t) => t.isRecurring).length,
    },
  ];

  const handleToggle = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isDone: !t.isDone } : t)),
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="h-12 flex items-center justify-between px-6 border-b border-divider">
        <span className="text-[1.0625rem] font-bold text-dark">✓ TodoList</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openCreate}
            className="h-[2.0625rem] px-3.5 bg-dark text-white text-[0.8125rem] font-bold rounded border-0 cursor-pointer"
          >
            + 새 투두
          </button>
          <div className="size-7 rounded-full bg-[#d0d0d0]" />
        </div>
      </header>

      {/* 페이지 컨텐츠 */}
      <div className="w-[60rem] mx-auto">
        {/* 필터 탭 바 */}
        <div className="h-[2.531rem] bg-input-bg border-b-2 border-dark flex items-center justify-between">
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

        {/* 날짜 범위 필터 */}
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

        {/* 툴바 */}
        <div className="h-[3.031rem] flex items-center justify-between px-[1.125rem]">
          <span className="text-[0.8125rem] text-label">
            {filteredTodos.length}개 항목
          </span>
          <SearchInput
            value={filter.search}
            onChange={(search) => dispatch({ type: "SET_SEARCH", search })}
          />
        </div>

        {/* 투두 목록 */}
        <div className="flex flex-col gap-1.5 px-[1.125rem] py-[0.875rem]">
          {filteredTodos.length === 0 ? (
            <p className="text-center text-[0.8125rem] text-muted py-10">
              항목이 없습니다.
            </p>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                title={todo.title}
                isDone={todo.isDone}
                onToggle={() => handleToggle(todo.id)}
                tag={todo.tag}
                dueDate={todo.dueDate}
                isToday={todo.isToday}
                isRecurring={todo.isRecurring}
              />
            ))
          )}
        </div>
      </div>

      <TodoModal />

      {/* 플로팅 버튼 */}
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
