import Link from "next/link";

import { PhotoSurface } from "@/components/collections/results/photo-surface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CollectionGroupPreview } from "@/services/collections";

export function GroupCard({ group }: { group: CollectionGroupPreview }) {
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
