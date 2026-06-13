"use client";

import { notFound } from "next/navigation";

import { GroupCard } from "@/components/collections/results/groups/group-card";
import { GroupGridSkeleton } from "@/components/collections/results/groups/group-grid-skeleton";
import { GroupState } from "@/components/collections/results/groups/group-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCollectionGroups } from "@/features/collections/hooks";
import { CollectionsServiceError } from "@/services/collections";

const PAGE_SIZE = 50;

type GroupsPageProps = {
  collectionId: string;
};

export function GroupsPage({ collectionId }: GroupsPageProps) {
  const queryOptions = {
    limit: PAGE_SIZE,
    offset: 0,
  };
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    refetch,
  } = useCollectionGroups(collectionId, queryOptions);
  const groups = data?.pages.flatMap((page) => page.groups) ?? [];
  const totalGroups = data?.pages[0]?.totalSimilarGroups ?? 0;
  const isInitialPending = isPending && groups.length === 0;

  function handleLoadMore() {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    void fetchNextPage();
  }

  if (error instanceof CollectionsServiceError && error.status === 404) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <section className="flex flex-col gap-4 border-b border-hairline-strong pb-7 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold leading-tight text-ink">
            Similar Groups
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-body">
            Compare visually similar photos and choose the best frame from each
            group.
          </p>
        </div>
        <Badge className="rounded-full border-0 bg-surface-strong px-3 py-1 text-sm font-medium text-body shadow-none">
          {isInitialPending ? "Loading..." : `${totalGroups} groups`}
        </Badge>
      </section>

      {isInitialPending ? (
        <GroupGridSkeleton />
      ) : error && groups.length === 0 ? (
        <GroupState
          title="Could not load similar groups"
          description={
            error instanceof Error ? error.message : "Refresh the page and try again."
          }
          action={
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-md border-hairline-strong bg-surface-card px-4.5 text-sm font-medium text-ink"
              onClick={() => void refetch()}
            >
              Retry
            </Button>
          }
        />
      ) : groups.length === 0 ? (
        <GroupState
          title="No similar groups found"
          description="This collection does not have any similar photo groups to review."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {groups.map((group) => (
              <GroupCard group={group} key={group.id} />
            ))}
          </div>
          {error ? (
            <GroupState
              title="Could not load more similar groups"
              description={
                error instanceof Error
                  ? error.message
                  : "Try loading the next page again."
              }
              action={
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-md border-hairline-strong bg-surface-card px-4.5 text-sm font-medium text-ink"
                  onClick={() => void refetch()}
                >
                  Retry
                </Button>
              }
            />
          ) : null}
          {hasNextPage ? (
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-md border-hairline-strong bg-surface-card px-4.5 text-sm font-medium text-ink"
                disabled={isFetchingNextPage}
                onClick={handleLoadMore}
              >
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
