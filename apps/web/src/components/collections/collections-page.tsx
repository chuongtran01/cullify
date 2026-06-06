"use client";

import { CirclePlus } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  CollectionFilters,
  CollectionFiltersSkeleton,
} from "@/components/collections/collection-filters";
import {
  CollectionList,
  CollectionListSkeleton,
} from "@/components/collections/collection-list";
import {
  CollectionsSummary,
  CollectionsSummarySkeleton,
} from "@/components/collections/collections-summary";
import { EmptyCollections } from "@/components/collections/empty-collections";
import type { CollectionFilterValue } from "@/components/collections/types";
import { Button } from "@/components/ui/button";
import { useCollections, useCollectionsSummary } from "@/features/collections/hooks";

const emptySummary = {
  totalCollections: 0,
  needsReview: 0,
  processing: 0,
  totalPhotos: 0,
};

export function CollectionsPage() {
  const [activeFilter, setActiveFilter] = useState<CollectionFilterValue>("ALL");
  const [search, setSearch] = useState("");
  const { data, error, isPending } = useCollections();
  const {
    data: summary = emptySummary,
    error: summaryError,
    isPending: isSummaryPending,
  } = useCollectionsSummary();
  const collections = useMemo(() => data?.collections ?? [], [data?.collections]);
  const loadError =
    error instanceof Error
      ? error
      : summaryError instanceof Error
        ? summaryError
        : null;

  const filteredCollections = useMemo(() => {
    return collections
      .filter((collection) => {
        const matchesFilter =
          activeFilter === "ALL" || collection.status === activeFilter;
        const matchesSearch = collection.name
          .toLowerCase()
          .includes(search.trim().toLowerCase());

        return matchesFilter && matchesSearch;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [activeFilter, collections, search]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-normal leading-tight text-ink">
          Collections
        </h1>
        <Button
          asChild
          className="cursor-pointer px-6 sm:self-auto"
        >
          <Link href="/dashboard/collections/new">
            New collection
          </Link>
        </Button>
      </header>

      {isPending || isSummaryPending ? (
        <>
          <CollectionsSummarySkeleton />
          <section className="grid gap-4">
            <CollectionFiltersSkeleton />
            <CollectionListSkeleton rowCount={5} />
          </section>
        </>
      ) : loadError || error || summaryError ? (
        <section className="rounded-md border border-hairline-light bg-surface-card p-8 text-center">
          <h2 className="text-lg font-normal text-ink">
            Could not load collections
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-body">
            {loadError?.message ?? "Refresh the page and try again."}
          </p>
        </section>
      ) : summary.totalCollections === 0 ? (
        <EmptyCollections />
      ) : (
        <>
          <CollectionsSummary {...summary} />
          <section className="grid gap-4">
            <CollectionFilters
              activeFilter={activeFilter}
              search={search}
              onFilterChange={setActiveFilter}
              onSearchChange={setSearch}
            />
            {filteredCollections.length === 0 ? (
              <section className="rounded-md border border-hairline-light bg-surface-card p-8 text-center">
                <h2 className="text-lg font-normal text-ink">
                  No matching collections
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-body">
                  {collections.length === 0
                    ? "No collection rows are available yet."
                    : "Try another search term or filter."}
                </p>
              </section>
            ) : (
              <CollectionList collections={filteredCollections} />
            )}
          </section>
        </>
      )}
    </div>
  );
}
