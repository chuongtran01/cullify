import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RecentActivityCard({ activity }: { activity: string[] }) {
  return (
    <Card className="rounded-[16px] border border-card-border bg-canvas py-0 ring-0">
      <CardHeader className="p-5 pb-0">
        <CardTitle className="font-mono text-xs font-normal uppercase tracking-[0.02em] text-muted">
          Recent activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="grid border-y border-hairline">
          {activity.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 border-b border-hairline py-3 last:border-b-0"
            >
              <span className="size-2 rounded-full bg-action-blue" />
              <span className="text-sm text-body-strong">{item}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
