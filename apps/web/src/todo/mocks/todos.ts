export interface MockTodo {
  id: number;
  title: string;
  isDone: boolean;
  tag?: { name: string; color: string };
  dueDate?: string;
  isToday?: boolean;
  isRecurring?: boolean;
}

export const MOCK_TODOS: MockTodo[] = [
  {
    id: 1,
    title: "디자인 시스템 컴포넌트 정리",
    isDone: false,
    tag: { name: "작업", color: "#4a90d9" },
    dueDate: "2025.05.15",
  },
  {
    id: 2,
    title: "오늘의 미팅 준비하기",
    isDone: false,
    tag: { name: "미팅", color: "#e67e22" },
    isToday: true,
  },
  {
    id: 3,
    title: "운동 30분",
    isDone: true,
    tag: { name: "건강", color: "#27ae60" },
    dueDate: "2025.05.07",
    isRecurring: true,
  },
  {
    id: 4,
    title: "React 19 문서 읽기",
    isDone: false,
    tag: { name: "학습", color: "#8e44ad" },
    dueDate: "2025.05.20",
  },
  {
    id: 5,
    title: "주간 회고 작성",
    isDone: false,
    dueDate: "2025.05.11",
    isRecurring: true,
  },
  {
    id: 6,
    title: "팀 코드 리뷰",
    isDone: true,
    tag: { name: "작업", color: "#4a90d9" },
    dueDate: "2025.05.06",
  },
];
