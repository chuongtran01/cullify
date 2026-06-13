import { useState } from "react";

import { PhotoSurface } from "@/components/collections/results/photo-surface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CollectionLowQualityImage } from "@/services/collections";

type LowQualityImageCardProps = {
  image: CollectionLowQualityImage;
  isUpdating: boolean;
  onRemove: (imageId: string) => void;
  onSelect: (imageId: string) => void;
};

export function LowQualityImageCard({
  image,
  isUpdating,
  onRemove,
  onSelect,
}: LowQualityImageCardProps) {
  const [isConfirmingRemove, setIsConfirmingRemove] = useState(false);
  const isShowingRemoveConfirmation = image.isSelected && isConfirmingRemove;

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
          {isShowingRemoveConfirmation ? (
            <div className="grid gap-2">
              <p className="text-sm text-body">Remove from selected?</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-8 rounded-md border-hairline-strong bg-surface-card px-4.5 text-sm font-medium text-ink"
                  disabled={isUpdating}
                  onClick={() => setIsConfirmingRemove(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="h-8 rounded-md px-4.5 text-sm font-medium"
                  disabled={isUpdating}
                  onClick={() => onRemove(image.id)}
                >
                  {isUpdating ? "Removing..." : "Remove"}
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant={image.isSelected ? "outline" : "default"}
              className={cn(
                "h-8 w-full rounded-md px-4.5 text-sm font-medium",
                image.isSelected &&
                  "border-hairline-strong bg-surface-card text-ink",
              )}
              disabled={isUpdating}
              onClick={() => {
                if (image.isSelected) {
                  setIsConfirmingRemove(true);
                  return;
                }

                setIsConfirmingRemove(false);
                onSelect(image.id);
              }}
            >
              {isUpdating ? "Saving..." : image.isSelected ? "Remove" : "Keep"}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
