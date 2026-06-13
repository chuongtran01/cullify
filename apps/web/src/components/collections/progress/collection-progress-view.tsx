import { AlertCircle, Check, Clock3, LoaderCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type {
  CollectionProgressData,
  ProcessingStageStatus,
} from "@/components/collections/progress/types";

const READY_STATUSES = new Set(["READY_FOR_REVIEW", "IN_REVIEW", "COMPLETED"]);

function getHeaderCopy(status: string) {
  if (READY_STATUSES.has(status)) {
    return {
      title: "Your collection is ready",
      description:
        "Choose keepers, compare similar shots, and recover exceptions.",
    };
  }

  if (status === "FAILED") {
    return {
      title: "Processing needs attention",
      description: "Processing stopped before the review could be prepared.",
    };
  }

  return {
    title: "Analyzing your collection",
    description:
      "We’re checking quality, finding similar photos, and preparing your review.",
  };
}

function StageIcon({ status }: { status: ProcessingStageStatus }) {
  if (status === "completed") {
    return <Check className="mt-1 size-5 shrink-0 text-semantic-success" aria-hidden="true" />;
  }

  if (status === "in progress") {
    return (
      <LoaderCircle
        className="mt-1 size-5 shrink-0 animate-spin text-ink"
        aria-hidden="true"
      />
    );
  }

  return <Clock3 className="mt-1 size-5 shrink-0 text-body" aria-hidden="true" />;
}

function getStageDescription(label: string) {
  switch (label) {
    case "Checking image quality":
      return "Flagging blur, focus, exposure, and compression issues.";
    case "Creating image embeddings":
      return "Encoding visual similarity signals for each photo.";
    case "Finding similar groups":
      return "Clustering bursts and look-alikes into review sets.";
    case "Preparing review":
      return "Building the low-quality, similar-group, and selected photo views.";
    default:
      return "Preparing this step.";
  }
}

function getStageStatusLabel(status: ProcessingStageStatus) {
  if (status === "completed") {
    return "Done";
  }

  if (status === "in progress") {
    return "Now";
  }

  return "Pending";
}

function ProgressStep({
  label,
  status,
  showSeparator = true,
}: {
  label: string;
  status: ProcessingStageStatus;
  showSeparator?: boolean;
}) {
  return (
    <li>
      {showSeparator ? <Separator className="bg-hairline" /> : null}
      <div className="flex items-start gap-4 py-5">
        <StageIcon status={status} />
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-ink">{label}</h2>
          <p className="mt-1 text-sm leading-5 text-body">
            {getStageDescription(label)}
          </p>
        </div>
        <span className="pt-1 text-sm text-body">
          {getStageStatusLabel(status)}
        </span>
      </div>
    </li>
  );
}

export function CollectionProgressView({ data }: { data: CollectionProgressData }) {
  const header = getHeaderCopy(data.status);
  const progress = Math.min(Math.max(data.progress, 0), 100);
  const isReady = READY_STATUSES.has(data.status);
  const isFailed = data.status === "FAILED";

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center py-16">
      <section className="w-full text-center">
        <h1 className="text-3xl font-semibold leading-tight text-ink">
          {header.title}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-body">
          {header.description}
        </p>
      </section>

      <section className="mt-14 w-full">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-base text-body">
              <span className="font-semibold text-ink">
                {data.processedPhotos.toLocaleString()}
              </span>{" "}
              of {data.totalPhotos.toLocaleString()} photos
            </p>
          </div>
          <p className="text-4xl font-semibold leading-none text-ink">
            {progress}%
          </p>
        </div>

        <Progress className="mt-5 h-1.5 bg-surface-strong" value={progress} />

        {isFailed ? (
          <div className="mt-5">
            <Separator className="bg-hairline" />
            <div className="flex items-start gap-2 pt-5 text-sm text-semantic-error">
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <p>
                {data.failedPhotos > 0
                  ? `${data.failedPhotos.toLocaleString()} photos could not be analyzed.`
                  : "Analysis did not finish successfully."}
              </p>
            </div>
          </div>
        ) : null}
      </section>

      <section className="mt-8 w-full">
        <Separator className="bg-hairline" />
        <dl>
          <div className="flex items-center justify-between gap-4 py-4">
            <dt className="text-sm text-body">Low quality flagged</dt>
            <dd className="text-sm font-medium text-ink">
              {data.lowQualityDetected.toLocaleString()}
            </dd>
          </div>
          <Separator className="bg-hairline" />
          <div className="flex items-center justify-between gap-4 py-4">
            <dt className="text-sm text-body">Similar groups</dt>
            <dd className="text-sm font-medium text-ink">
              {data.similarGroupsFound.toLocaleString()}
            </dd>
          </div>
        </dl>
        <Separator className="bg-hairline" />
      </section>

      <ol className="mt-8 w-full">
        {data.stages.map((stage, index) => (
          <ProgressStep
            key={stage.label}
            label={stage.label}
            status={stage.status}
            showSeparator={index > 0}
          />
        ))}
      </ol>

      {isReady ? (
        <Button asChild className="mt-8 h-10 rounded-md px-4 text-sm">
          <Link href={`/dashboard/collections/${data.collectionId}/results`}>
            Review
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
