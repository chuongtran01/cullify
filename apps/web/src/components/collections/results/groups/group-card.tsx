import { PhotoSurface } from "@/components/collections/results/photo-surface";
import { Badge } from "@/components/ui/badge";
import type { CollectionGroupPreview } from "@/services/collections";

const selectionStatusLabels = {
  NEEDS_SELECTION: "Needs selection",
  SELECTED: "Selected",
} satisfies Record<CollectionGroupPreview["selectionStatus"], string>;

export function GroupCard({ group }: { group: CollectionGroupPreview }) {
  const isSelected = group.selectionStatus === "SELECTED";

  return (
    <article className="overflow-hidden rounded-lg border border-hairline-strong bg-surface-card">
      <PhotoSurface
        className="aspect-[4/3]"
        src={group.previewImage.imageUrl}
        title={group.previewImage.fileName}
      />
      <div className="grid gap-3 p-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-ink">
            {group.imageCount} photos
          </p>
          <Badge
            variant="outline"
            className={
              isSelected
                ? "h-6 rounded-full border-semantic-success/20 bg-semantic-success/10 px-2.5 text-xs text-semantic-success"
                : "h-6 rounded-full border-hairline-strong bg-surface-strong px-2.5 text-xs text-body"
            }
          >
            {selectionStatusLabels[group.selectionStatus]}
          </Badge>
        </div>
        <p className="text-xs text-body">
          {isSelected ? "Representative selected" : "Choose the best frame"}
        </p>
      </div>
    </article>
  );
}
