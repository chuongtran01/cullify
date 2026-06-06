import { PhotoSurface } from "@/components/results/photo-surface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CollectionLowQualityImage } from "@/services/collections";

type LowQualityImageCardProps = {
  image: CollectionLowQualityImage;
  isSelecting: boolean;
  onSelect: (imageId: string) => void;
};

export function LowQualityImageCard({
  image,
  isSelecting,
  onSelect,
}: LowQualityImageCardProps) {
  return (
    <article className="overflow-hidden rounded-md border border-hairline bg-surface-card">
      <div className="relative">
        <PhotoSurface
          className="aspect-[4/3]"
          src={image.imageUrl}
          title={image.fileName}
        />
        {image.isSelected ? (
          <Badge className="absolute top-3 left-3 rounded-full bg-primary px-3 text-on-primary">
            Selected
          </Badge>
        ) : null}
      </div>
      <div className="grid gap-3 p-3">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-medium text-ink">{image.fileName}</h2>
          <p className="mt-1 text-xs text-muted">Flagged for review</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {image.reasons.map((reason) => (
            <Badge
              key={reason}
              className="rounded-full border-coral-soft bg-coral/90 px-2.5 text-white"
            >
              {reason}
            </Badge>
          ))}
        </div>
        <Button
          type="button"
          variant={image.isSelected ? "outline" : "default"}
          disabled={image.isSelected || isSelecting}
          onClick={() => onSelect(image.id)}
        >
          {image.isSelected ? "Selected" : "Keep Photo"}
        </Button>
      </div>
    </article>
  );
}
