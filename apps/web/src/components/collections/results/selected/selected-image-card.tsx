import { PhotoSurface } from "@/components/collections/results/photo-surface";
import { Badge } from "@/components/ui/badge";
import type { CollectionSelectedImage } from "@/services/collections";

export function SelectedImageCard({ image }: { image: CollectionSelectedImage }) {
  return (
    <article className="overflow-hidden rounded-lg border border-hairline-strong bg-surface-card">
      <div className="relative">
        <PhotoSurface
          className="aspect-[4/3]"
          src={image.imageUrl}
          title={image.fileName}
        />
        <Badge className="absolute left-3 top-3 h-7 rounded-full bg-primary px-3 text-xs text-on-primary">
          {image.selectionLabel}
        </Badge>
      </div>
    </article>
  );
}
