import { ArrowRight } from "lucide-react";

import type {
  ReviewPhoto,
  ReviewResultsData,
  SimilarGroup,
} from "@/components/results/mock-data";
import { PhotoSurface } from "@/components/results/photo-surface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function WorkflowSection({
  title,
  count,
  description,
  action,
  children,
}: {
  title: string;
  count: string;
  description: string;
  action: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[22px] border border-hairline bg-canvas p-5">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl leading-tight font-normal text-ink">{title}</h2>
            <Badge variant="outline" className="h-7 rounded-full px-3 text-xs text-body">
              {count}
            </Badge>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-body">{description}</p>
        </div>
        <Button className="h-10 rounded-full px-4 sm:shrink-0">
          {action}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
      {children}
    </section>
  );
}

function PicksStrip({ photos }: { photos: ReviewPhoto[] }) {
  return (
    <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
      {photos.map((photo) => (
        <article
          key={photo.id}
          className="min-w-[220px] overflow-hidden rounded-[22px] border border-hairline bg-surface-card"
        >
          <PhotoSurface className="aspect-[4/3]" src={photo.src} title={photo.title} />
        </article>
      ))}
    </div>
  );
}

function SimilarGroupCard({ group }: { group: SimilarGroup }) {
  return (
    <article className="min-w-[240px] overflow-hidden rounded-[16px] border border-hairline bg-surface-card">
      <div className="relative">
        <PhotoSurface className="aspect-[4/3]" src={group.src} title={group.name} />
        <Badge className="absolute top-3 left-3 h-7 rounded-full bg-primary px-3 text-on-primary">
          AI Pick
        </Badge>
      </div>
      <div className="p-4">
        <h3 className="text-base font-medium text-ink">{group.name}</h3>
        <p className="mt-1 text-sm text-body">{group.photoCount} photos in group</p>
      </div>
    </article>
  );
}

function RejectedPhotoCard({ photo }: { photo: ReviewPhoto }) {
  return (
    <article className="min-w-[190px] overflow-hidden rounded-[16px] border border-hairline bg-surface-card">
      <div className="relative">
        <PhotoSurface className="aspect-[4/3]" src={photo.src} title={photo.title} />
        <Badge className="absolute top-3 left-3 h-7 rounded-full border-coral-soft bg-coral/90 px-3 text-white">
          {photo.reason}
        </Badge>
      </div>
    </article>
  );
}

export function ResultsWorkflows({
  data,
}: {
  data: Pick<ReviewResultsData, "standoutPhotos" | "similarGroups" | "rejectedPhotos">;
}) {
  return (
    <div className="grid gap-5">
      <WorkflowSection
        action="Review All Picks"
        count={`${data.standoutPhotos.length} picks`}
        description="Start with the photos the AI believes are the strongest moments from the batch."
        title="Review AI Picks"
      >
        <PicksStrip photos={data.standoutPhotos} />
      </WorkflowSection>

      <WorkflowSection
        action="Review All Groups"
        count={`${data.similarGroups.length} groups`}
        description="Compare visually similar photos and keep the best frame from each set."
        title="Review Similar Groups"
      >
        <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
          {data.similarGroups.map((group) => (
            <SimilarGroupCard group={group} key={group.id} />
          ))}
        </div>
      </WorkflowSection>

      <WorkflowSection
        action="Review Rejected"
        count={`${data.rejectedPhotos.length} photos`}
        description="Check photos flagged for blur, focus issues, closed eyes, poor lighting, or duplication."
        title="Review Rejected Photos"
      >
        <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
          {data.rejectedPhotos.map((photo) => (
            <RejectedPhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
      </WorkflowSection>
    </div>
  );
}
