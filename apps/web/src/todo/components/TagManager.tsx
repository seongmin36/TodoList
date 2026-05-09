import { useState } from "react";
import { useTagManagerStore } from "@/todo/stores/tagManagerStore";
import { useTagStore, type Tag } from "@/todo/stores/tagStore";

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

interface EditingState {
  id: number;
  name: string;
  color: string;
}

export function TagManager() {
  const { isOpen, close } = useTagManagerStore();
  const { tags, addTag, updateTag, deleteTag } = useTagStore();

  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#4a90d9");
  const [editing, setEditing] = useState<EditingState | null>(null);

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!newName.trim()) return;
    addTag({ name: newName.trim(), color: newColor });
    setNewName("");
    setNewColor("#4a90d9");
  };

  const handleEditSave = () => {
    if (!editing || !editing.name.trim()) return;
    updateTag(editing.id, { name: editing.name.trim(), color: editing.color });
    setEditing(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(200, 198, 195, 0.5)" }}
      onClick={close}
    >
      <div
        className="w-[43.75rem] rounded-lg border-[2.5px] border-dark bg-white"
        style={{ boxShadow: "6px 6px 0px #ccc" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex h-12 items-center justify-between border-b-2 border-dark px-[1.125rem]">
          <span className="text-[0.9375rem] font-bold text-[#111]">
            태그 관리
          </span>
          <button
            type="button"
            onClick={() => {}}
            className="h-[1.875rem] cursor-pointer rounded border-2 border-dark bg-dark px-3 text-[0.75rem] font-bold text-white"
          >
            + 새 태그
          </button>
        </div>

        <div className="p-[1.125rem] flex flex-col gap-3">
          {/* 태그 목록 */}
          <div className="flex flex-col gap-2">
            {tags.map((tag: Tag) =>
              editing?.id === tag.id ? (
                /* 인라인 수정 폼 */
                <div
                  key={tag.id}
                  className="flex h-[2.75rem] items-center gap-2 rounded border-[1.5px] border-dark px-[0.844rem]"
                >
                  <input
                    type="text"
                    value={editing.name}
                    onChange={(e) =>
                      setEditing((prev) =>
                        prev ? { ...prev, name: e.target.value } : prev
                      )
                    }
                    className="flex-1 rounded border-[1.5px] border-border-input bg-input-bg px-2 py-1 text-[0.875rem] text-dark outline-none"
                    autoFocus
                  />
                  <input
                    type="color"
                    value={editing.color}
                    onChange={(e) =>
                      setEditing((prev) =>
                        prev ? { ...prev, color: e.target.value } : prev
                      )
                    }
                    className="h-6 w-10 cursor-pointer rounded border-[1.5px] border-border-input"
                  />
                  <button
                    type="button"
                    onClick={handleEditSave}
                    className="cursor-pointer text-[0.8125rem] text-dark font-bold"
                  >
                    저장
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="cursor-pointer text-[0.8125rem] text-muted"
                  >
                    취소
                  </button>
                </div>
              ) : (
                /* 태그 행 */
                <div
                  key={tag.id}
                  className="flex h-[2.75rem] items-center gap-3 rounded border-[1.5px] border-todo-border px-[0.844rem]"
                >
                  {/* 색상 점 */}
                  <div
                    className="size-3.5 shrink-0 rounded-[0.4375rem] border-2"
                    style={{
                      borderColor: tag.color,
                      backgroundColor: hexToRgba(tag.color, 0.2),
                    }}
                  />
                  {/* 태그명 */}
                  <span className="flex-1 text-[0.875rem] text-[#111]">
                    {tag.name}
                  </span>
                  {/* hex 코드 */}
                  <span className="text-[0.6875rem] text-muted">
                    {tag.color}
                  </span>
                  {/* 액션 */}
                  <button
                    type="button"
                    onClick={() =>
                      setEditing({ id: tag.id, name: tag.name, color: tag.color })
                    }
                    className="cursor-pointer border-0 bg-transparent text-[0.8125rem] text-muted"
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTag(tag.id)}
                    className="cursor-pointer border-0 bg-transparent text-[0.8125rem] text-today"
                  >
                    삭제
                  </button>
                </div>
              )
            )}
          </div>

          {/* 새 태그 추가 폼 */}
          <div className="rounded border-[1.5px] border-dashed border-[#bbb] bg-[#f9f8f6] p-[1.094rem]">
            <p className="mb-2 text-[0.6875rem] uppercase tracking-[0.0625rem] text-subtext">
              새 태그 추가
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder="태그 이름"
                className="h-9 flex-1 rounded border-[1.5px] border-border-input bg-input-bg px-2.5 text-[0.8125rem] text-dark outline-none placeholder:text-placeholder"
              />
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="h-9 w-20 cursor-pointer rounded border-[1.5px] border-border-input bg-input-bg"
              />
              <button
                type="button"
                onClick={handleAdd}
                className="h-9 w-[3.906rem] cursor-pointer rounded border-2 border-dark bg-dark text-[0.8125rem] font-bold text-white"
              >
                추가
              </button>
            </div>
          </div>

          {/* 닫기 */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={close}
              className="h-9 px-5 cursor-pointer rounded border-2 border-border-input bg-transparent text-[0.8125rem] text-[#444]"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
