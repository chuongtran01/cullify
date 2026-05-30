import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type ProgressHeaderProps = {
  title: string;
  uploadedAt: string;
  batchId: string;
  status: string;
  progress: number;
};

export function ProgressHeader({
  title,
  uploadedAt,
  batchId,
  status,
  progress,
}: ProgressHeaderProps) {
  const isComplete = progress >= 100 || status === "COMPLETED";

  return (
    <header className="flex flex-col gap-5 rounded-[22px] border border-hairline bg-canvas p-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-3">
        <Button
          asChild
          variant="outline"
          size="icon"
          aria-label="Back"
          className="size-10 shrink-0 rounded-full border-hairline bg-surface-card hover:bg-surface-stone"
        >
          <Link href="/">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <div className="mb-2 font-mono text-xs uppercase tracking-[0.02em] text-muted">
            Batch {batchId}
          </div>
          <h1 className="text-3xl leading-tight font-normal tracking-[-0.02em] sm:text-4xl">
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
        className="h-11 w-full gap-2 rounded-full px-5 sm:w-auto lg:shrink-0 hover:cursor-pointer"
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
