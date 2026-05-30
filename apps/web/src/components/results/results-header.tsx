import Link from "next/link";
import { ArrowLeft, Download, Share2 } from "lucide-react";

import type { ReviewResultsData } from "@/components/results/mock-data";
import { Button } from "@/components/ui/button";

type ResultsHeaderProps = {
  data: Pick<ReviewResultsData, "batchId" | "title" | "uploadedAt" | "totalPhotos">;
};

export function ResultsHeader({ data }: ResultsHeaderProps) {
  return (
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
  );
}
