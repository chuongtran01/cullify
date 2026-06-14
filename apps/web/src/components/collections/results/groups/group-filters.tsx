import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const GROUP_FILTER_SEARCH_PARAM = "filter";

export type GroupFilterValue = "NEEDS_SELECTION" | "SELECTED";

type GroupFiltersProps = {
  activeFilter: GroupFilterValue;
  counts?: Partial<Record<GroupFilterValue, number>>;
  onFilterChange: (filter: GroupFilterValue) => void;
};

const filters = [
  { label: "Needs Selection", value: "NEEDS_SELECTION" },
  { label: "Selected", value: "SELECTED" },
] satisfies Array<{ label: string; value: GroupFilterValue }>;

export function parseGroupFilter(value: string | null): GroupFilterValue {
  return value === "SELECTED" ? "SELECTED" : "NEEDS_SELECTION";
}

export function GroupsFilters({
  activeFilter,
  counts,
  onFilterChange,
}: GroupFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.value;
        const count = counts?.[filter.value];

        return (
          <Button
            variant="outline"
            key={filter.value}
            type="button"
            className={cn(
              "h-8 rounded-full px-3",
              isActive &&
                "border-ink bg-ink text-on-primary hover:bg-ink hover:text-on-primary",
            )}
            onClick={() => onFilterChange(filter.value)}
          >
            {filter.label}
            {count !== undefined ? (
              <span className="ml-1.5 text-xs opacity-70">{count}</span>
            ) : null}
          </Button>
        );
      })}
    </div>
  );
}
