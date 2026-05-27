import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ProgressHeaderProps = {
  title: string;
  uploadedAt: string;
  totalPhotos: number;
  batchId: string;
  status: string;
};

export function ProgressHeader({
  title,
  uploadedAt,
  totalPhotos,
  batchId,
  status,
}: ProgressHeaderProps) {
  return (
    <header className="flex flex-col gap-5 rounded-[22px] border border-hairline bg-canvas p-5 sm:flex-row sm:items-start sm:justify-between">
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
            <span aria-hidden="true">/</span>
            <span>{totalPhotos} total photos</span>
          </div>
        </div>
      </div>
      <Badge className="h-8 w-fit rounded-full bg-primary px-3 font-mono font-normal uppercase tracking-[0.02em] text-on-primary">
        {status}
      </Badge>
    </header>
  );
}
