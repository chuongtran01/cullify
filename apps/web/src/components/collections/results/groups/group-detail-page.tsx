"use client";

import { notFound } from "next/navigation";

import { GroupDetailSkeleton } from "@/components/collections/results/groups/group-detail-skeleton";
import { GroupState } from "@/components/collections/results/groups/group-state";
import { PhotoSurface } from "@/components/collections/results/photo-surface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useCollectionGroup,
  useUpdateCollectionGroupSelection,
} from "@/features/collections/hooks";
import type { CollectionGroupImage } from "@/services/collections";
import { CollectionsServiceError } from "@/services/collections";

type GroupDetailPageProps = {
  collectionId: string;
  groupId: string;
};

export function GroupDetailPage({
  collectionId,
  groupId,
}: GroupDetailPageProps) {
  const { data: group, error, isPending, refetch } = useCollectionGroup(
    collectionId,
    groupId,
  );
  const updateSelection = useUpdateCollectionGroupSelection(collectionId, groupId);

  if (error instanceof CollectionsServiceError && error.status === 404) {
    notFound();
  }

  if (isPending) {
    return <GroupDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <GroupState
          title="Could not load this group"
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
      </div>
    );
  }

  if (!group || group.images.length === 0) {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <GroupState
          title="No photos in this group"
          description="This similar group does not have any photos to display."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <section className="flex flex-col gap-4 rounded-lg border border-hairline-strong bg-surface-card p-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-body">
            Similar group
          </p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight text-ink">
            Group photos
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-body">
            View every photo in this similar set before choosing a representative.
          </p>
        </div>
        <Badge
          variant="outline"
          className="h-8 w-fit rounded-full px-3 text-sm text-body"
        >
          {group.imageCount} photos
        </Badge>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {group.images.map((image) => (
          <GroupPhotoCard
            key={image.id}
            image={image}
            isSelecting={
              updateSelection.isPending &&
              updateSelection.variables?.imageId === image.id
            }
            isUpdating={updateSelection.isPending}
            onSelect={(imageId) => updateSelection.mutate({ imageId })}
            onUnselect={() => updateSelection.mutate({ imageId: null })}
          />
        ))}
      </div>
      {updateSelection.error ? (
        <p className="text-center text-sm text-semantic-error">
          {updateSelection.error instanceof Error
            ? updateSelection.error.message
            : "Could not update group selection."}
        </p>
      ) : null}
    </div>
  );
}

function GroupPhotoCard({
  image,
  isSelecting,
  isUpdating,
  onSelect,
  onUnselect,
}: {
  image: CollectionGroupImage;
  isSelecting: boolean;
  isUpdating: boolean;
  onSelect: (imageId: string) => void;
  onUnselect: () => void;
}) {
  const isUpdatingSelectedImage = image.isSelected && isUpdating;

  return (
    <article className="overflow-hidden rounded-lg border border-hairline-strong bg-surface-card">
      <div className="relative">
        <PhotoSurface
          className="aspect-[4/3]"
          src={image.imageUrl}
          title={image.fileName}
        />
        {image.isSelected ? (
          <Badge className="absolute right-3 top-3 h-7 rounded-full bg-primary px-3 text-xs text-on-primary">
            Selected
          </Badge>
        ) : null}
      </div>
      <div className="flex justify-end p-3">
        <Button
          type="button"
          variant={image.isSelected ? "secondary" : "default"}
          className="h-9 rounded-md px-3 text-sm"
          disabled={isUpdating}
          onClick={() => {
            if (image.isSelected) {
              onUnselect();
              return;
            }

            onSelect(image.id);
          }}
        >
          {isUpdatingSelectedImage
            ? "Updating..."
            : image.isSelected
              ? "Unselect"
              : isSelecting
                ? "Selecting..."
                : "Select Photo"}
        </Button>
      </div>
    </article>
  );
}
