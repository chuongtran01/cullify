"use client";

import { notFound } from "next/navigation";

import { GroupCard } from "@/components/collections/results/groups/group-card";
import { GroupGridSkeleton } from "@/components/collections/results/groups/group-grid-skeleton";
import { GroupState } from "@/components/collections/results/groups/group-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCollectionGroups } from "@/features/collections/hooks";
import { CollectionsServiceError } from "@/services/collections";

type GroupsPageProps = {
  collectionId: string;
};

export function GroupsPage({ collectionId }: GroupsPageProps) {
  const { data, error, isPending, refetch } = useCollectionGroups(collectionId);
  const groups = data?.groups ?? [];
  const totalGroups = data?.totalSimilarGroups ?? 0;

  if (error instanceof CollectionsServiceError && error.status === 404) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <section className="flex flex-col gap-4 rounded-lg border border-hairline-strong bg-surface-card p-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-body">
            Similar groups
          </p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight text-ink">
            Review similar photos
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-body">
            Compare each set and choose the frame that should represent the group.
          </p>
        </div>
        <Badge
          variant="outline"
          className="h-8 w-fit rounded-full px-3 text-sm text-body"
        >
          {isPending ? "Loading" : `${totalGroups} groups`}
        </Badge>
      </section>

      {isPending ? (
        <GroupGridSkeleton />
      ) : error ? (
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
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => (
            <GroupCard group={group} key={group.id} />
          ))}
        </div>
      )}
    </div>
  );
}
