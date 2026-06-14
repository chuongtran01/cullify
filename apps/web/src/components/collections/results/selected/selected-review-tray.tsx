import { PhotoSurface } from "@/components/collections/results/photo-surface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CollectionSelectedImage } from "@/services/collections";

type SelectedReviewTrayProps = {
  activeImage: CollectionSelectedImage;
  images: CollectionSelectedImage[];
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onActiveImageChange: (imageId: string) => void;
  onLoadMore: () => void;
};

function SelectionBadge({ label }: { label: string }) {
  return (
    <Badge className="rounded-full border-0 bg-surface-strong px-2.5 text-sm font-medium text-body shadow-none">
      {label}
    </Badge>
  );
}

export function SelectedReviewTray({
  activeImage,
  images,
  isFetchingNextPage,
  hasNextPage,
  onActiveImageChange,
  onLoadMore,
}: SelectedReviewTrayProps) {
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
          <Badge className="absolute left-3 top-3 rounded-full bg-primary px-3 text-on-primary">
            Selected
          </Badge>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          <SelectionBadge label={activeImage.selectionLabel} />
        </div>
      </div>

      <aside className="min-w-0 border-hairline-strong lg:border-l lg:pl-6">
        <div className="grid max-h-[34rem] gap-0 overflow-y-auto pr-1">
          {images.map((image) => {
            const isActive = image.id === activeImage.id;

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
                  <SelectionBadge label={image.selectionLabel} />
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
