import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

type EmptyBatchesProps = {
  onUploadClick: () => void;
};

export function EmptyBatches({ onUploadClick }: EmptyBatchesProps) {
  return (
    <section className="rounded-md border border-dashed border-hairline-light bg-surface-card p-8 text-center">
      <h2 className="text-lg font-normal text-ink">No batches yet</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-body">
        Upload your first photo collection and let AI find your best shots
        automatically.
      </p>
      <Button className="mt-5 rounded-full px-6" onClick={onUploadClick}>
        <Upload className="size-4" aria-hidden="true" />
        Upload Photos
      </Button>
    </section>
  );
}
