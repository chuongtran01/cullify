"use client";

import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { BatchFilters } from "@/components/batches/batch-filters";
import { BatchList } from "@/components/batches/batch-list";
import { BatchesSummary } from "@/components/batches/batches-summary";
import { EmptyBatches } from "@/components/batches/empty-batches";
import type { BatchFilterValue } from "@/components/batches/types";
import { UploadDialog } from "@/components/landing/upload-dialog";
import { Button } from "@/components/ui/button";
import { useBatches, useBatchesSummary } from "@/hooks/use-batches";
import type { CreateUploadSessionResponse } from "@/lib/upload/types";

const emptySummary = {
  totalBatches: 0,
  needsReview: 0,
  processing: 0,
  totalPhotos: 0,
};

export function BatchesPage() {
  const router = useRouter();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<BatchFilterValue>("ALL");
  const [search, setSearch] = useState("");
  const { data, error, isPending } = useBatches();
  const {
    data: summary = emptySummary,
    error: summaryError,
    isPending: isSummaryPending,
  } = useBatchesSummary();
  const batches = useMemo(() => data?.batches ?? [], [data?.batches]);
  const loadError =
    error instanceof Error
      ? error
      : summaryError instanceof Error
        ? summaryError
        : null;

  const filteredBatches = useMemo(() => {
    return batches
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
  }, [activeFilter, batches, search]);

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

        {isPending || isSummaryPending ? (
          <section className="rounded-md border border-hairline-light bg-surface-card p-8 text-center">
            <h2 className="text-lg font-normal text-ink">Loading batches</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-body">
              Fetching your photo collections.
            </p>
          </section>
        ) : loadError || error || summaryError ? (
          <section className="rounded-md border border-hairline-light bg-surface-card p-8 text-center">
            <h2 className="text-lg font-normal text-ink">
              Could not load batches
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-body">
              {loadError?.message ?? "Refresh the page and try again."}
            </p>
          </section>
        ) : summary.totalBatches === 0 ? (
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
              {filteredBatches.length === 0 ? (
                <section className="rounded-md border border-hairline-light bg-surface-card p-8 text-center">
                  <h2 className="text-lg font-normal text-ink">
                    No matching batches
                  </h2>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-body">
                    {batches.length === 0
                      ? "No batch rows are available yet."
                      : "Try another search term or filter."}
                  </p>
                </section>
              ) : (
                <BatchList batches={filteredBatches} />
              )}
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
