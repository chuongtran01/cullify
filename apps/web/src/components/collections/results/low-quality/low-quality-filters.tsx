import { cn } from "@/lib/utils";

export type LowQualityFilterValue = "ALL" | "NEEDS_REVIEW" | "SELECTED";

const lowQualityFilters: Array<{
  label: string;
  value: LowQualityFilterValue;
}> = [
  { label: "All", value: "ALL" },
  { label: "Needs Review", value: "NEEDS_REVIEW" },
  { label: "Selected", value: "SELECTED" },
];

type LowQualityFiltersProps = {
  activeFilter: LowQualityFilterValue;
  onFilterChange: (filter: LowQualityFilterValue) => void;
};

export function LowQualityFilters({
  activeFilter,
  onFilterChange,
}: LowQualityFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {lowQualityFilters.map((filter) => (
        <button
          key={filter.value}
          className={cn(
            "h-8 rounded-full border border-hairline-light px-3 text-sm font-medium text-body transition-colors hover:border-ink hover:text-ink",
            activeFilter === filter.value &&
              "border-ink bg-ink text-on-primary hover:text-on-primary",
          )}
          onClick={() => onFilterChange(filter.value)}
          type="button"
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
