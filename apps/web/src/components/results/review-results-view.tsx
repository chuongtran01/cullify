import type { ReviewResultsData } from "@/components/results/mock-data";
import { ResultsHeader } from "@/components/results/results-header";
import { ResultsSidebar } from "@/components/results/results-sidebar";
import { ResultsSummary } from "@/components/results/results-summary";
import { ResultsWorkflows } from "@/components/results/results-workflows";

export function ReviewResultsView({ data }: { data: ReviewResultsData }) {
  return (
    <div className="flex w-full flex-col gap-5">
      <ResultsHeader data={data} />
      <ResultsSummary data={data} />
      <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <ResultsWorkflows data={data} />
        <ResultsSidebar progress={data.progress} />
      </div>
    </div>
  );
}
