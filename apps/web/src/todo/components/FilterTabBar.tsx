export type FilterType = "all" | "incomplete" | "complete" | "recurring";

export interface TabItem {
  id: FilterType;
  label: string;
  count: number;
}

interface FilterTabBarProps {
  activeTab: FilterType;
  tabs: TabItem[];
  onChange: (tab: FilterType) => void;
}

export function FilterTabBar({ activeTab, tabs, onChange }: FilterTabBarProps) {
  return (
    <div className="flex items-center">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className="flex h-control items-center gap-2 px-[0.875rem] py-2 cursor-pointer border-0 bg-transparent"
          >
            <span
              className={[
                "text-[0.9375rem] leading-[1.40625rem]",
                isActive ? "font-bold text-dark" : "font-normal text-tab-inactive",
              ].join(" ")}
            >
              {tab.label}
            </span>
            <span
              className={[
                "h-badge min-w-badge px-1 rounded-[0.625rem] text-[0.625rem] font-bold flex items-center justify-center",
                isActive ? "bg-dark text-white" : "bg-divider text-tab-inactive",
              ].join(" ")}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
