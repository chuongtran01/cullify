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
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        <Button asChild variant="outline" size="icon" aria-label="Back">
          <Link href="/">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl leading-tight font-medium sm:text-3xl">
            {title}
          </h1>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
            <span>Uploaded {uploadedAt}</span>
            <span aria-hidden="true">/</span>
            <span>{totalPhotos} total photos</span>
            <span aria-hidden="true">/</span>
            <span>Batch {batchId}</span>
          </div>
        </div>
      </div>
      <Badge className="h-7 rounded-md bg-primary/10 px-3 text-primary ring-1 ring-primary/20">
        {status}
      </Badge>
    </header>
  );
}
