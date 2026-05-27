import { Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TasksCard({ tasks }: { tasks: string[] }) {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>What we&apos;re doing</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task} className="flex items-start gap-3">
              <span className="mt-0.5 flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
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
