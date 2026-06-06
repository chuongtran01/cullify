import type { ReviewResultsData } from "@/components/results/mock-data";
import { Button } from "@/components/ui/button";

type ResultsHeaderProps = {
  data: Pick<ReviewResultsData, "title">;
};

export function ResultsHeader({ data }: ResultsHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 pb-4">
      <h1 className="min-w-0 truncate text-base font-medium text-ink">
        {data.title}
      </h1>
      <Button
        type="button"
        variant="outline"
        className="h-9 shrink-0 rounded-lg px-4"
      >
        Share
      </Button>
    </header>
  );
}
