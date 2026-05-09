import { useState } from "react";
import { useTagManagerStore } from "@/todo/stores/tagManagerStore";
import { useTagStore } from "@/todo/stores/tagStore";
import { useTodoModalStore } from "@/todo/stores/todoModalStore";
import { TodoTag } from "@/todo/components/TodoTag";

const RECURRING_OPTIONS = ["없음", "매일", "매주", "매월"];

interface FormState {
  title: string;
  description: string;
  dueDate: string;
  recurring: string;
  selectedTags: string[];
}

const initialForm: FormState = {
  title: "",
  description: "",
  dueDate: "",
  recurring: "없음",
  selectedTags: [],
};

export function TodoModal() {
  const { isOpen, mode, close } = useTodoModalStore();
  const tags = useTagStore((s) => s.tags);
  const openTagManager = useTagManagerStore((s) => s.open);
  const [form, setForm] = useState<FormState>(initialForm);

  if (!isOpen) return null;

  const toggleTag = (tagName: string) => {
    setForm((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tagName)
        ? prev.selectedTags.filter((t) => t !== tagName)
        : [...prev.selectedTags, tagName],
    }));
  };

  const handleClose = () => {
    setForm(initialForm);
    close();
  };

  const handleSave = () => {
    // TODO: 저장 로직 (API 연동 시 구현)
    handleClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(200, 198, 195, 0.5)" }}
      onClick={handleClose}
    >
      <div
        className="w-[28.75rem] rounded-lg border-[2.5px] border-dark bg-white"
        style={{ boxShadow: "6px 6px 0px #ccc" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-4 p-[1.656rem]">
          {/* 모달 제목 */}
          <h2 className="text-[1.0625rem] font-bold text-dark">
            {mode === "create" ? "새 투두" : "투두 수정"}
          </h2>

          {/* 제목 입력 */}
          <div className="flex flex-col gap-0.5">
            <label className="text-[0.75rem] text-label">제목</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="투두 제목을 입력하세요"
              className="h-control-lg rounded border-2 border-dark bg-white px-3 text-[0.8125rem] text-dark outline-none placeholder:text-placeholder"
              autoFocus
            />
          </div>

          {/* 메모 */}
          <div className="flex flex-col gap-0.5">
            <label className="text-[0.75rem] text-label">메모</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="메모를 입력하세요"
              className="h-14 resize-none rounded border-[1.5px] border-border-input bg-white px-3 py-2 text-[0.8125rem] text-dark outline-none placeholder:text-placeholder"
            />
          </div>

          {/* 마감일 + 반복 */}
          <div className="flex gap-2.5">
            <div className="flex flex-1 flex-col gap-0.5">
              <label className="text-[0.75rem] text-label">마감일</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, dueDate: e.target.value }))
                }
                className="h-control rounded border-[1.5px] border-border-input bg-white px-2.5 text-[0.8125rem] text-dark outline-none"
              />
            </div>
            <div className="flex flex-1 flex-col gap-0.5">
              <label className="text-[0.75rem] text-label">반복</label>
              <select
                value={form.recurring}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, recurring: e.target.value }))
                }
                className="h-control cursor-pointer rounded border-[1.5px] border-border-input bg-white px-2.5 text-[0.8125rem] text-dark outline-none"
              >
                {RECURRING_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 태그 선택 */}
          <div className="flex flex-col gap-0.5">
            <label className="text-[0.75rem] text-label">태그</label>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <button
                  key={tag.name}
                  type="button"
                  onClick={() => toggleTag(tag.name)}
                  className={[
                    "border-0 bg-transparent p-0 cursor-pointer transition-opacity",
                    form.selectedTags.includes(tag.name)
                      ? "opacity-100"
                      : "opacity-35",
                  ].join(" ")}
                >
                  <TodoTag name={tag.name} color={tag.color} />
                </button>
              ))}
              <button
                type="button"
                onClick={openTagManager}
                className="inline-flex h-tag cursor-pointer items-center rounded-[0.625rem] border-[1.5px] border-dashed border-[#999] bg-transparent px-[0.4375rem] text-[0.6875rem] text-[#999]"
              >
                + 태그 추가
              </button>
            </div>
          </div>

          {/* 취소 / 저장 */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="h-control-xl w-[4.0125rem] cursor-pointer rounded border-2 border-border-input bg-transparent text-[0.8125rem] text-[#444]"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="h-control-xl w-[4.0125rem] cursor-pointer rounded border-2 border-dark bg-dark text-[0.8125rem] font-bold text-white"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
