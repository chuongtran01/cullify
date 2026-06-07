"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

type ProgressHeaderProps = {
  title: string;
  uploadedAt: string;
  collectionId: string;
  status: string;
  progress: number;
};

export function ProgressHeader({
  title,
  uploadedAt,
  collectionId,
  status,
  progress,
}: ProgressHeaderProps) {
  const router = useRouter();
  const isComplete =
    progress >= 100 ||
    status === "READY_FOR_REVIEW" ||
    status === "IN_REVIEW" ||
    status === "COMPLETED";

  return (
    <header className="flex flex-col gap-4 rounded-lg border border-hairline-strong bg-surface-card p-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-3">
        <div>
          <div className="mb-2 font-mono text-xs uppercase tracking-wide text-muted">
            Collection {collectionId}
          </div>
          <h1 className="text-3xl font-semibold leading-snug tracking-tight text-ink sm:text-4xl">
            {title}
          </h1>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
            <span>Uploaded {uploadedAt}</span>
          </div>
        </div>
      </div>
      <Button
        variant="default"
        disabled={!isComplete}
        onClick={() =>
          router.push(`/dashboard/collections/${collectionId}/results`)
        }
        className="h-10 w-full gap-2 rounded-md px-4.5 text-sm font-medium sm:w-auto lg:shrink-0 hover:cursor-pointer"
      >
        Review Results
        <ArrowRight
          className="size-4 transition-transform duration-200 group-hover/button:translate-x-1"
          aria-hidden="true"
        />
      </Button>
    </header>
  );
}
