import type { ProgressStat } from "@/components/progress/types";
import { Card, CardContent } from "@/components/ui/card";

export function ProgressStats({ stats }: { stats: ProgressStat[] }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.label}
            className="rounded-2xl border border-card-border bg-canvas py-0 ring-0"
          >
            <CardContent className="flex items-center justify-between gap-3 p-5">
              <div>
                <div className="font-mono text-xs uppercase tracking-wide text-muted">
                  {stat.label}
                </div>
                <div className="mt-2 text-3xl font-normal tracking-tight">
                  {stat.value}
                </div>
              </div>
              <span className="flex size-10 items-center justify-center rounded-full bg-surface-stone text-primary">
                <Icon className="size-4" />
              </span>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
