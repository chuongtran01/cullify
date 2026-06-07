import { PhotoSurface } from "@/components/collections/results/photo-surface";
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
    <article className="overflow-hidden rounded-lg border border-hairline-strong bg-surface-card">
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
          <h2 className="truncate text-sm font-semibold text-ink">{image.fileName}</h2>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {image.reasons.map((reason) => (
            <Badge
              key={reason}
              className="rounded-full border-semantic-error/20 bg-semantic-error/10 px-2.5 text-semantic-error"
            >
              {reason}
            </Badge>
          ))}
        </div>
        <Button
          type="button"
          variant={image.isSelected ? "outline" : "default"}
          className={
            image.isSelected
              ? "h-10 rounded-md border-hairline-strong bg-surface-card px-4.5 text-sm font-medium text-ink"
              : "h-10 rounded-md px-4.5 text-sm font-medium"
          }
          disabled={image.isSelected || isSelecting}
          onClick={() => onSelect(image.id)}
        >
          {image.isSelected ? "Selected" : "Keep Photo"}
        </Button>
      </div>
    </article>
  );
}
