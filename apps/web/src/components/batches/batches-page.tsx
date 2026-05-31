"use client";

import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { BatchFilters } from "@/components/batches/batch-filters";
import { BatchList } from "@/components/batches/batch-list";
import { BatchesSummary } from "@/components/batches/batches-summary";
import { ContinueBatches } from "@/components/batches/continue-batches";
import { EmptyBatches } from "@/components/batches/empty-batches";
import { mockBatches } from "@/components/batches/mock-data";
import type { BatchFilterValue } from "@/components/batches/types";
import { UploadDialog } from "@/components/landing/upload-dialog";
import { Button } from "@/components/ui/button";
import type { CreateUploadSessionResponse } from "@/lib/upload/types";

export function BatchesPage() {
  const router = useRouter();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<BatchFilterValue>("ALL");
  const [search, setSearch] = useState("");

  const continueBatches = mockBatches.filter((batch) =>
    ["READY_FOR_REVIEW", "IN_REVIEW"].includes(batch.status),
  );

  const filteredBatches = useMemo(() => {
    return mockBatches
      .filter((batch) => {
        const matchesFilter =
          activeFilter === "ALL" || batch.status === activeFilter;
        const matchesSearch = batch.name
          .toLowerCase()
          .includes(search.trim().toLowerCase());

        return matchesFilter && matchesSearch;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [activeFilter, search]);

  const summary = {
    totalBatches: mockBatches.length,
    needsReview: mockBatches.filter((batch) =>
      ["READY_FOR_REVIEW", "IN_REVIEW"].includes(batch.status),
    ).length,
    processing: mockBatches.filter((batch) =>
      ["UPLOADING", "PROCESSING"].includes(batch.status),
    ).length,
    totalPhotos: mockBatches.reduce((total, batch) => total + batch.totalImages, 0),
  };

  function handleUploadSessionCreated(response: CreateUploadSessionResponse) {
    router.push(`/batches/${response.sessionId}/progress`);
  }

  return (
    <>
      <div className="flex w-full flex-col gap-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-normal leading-tight text-ink">
              Batches
            </h1>
            <p className="mt-2 text-sm leading-6 text-body">
              Upload, process, and review your photo collections.
            </p>
          </div>
          <Button
            className="h-11 cursor-pointer gap-2 self-start rounded-full px-6"
            onClick={() => setUploadOpen(true)}
          >
            <Upload className="size-4" aria-hidden="true" />
            Upload New Batch
          </Button>
        </header>

        {mockBatches.length === 0 ? (
          <EmptyBatches onUploadClick={() => setUploadOpen(true)} />
        ) : (
          <>
            <BatchesSummary {...summary} />
            <section className="grid gap-4">
              <BatchFilters
                activeFilter={activeFilter}
                search={search}
                onFilterChange={setActiveFilter}
                onSearchChange={setSearch}
              />
              <BatchList batches={filteredBatches} />
            </section>
          </>
        )}

        <p className="border-t border-hairline-light pt-4 text-xs text-muted-foreground">
          Batches are stored permanently. You can review and download results anytime.
        </p>
      </div>

      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUploadSessionCreated={handleUploadSessionCreated}
      />
    </>
  );
}
