"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  CollectionFilters,
  CollectionFiltersSkeleton,
} from "@/components/collections/listing/collection-filters";
import {
  CollectionList,
  CollectionListSkeleton,
} from "@/components/collections/listing/collection-list";
import { EmptyCollections } from "@/components/collections/listing/empty-collections";
import type { CollectionFilterValue } from "@/components/collections/types";
import { Button } from "@/components/ui/button";
import { useCollections } from "@/features/collections/hooks";

export function CollectionsPage() {
  const [activeFilter, setActiveFilter] = useState<CollectionFilterValue>("ALL");
  const [search, setSearch] = useState("");
  const { data, error, isPending } = useCollections();
  const collections = useMemo(() => data?.collections ?? [], [data?.collections]);
  const loadError = error instanceof Error ? error : null;

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
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-semibold leading-snug tracking-tight text-ink">
          Collections
        </h1>
        <Button
          asChild
          className="h-10 cursor-pointer rounded-md px-4.5 text-sm font-medium sm:self-auto"
        >
          <Link href="/dashboard/collections/new">
            New collection
          </Link>
        </Button>
      </header>

      {isPending ? (
        <section className="grid gap-4">
          <CollectionFiltersSkeleton />
          <CollectionListSkeleton rowCount={5} />
        </section>
      ) : loadError || error ? (
        <section className="rounded-lg border border-hairline-strong bg-surface-card p-8 text-center">
          <h2 className="text-lg font-semibold text-ink">
            Could not load collections
          </h2>
          <p className="mx-auto mt-2 max-w-md text-base font-normal leading-normal text-body">
            {loadError?.message ?? "Refresh the page and try again."}
          </p>
        </section>
      ) : collections.length === 0 ? (
        <EmptyCollections />
      ) : (
        <section className="grid gap-4">
          <CollectionFilters
            activeFilter={activeFilter}
            search={search}
            onFilterChange={setActiveFilter}
            onSearchChange={setSearch}
          />
          {filteredCollections.length === 0 ? (
            <section className="rounded-lg border border-hairline-strong bg-surface-card p-8 text-center">
              <h2 className="text-lg font-semibold text-ink">
                No matching collections
              </h2>
              <p className="mx-auto mt-2 max-w-md text-base font-normal leading-normal text-body">
                Try another search term or filter.
              </p>
            </section>
          ) : (
            <CollectionList collections={filteredCollections} />
          )}
        </section>
      )}
    </div>
  );
}
