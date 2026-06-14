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
            key={filter.value}
            type="button"
            variant={isActive ? "default" : "ghost"}
            className={cn(
              "h-8 rounded-full px-3 text-sm font-medium",
              !isActive && "text-body hover:bg-surface-strong hover:text-ink",
            )}
            onClick={() => onFilterChange(filter.value)}
          >
            {filter.label}
            {count !== undefined ? (
              <span className={cn(isActive ? "text-on-primary/70" : "text-muted")}>
                {count}
              </span>
            ) : null}
          </Button>
        );
      })}
    </div>
  );
}
