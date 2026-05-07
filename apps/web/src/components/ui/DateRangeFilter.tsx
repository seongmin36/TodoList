interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartChange: (date: string) => void;
  onEndChange: (date: string) => void;
  onApply: () => void;
  onReset: () => void;
}

export function DateRangeFilter({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  onApply,
  onReset,
}: DateRangeFilterProps) {
  return (
    <div className="flex items-center gap-4 h-[2.156rem]">
      <span className="text-xs text-label leading-[1.125rem] shrink-0">
        기간 선택:
      </span>
      <input
        type="date"
        value={startDate}
        onChange={(e) => onStartChange(e.target.value)}
        className="h-8 w-[8.125rem] border-[1.5px] border-date-active rounded px-2.5 py-1.5 text-[0.8125rem] text-todo-text bg-white outline-none"
      />
      <span className="text-[0.8125rem] text-muted shrink-0">~</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => onEndChange(e.target.value)}
        className="h-8 w-[8.125rem] border-[1.5px] border-date-active rounded px-2.5 py-1.5 text-[0.8125rem] text-todo-text bg-white outline-none"
      />
      <button
        type="button"
        onClick={onApply}
        className="h-[1.969rem] w-[3.156rem] bg-dark text-white text-[0.8125rem] font-bold rounded border-0 cursor-pointer shrink-0"
      >
        적용
      </button>
      <button
        type="button"
        onClick={onReset}
        className="h-[2.156rem] w-[4.046rem] border-[1.5px] border-border-input text-[#444] text-[0.8125rem] rounded bg-transparent cursor-pointer shrink-0"
      >
        초기화
      </button>
    </div>
  );
}
