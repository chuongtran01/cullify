import { Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TasksCard({ tasks }: { tasks: string[] }) {
  return (
    <Card className="rounded-[16px] border border-card-border bg-canvas py-0 ring-0">
      <CardHeader className="p-5 pb-0">
        <CardTitle className="font-mono text-xs font-normal uppercase tracking-[0.02em] text-muted">
          What we&apos;re doing
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="grid border-y border-hairline">
          {tasks.map((task) => (
            <div
              key={task}
              className="flex items-start gap-3 border-b border-hairline py-3 last:border-b-0"
            >
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-stone text-primary">
                <Sparkles className="size-3.5" />
              </span>
              <span className="text-sm leading-6 text-body-strong">{task}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
