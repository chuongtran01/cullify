import { PhotoSurface } from "@/components/collections/results/photo-surface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CollectionLowQualityImage } from "@/services/collections";

type LowQualityReviewTrayProps = {
  activeImage: CollectionLowQualityImage;
  images: CollectionLowQualityImage[];
  isFetchingNextPage: boolean;
  isUpdatingActiveImage: boolean;
  hasNextPage: boolean;
  onActiveImageChange: (imageId: string) => void;
  onLoadMore: () => void;
  onRemove: (imageId: string) => void;
  onSelect: (imageId: string) => void;
};

function ReasonChips({ reasons }: { reasons: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {reasons.map((reason) => (
        <Badge
          key={reason}
          className="rounded-full border-semantic-error/20 bg-semantic-error/10 px-2.5 text-semantic-error"
        >
          {reason}
        </Badge>
      ))}
    </div>
  );
}

export function LowQualityReviewTray({
  activeImage,
  images,
  isFetchingNextPage,
  isUpdatingActiveImage,
  hasNextPage,
  onActiveImageChange,
  onLoadMore,
  onRemove,
  onSelect,
}: LowQualityReviewTrayProps) {
  const isSelected = activeImage.isSelected;

  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="min-w-0">
        <div className="relative">
          <PhotoSurface
            className="aspect-[4/3] rounded-md"
            sizes="(max-width: 1024px) 100vw, 760px"
            src={activeImage.imageUrl}
            title={activeImage.fileName}
          />
          {isSelected ? (
            <Badge className="absolute left-3 top-3 rounded-full bg-primary px-3 text-on-primary">
              Selected
            </Badge>
          ) : null}
        </div>
        <div className="mt-4 grid gap-4">
          <ReasonChips reasons={activeImage.reasons} />
          <Button
            type="button"
            variant={isSelected ? "destructive" : "default"}
            className={cn(
              "h-10 rounded-md px-4.5 text-sm font-medium cursor-pointer",
            )}
            disabled={isUpdatingActiveImage}
            onClick={() => {
              if (isSelected) {
                onRemove(activeImage.id);
                return;
              }

              onSelect(activeImage.id);
            }}
          >
            {isUpdatingActiveImage ? "Saving..." : isSelected ? "Remove" : "Keep"}
          </Button>
        </div>
      </div>

      <aside className="min-w-0 border-hairline-strong lg:border-l lg:pl-6">
        <div className="grid max-h-[34rem] gap-0 overflow-y-auto pr-1">
          {images.map((image) => {
            const isActive = image.id === activeImage.id;
            const primaryReason = image.reasons[0] ?? "Flagged";

            return (
              <button
                key={image.id}
                type="button"
                className={cn(
                  "grid grid-cols-[6rem_minmax(0,1fr)] items-center gap-3 border-b border-hairline py-3 text-left transition-colors",
                  isActive && "bg-canvas-soft pl-2",
                )}
                onClick={() => onActiveImageChange(image.id)}
              >
                <PhotoSurface
                  className="aspect-[4/3] rounded-md"
                  sizes="120px"
                  src={image.imageUrl}
                  title={image.fileName}
                />
                <div className="min-w-0">
                  <ReasonChips reasons={[primaryReason]} />
                  {image.isSelected ? (
                    <p className="mt-2 text-xs font-medium text-ink">Selected</p>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
        {hasNextPage ? (
          <div className="pt-4">
            <Button
              className="h-10 w-full rounded-md border-hairline-strong bg-surface-card px-4.5 text-sm font-medium text-ink"
              variant="outline"
              disabled={isFetchingNextPage}
              onClick={onLoadMore}
            >
              {isFetchingNextPage ? "Loading..." : "Load More"}
            </Button>
          </div>
        ) : null}
      </aside>
    </section>
  );
}
