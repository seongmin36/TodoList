export interface MockDeletedTodo {
  id: number;
  title: string;
  daysLeft: number;
}

export const MOCK_DELETED_TODOS: MockDeletedTodo[] = [
  { id: 1, title: "구직 서류 제출", daysLeft: 27 },
  { id: 2, title: "영어 단어 암기", daysLeft: 23 },
  { id: 3, title: "헬스장 등록하기", daysLeft: 18 },
];
