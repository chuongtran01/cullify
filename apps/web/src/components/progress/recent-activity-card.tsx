import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RecentActivityCard({ activity }: { activity: string[] }) {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activity.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 border-b border-hairline-soft pb-3 last:border-0 last:pb-0"
            >
              <span className="size-2 rounded-full bg-primary" />
              <span className="text-sm text-body-strong">{item}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
