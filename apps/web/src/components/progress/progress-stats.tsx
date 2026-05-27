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
            className="rounded-[16px] border border-card-border bg-canvas py-0 ring-0"
          >
            <CardContent className="flex items-center justify-between gap-3 p-5">
              <div>
                <div className="font-mono text-xs uppercase tracking-[0.02em] text-muted">
                  {stat.label}
                </div>
                <div className="mt-2 text-3xl font-normal tracking-[-0.02em]">
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
