import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type LowQualityFilterValue = "NEEDS_REVIEW" | "SELECTED";

export const LOW_QUALITY_FILTER_SEARCH_PARAM = "filter";

export function parseLowQualityFilter(
  value: string | null,
): LowQualityFilterValue {
  if (value === "SELECTED") {
    return "SELECTED";
  }

  return "NEEDS_REVIEW";
}

export function lowQualityFilterToIsSelected(
  filter: LowQualityFilterValue,
): boolean {
  return filter === "SELECTED";
}

const lowQualityFilters: Array<{
  label: string;
  value: LowQualityFilterValue;
}> = [
  { label: "Needs Review", value: "NEEDS_REVIEW" },
  { label: "Selected", value: "SELECTED" },
];

type LowQualityFiltersProps = {
  activeFilter: LowQualityFilterValue;
  counts?: Partial<Record<LowQualityFilterValue, number>>;
  onFilterChange: (filter: LowQualityFilterValue) => void;
};

export function LowQualityFilters({
  activeFilter,
  counts,
  onFilterChange,
}: LowQualityFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {lowQualityFilters.map((filter) => (
        <Button
          variant="outline"
          key={filter.value}
          className={cn(
            "h-8 rounded-full px-3",
            activeFilter === filter.value &&
              "border-ink bg-ink text-on-primary hover:bg-ink hover:text-on-primary",
          )}
          onClick={() => onFilterChange(filter.value)}
          type="button"
        >
          {filter.label}
          {counts?.[filter.value] !== undefined ? (
            <span className="ml-1.5 text-xs opacity-70">
              {counts[filter.value]}
            </span>
          ) : null}
        </Button>
      ))}
    </div>
  );
}
