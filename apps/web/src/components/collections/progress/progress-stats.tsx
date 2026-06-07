import type { ProgressStat } from "@/components/collections/progress/types";
import { Card, CardContent } from "@/components/ui/card";

export function ProgressStats({ stats }: { stats: ProgressStat[] }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.label}
            className="rounded-lg border border-hairline-strong bg-surface-card py-0 ring-0"
          >
            <CardContent className="flex items-center justify-between gap-3 p-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {stat.label}
                </div>
                <div className="mt-3 text-2xl font-semibold text-ink">
                  {stat.value}
                </div>
              </div>
              <span className="flex size-10 items-center justify-center rounded-md bg-surface-strong text-ink">
                <Icon className="size-4" />
              </span>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
