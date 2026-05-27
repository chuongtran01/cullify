import type { ProgressStat } from "@/components/progress/types";
import { Card, CardContent } from "@/components/ui/card";

export function ProgressStats({ stats }: { stats: ProgressStat[] }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="rounded-lg py-3">
            <CardContent className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm text-muted">{stat.label}</div>
                <div className="mt-1 text-2xl font-medium">{stat.value}</div>
              </div>
              <span className="flex size-9 items-center justify-center rounded-lg bg-canvas-soft text-primary ring-1 ring-hairline">
                <Icon className="size-4" />
              </span>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
