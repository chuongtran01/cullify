import { ChevronDown, Search } from "lucide-react";

import { collectionFilters } from "@/components/collections/mock-data";
import type { CollectionFilterValue } from "@/components/collections/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type CollectionFiltersProps = {
  activeFilter: CollectionFilterValue;
  search: string;
  onFilterChange: (filter: CollectionFilterValue) => void;
  onSearchChange: (search: string) => void;
};

export function CollectionFilters({
  activeFilter,
  search,
  onFilterChange,
  onSearchChange,
}: CollectionFiltersProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-2">
        {collectionFilters.map((filter) => (
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
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <Input
            className="h-9 w-full pl-9 sm:w-64"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search collections"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="h-9 justify-between border-hairline bg-surface-card hover:bg-surface-stone"
              variant="outline"
            >
              Newest First
              <ChevronDown className="size-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-40">
            <DropdownMenuItem>Newest First</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
