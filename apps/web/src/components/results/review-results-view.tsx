import type { ReviewResultsData } from "@/components/results/mock-data";
import { ResultsHeader } from "@/components/results/results-header";
import { ResultsSidebar } from "@/components/results/results-sidebar";
import { ResultsSummary } from "@/components/results/results-summary";
import { ResultsWorkflows } from "@/components/results/results-workflows";

export function ReviewResultsView({ data }: { data: ReviewResultsData }) {
  return (
    <main className="min-h-screen bg-surface-stone text-ink">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <ResultsHeader data={data} />
        <ResultsSummary data={data} />
        <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <ResultsWorkflows data={data} />
          <ResultsSidebar progress={data.progress} />
        </div>
      </div>
    </main>
  );
}
