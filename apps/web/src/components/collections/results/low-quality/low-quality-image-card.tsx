import { PhotoSurface } from "@/components/collections/results/photo-surface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CollectionLowQualityImage } from "@/services/collections";
import { cn } from "@/lib/utils";

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
    <article>
      <div className="relative">
        <PhotoSurface
          className="aspect-[4/3] rounded-md"
          src={image.imageUrl}
          title={image.fileName}
        />
        {image.isSelected ? (
          <Badge className="absolute left-3 top-3 rounded-full bg-primary px-3 text-on-primary">
            Selected
          </Badge>
        ) : null}
      </div>
      <div className="mt-3 grid gap-3">
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
        <div className="border-t border-hairline pt-3">
          <Button
            type="button"
            variant={image.isSelected ? "outline" : "default"}
            className={cn("cursor-pointer",
              image.isSelected
                ? "h-8 w-full rounded-md border-hairline-strong bg-surface-card px-4.5 text-sm font-medium text-ink"
                : "h-8 w-full rounded-md px-4.5 text-sm font-medium"
            )}
            disabled={image.isSelected || isSelecting}
            onClick={() => onSelect(image.id)}
          >
            {image.isSelected ? "Selected" : "Keep"}
          </Button>
        </div>
      </div>
    </article>
  );
}
