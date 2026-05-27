import {
  ArrowLeft,
  Check,
  Clock3,
  Images,
  Layers3,
  LoaderCircle,
  ScanSearch,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const progress = 68;

const stats = [
  { label: "Total Photos", value: "143", icon: Images },
  { label: "Processed", value: "82", icon: Check },
  { label: "Low Quality Detected", value: "19", icon: ShieldAlert },
  { label: "Similar Groups Found", value: "11", icon: Layers3 },
];

const stages = [
  {
    label: "Detecting blurry and out-of-focus photos",
    status: "completed",
  },
  {
    label: "Extracting image features",
    status: "completed",
  },
  {
    label: "Grouping similar photos",
    status: "in progress",
  },
  {
    label: "Scoring and selecting best photos",
    status: "pending",
  },
];

const activity = [
  "IMG_1023.JPG marked as blurry",
  "Group 7 created with 6 similar photos",
  "Best photo selected for Group 4",
  "IMG_1088.JPG passed exposure checks",
];

const tasks = [
  "Detecting blurry and out-of-focus photos",
  "Grouping similar photos",
  "Scoring and selecting best photos",
];

function StageIcon({ status }: { status: string }) {
  if (status === "completed") {
    return (
      <span className="flex size-6 items-center justify-center rounded-full bg-semantic-success text-white">
        <Check className="size-3.5" />
      </span>
    );
  }

  if (status === "in progress") {
    return (
      <span className="flex size-6 items-center justify-center rounded-full bg-primary text-white">
        <LoaderCircle className="size-3.5 animate-spin" />
      </span>
    );
  }

  return (
    <span className="flex size-6 items-center justify-center rounded-full border border-hairline-strong bg-canvas-soft">
      <Clock3 className="size-3.5 text-muted" />
    </span>
  );
}

type ProgressPageProps = {
  params: Promise<{ batchId: string }>;
};

export default async function ProgressPage({ params }: ProgressPageProps) {
  const { batchId } = await params;

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <Button asChild variant="outline" size="icon" aria-label="Back">
              <Link href="/">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl leading-tight font-medium sm:text-3xl">
                Italy Trip 2024
              </h1>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
                <span>Uploaded May 14, 2024</span>
                <span aria-hidden="true">/</span>
                <span>143 total photos</span>
                <span aria-hidden="true">/</span>
                <span>Batch {batchId}</span>
              </div>
            </div>
          </div>
          <Badge className="h-7 rounded-md bg-primary/10 px-3 text-primary ring-1 ring-primary/20">
            PROCESSING
          </Badge>
        </header>

        <section className="grid gap-4 rounded-lg bg-surface-card p-4 ring-1 ring-hairline md:p-5 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="grid gap-5 sm:grid-cols-[176px_1fr] sm:items-center">
            <div className="relative mx-auto flex size-40 items-center justify-center sm:mx-0">
              <svg className="size-40 -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="var(--hairline-soft)"
                  strokeWidth="10"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="var(--primary)"
                  strokeDasharray={`${progress * 3.1416} 314.16`}
                  strokeLinecap="round"
                  strokeWidth="10"
                />
              </svg>
              <div className="absolute text-center">
                <div className="text-4xl leading-none font-medium">
                  {progress}%
                </div>
                <div className="mt-1 text-xs text-muted">complete</div>
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <Sparkles className="size-4" />
                AI processing
              </div>
              <h2 className="mt-2 text-2xl leading-tight font-medium">
                Analyzing your photos...
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-body">
                AI is finding the best photos, filtering low-quality shots, and
                organizing similar images so review is faster when processing
                completes.
              </p>

              <div className="mt-6 space-y-2">
                <Progress value={progress} className="h-2 bg-hairline-soft" />
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="font-medium text-ink">
                    82 of 143 photos processed
                  </span>
                  <span className="text-muted">About 4 minutes remaining</span>
                </div>
              </div>

              <div className="mt-4 inline-flex items-center gap-3 rounded-lg border border-hairline bg-canvas-soft px-3 py-2 text-sm">
                <Clock3 className="size-4 text-primary" />
                <div>
                  <div className="font-medium">Estimated remaining time</div>
                  <div className="text-muted">4 minutes</div>
                </div>
              </div>
            </div>
          </div>

          <aside className="border-t border-hairline pt-4 lg:border-t-0 lg:border-l lg:pl-5">
            <div className="flex items-center gap-2">
              <ScanSearch className="size-4 text-primary" />
              <h3 className="text-base font-medium">Processing Stages</h3>
            </div>
            <div className="mt-4 space-y-4">
              {stages.map((stage) => (
                <div key={stage.label} className="flex gap-3">
                  <StageIcon status={stage.status} />
                  <div className="min-w-0">
                    <div className="text-sm font-medium leading-5">
                      {stage.label}
                    </div>
                    <div className="mt-0.5 text-xs uppercase tracking-wide text-muted">
                      {stage.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </section>

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

        <section className="grid gap-4 lg:grid-cols-2">
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
                    <span className="text-sm leading-6 text-body-strong">
                      {task}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <footer className="flex flex-col gap-3 rounded-lg border border-hairline bg-canvas-soft px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-sm text-body">
            <Clock3 className="size-4 text-primary" />
            <span>
              You can leave this page. Processing will continue in the
              background.
            </span>
          </div>
          <Button disabled className="w-full sm:w-auto">
            Review Results
          </Button>
        </footer>
      </div>
    </main>
  );
}
