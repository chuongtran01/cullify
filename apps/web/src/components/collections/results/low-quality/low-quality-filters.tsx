import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type LowQualityFilterValue = "ALL" | "NEEDS_REVIEW" | "SELECTED";

export const LOW_QUALITY_FILTER_SEARCH_PARAM = "filter";

export function parseLowQualityFilter(
  value: string | null,
): LowQualityFilterValue {
  if (value === "NEEDS_REVIEW" || value === "SELECTED") {
    return value;
  }

  return "ALL";
}

export function lowQualityFilterToIsSelected(
  filter: LowQualityFilterValue,
): boolean | undefined {
  if (filter === "SELECTED") {
    return true;
  }

  if (filter === "NEEDS_REVIEW") {
    return false;
  }

  return undefined;
}

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
        </Button>
      ))}
    </div>
  );
}
