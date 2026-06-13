import { PhotoSurface } from "@/components/collections/results/photo-surface";
import { Badge } from "@/components/ui/badge";
import type { CollectionSelectedImage } from "@/services/collections";

export function SelectedImageCard({ image }: { image: CollectionSelectedImage }) {
  return (
    <article>
      <PhotoSurface
        className="aspect-[4/3] rounded-md"
        src={image.imageUrl}
        title={image.fileName}
      />
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge className="rounded-full border-0 bg-surface-strong px-2.5 text-sm font-medium text-body shadow-none">
          {image.selectionLabel}
        </Badge>
      </div>
    </article>
  );
}
