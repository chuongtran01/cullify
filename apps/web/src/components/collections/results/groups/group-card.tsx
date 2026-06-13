import Link from "next/link";

import { PhotoSurface } from "@/components/collections/results/photo-surface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CollectionGroupPreview } from "@/services/collections";

const selectionStatusLabels = {
  NEEDS_SELECTION: "Needs selection",
  SELECTED: "Selected",
} satisfies Record<CollectionGroupPreview["selectionStatus"], string>;

export function GroupCard({ group }: { group: CollectionGroupPreview }) {
  const isSelected = group.selectionStatus === "SELECTED";

  return (
    <article>
      <PhotoSurface
        className="aspect-[4/3] rounded-md"
        src={group.previewImage.imageUrl}
        title={group.previewImage.fileName}
      />
      <div className="mt-3 grid gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="rounded-full border-0 bg-surface-strong px-2.5 text-sm font-medium text-body shadow-none">
            {group.imageCount} photos
          </Badge>
          <Badge
            variant="outline"
            className={
              isSelected
                ? "rounded-full border-semantic-success/20 bg-semantic-success/10 px-2.5 text-sm font-medium text-semantic-success"
                : "rounded-full border-hairline-strong bg-surface-card px-2.5 text-sm font-medium text-body"
            }
          >
            {selectionStatusLabels[group.selectionStatus]}
          </Badge>
        </div>
        <div className="border-t border-hairline pt-3">
          <Button
            asChild
            className="h-8 w-full rounded-md px-4.5 text-sm font-medium"
          >
            <Link
              href={`/dashboard/collections/${group.collectionId}/results/groups/${group.id}`}
            >
              Choose
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
