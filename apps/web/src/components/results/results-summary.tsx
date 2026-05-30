import { HelpCircle, Sparkles } from "lucide-react";

import type { ReviewResultsData } from "@/components/results/mock-data";
import { Button } from "@/components/ui/button";

function SummaryStat({
  label,
  value,
  helper,
}: {
  label: string;
  value: string | number;
  helper: string;
}) {
  return (
    <div className="rounded-[8px] border border-white/10 bg-white/8 p-4">
      <p className="font-mono text-xs uppercase text-white/55">{label}</p>
      <p className="mt-2 text-3xl leading-none font-normal text-white">{value}</p>
      <p className="mt-2 text-xs leading-5 text-white/55">{helper}</p>
    </div>
  );
}

type ResultsSummaryProps = {
  data: Pick<
    ReviewResultsData,
    "standoutPhotos" | "similarGroups" | "rejectedPhotos" | "totalPhotos"
  >;
};

export function ResultsSummary({ data }: ResultsSummaryProps) {
  return (
    <section className="grid gap-5 rounded-[22px] bg-deep-green p-5 text-white lg:grid-cols-[1.15fr_1fr] lg:items-center">
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 font-mono text-xs uppercase text-white/60">
          <Sparkles className="size-4" />
          Analysis complete
        </div>
        <h2 className="mt-4 text-4xl leading-tight font-normal text-white">
          AI has finished analyzing your photos
        </h2>
        <p className="mt-4 text-sm leading-6 text-white/70">
          Cullify selected the strongest photos, grouped similar frames, and flagged
          low-quality or duplicate images so you can move through review with a clear path.
        </p>
        <Button
          variant="outline"
          className="mt-6 h-11 rounded-full border-white/20 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white"
        >
          <HelpCircle className="size-4" />
          How it works
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <SummaryStat
          helper="AI-selected best photos"
          label="Standout Photos"
          value={data.standoutPhotos.length}
        />
        <SummaryStat
          helper="Visually similar sets"
          label="Similar Groups"
          value={data.similarGroups.length}
        />
        <SummaryStat
          helper="Flagged for human review"
          label="Photos To Review"
          value={data.rejectedPhotos.length}
        />
        <SummaryStat helper="Uploaded photos" label="Total Photos" value={data.totalPhotos} />
      </div>
    </section>
  );
}
