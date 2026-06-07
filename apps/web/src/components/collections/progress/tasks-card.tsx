import { Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TasksCard({ tasks }: { tasks: string[] }) {
  return (
    <Card className="rounded-lg border border-hairline-strong bg-surface-card py-0 ring-0">
      <CardHeader className="p-5 pb-0">
        <CardTitle className="font-mono text-xs uppercase tracking-wide text-muted">
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
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-surface-strong text-ink">
                <Sparkles className="size-3.5" />
              </span>
              <span className="text-sm font-normal leading-normal text-body-strong">
                {task}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
