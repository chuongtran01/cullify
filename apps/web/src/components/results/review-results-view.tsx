import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Download,
  HelpCircle,
  Info,
  Lightbulb,
  Share2,
  Sparkles,
} from "lucide-react";

import type {
  ReviewPhoto,
  ReviewProgressItem,
  ReviewResultsData,
  SimilarGroup,
} from "@/components/results/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

function ProgressRing({ percent }: { percent: number }) {
  const value = Math.min(Math.max(percent, 0), 100);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div
      className="relative grid size-32 shrink-0 place-items-center"
      role="img"
      aria-label={`${value}% review complete`}
    >
      <svg aria-hidden className="absolute inset-0 size-32 -rotate-90" viewBox="0 0 128 128">
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="rgba(33,33,33,0.10)"
          strokeWidth="10"
        />
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="#003c33"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth="10"
        />
      </svg>
      <div className="text-center">
        <div className="text-3xl leading-none font-normal text-ink">{value}%</div>
        <div className="mt-1 text-xs text-muted">complete</div>
      </div>
    </div>
  );
}

function PhotoSurface({
  src,
  title,
  className = "",
}: {
  src: string;
  title: string;
  className?: string;
}) {
  return (
    <div
      aria-label={title}
      className={`bg-cover bg-center ${className}`}
      role="img"
      style={{ backgroundImage: `url(${src})` }}
    />
  );
}

function SummaryStat({
  label,
  value,
  helper,
}: {
  label: string;
  value: string | number;
  helper: string;
}) {
  return (
    <div className="rounded-[8px] border border-white/10 bg-white/8 p-4">
      <p className="font-mono text-xs uppercase text-white/55">{label}</p>
      <p className="mt-2 text-3xl leading-none font-normal text-white">{value}</p>
      <p className="mt-2 text-xs leading-5 text-white/55">{helper}</p>
    </div>
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

function ProgressRow({ item }: { item: ReviewProgressItem }) {
  const value = item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-ink">{item.label}</span>
        <span className="text-muted">
          {item.completed}/{item.total}
        </span>
      </div>
      <Progress value={value} className="h-1.5 bg-hairline" />
    </div>
  );
}

export function ReviewResultsView({ data }: { data: ReviewResultsData }) {
  return (
    <main className="min-h-screen bg-surface-stone text-ink">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <header className="rounded-[22px] border border-hairline bg-canvas p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <Link
                className="inline-flex items-center gap-2 text-sm text-body underline-offset-4 hover:text-action-blue hover:underline"
                href="/"
              >
                <ArrowLeft className="size-4" />
                Back to Workspace
              </Link>
              <h1 className="mt-4 text-4xl leading-tight font-normal text-ink sm:text-5xl">
                {data.title}
              </h1>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
                <span>Uploaded {data.uploadedAt}</span>
                <span>{data.totalPhotos} total photos</span>
                <span>Batch {data.batchId}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row lg:shrink-0">
              <Button variant="outline" className="h-11 rounded-full bg-surface-card px-5">
                <Share2 className="size-4" />
                Share Results
              </Button>
              <Button className="h-11 rounded-full px-5">
                <Download className="size-4" />
                Export Picks
              </Button>
            </div>
          </div>
        </header>

        <section className="grid gap-5 rounded-[22px] bg-deep-green p-5 text-white lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 font-mono text-xs uppercase text-white/60">
              <Sparkles className="size-4" />
              Analysis complete
            </div>
            <h2 className="mt-4 text-4xl leading-tight font-normal text-white">
              AI has finished analyzing your photos
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/70">
              Cullify selected the strongest photos, grouped similar frames, and flagged
              low-quality or duplicate images so you can move through review with a clear path.
            </p>
            <Button
              variant="outline"
              className="mt-6 h-11 rounded-full border-white/20 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white"
            >
              <HelpCircle className="size-4" />
              How it works
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <SummaryStat
              helper="AI-selected best photos"
              label="Standout Photos"
              value={data.standoutPhotos.length}
            />
            <SummaryStat
              helper="Visually similar sets"
              label="Similar Groups"
              value={data.similarGroups.length}
            />
            <SummaryStat
              helper="Flagged for human review"
              label="Photos To Review"
              value={data.rejectedPhotos.length}
            />
            <SummaryStat helper="Uploaded photos" label="Total Photos" value={data.totalPhotos} />
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
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

          <aside className="grid gap-5 lg:sticky lg:top-20">
            <section className="rounded-[22px] border border-hairline bg-canvas p-5">
              <div className="flex items-center gap-4">
                <ProgressRing percent={data.progress.percent} />
                <div>
                  <p className="font-mono text-xs uppercase text-muted">Review progress</p>
                  <h2 className="mt-2 text-2xl leading-tight font-normal text-ink">
                    {data.progress.percent}% reviewed
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-body">
                    Work through each review lane and export your final selections when ready.
                  </p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {data.progress.items.map((item) => (
                  <ProgressRow item={item} key={item.label} />
                ))}
              </div>
            </section>

            <section className="rounded-[16px] border border-hairline bg-canvas p-5">
              <div className="flex items-start gap-3">
                <Lightbulb className="mt-0.5 size-5 text-coral" />
                <div>
                  <h2 className="text-lg font-normal text-ink">Suggested workflow</h2>
                  <p className="mt-2 text-sm leading-6 text-body">
                    Start with AI Picks to confirm the strongest photos, then move into Similar
                    Groups before checking rejected images.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[16px] border border-hairline bg-canvas p-5">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 size-5 text-action-blue" />
                <div>
                  <h2 className="text-lg font-normal text-ink">Progress is saved</h2>
                  <p className="mt-2 text-sm leading-6 text-body">
                    You can leave this dashboard and return later. Review progress is saved
                    automatically.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[16px] border border-hairline bg-surface-blue-wash p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 text-deep-green" />
                <div>
                  <h2 className="text-lg font-normal text-ink">Ready when you are</h2>
                  <p className="mt-2 text-sm leading-6 text-body">
                    Export Picks creates a clean selection set from reviewed AI choices.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
