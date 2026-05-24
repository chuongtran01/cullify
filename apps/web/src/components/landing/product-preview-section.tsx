import Link from "next/link";
import { Check, Clock3, MousePointer2 } from "lucide-react";

import { PhotoTile } from "@/components/landing/photo-tile";
import { SectionHeader } from "@/components/landing/section-header";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProductPreviewSection() {
  return (
    <section id="demo" className="mx-auto max-w-6xl px-5 py-20">
      <SectionHeader
        eyebrow="Product preview"
        title="A gallery designed around groups, not endless scrolling."
        description="Recommendations, warnings, and compare controls sit directly inside the review surface."
      />
      <div className="mt-12 rounded-2xl border border-hairline bg-surface-card p-3">
        <div className="rounded-xl border border-hairline bg-canvas-soft p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              {["Grouping", "Best Shot", "Blur Detection"].map((tab) => (
                <Button key={tab} variant="ghost" className="h-9 px-3">
                  {tab}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-body">
              <Clock3 className="size-4" />
              31 clusters left
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <PhotoTile className="h-44 sm:h-56" state="pick" label="keep" />
              <PhotoTile className="h-44 sm:h-56" label="compare" />
              <PhotoTile className="h-44 sm:h-56" state="blur" />
              <PhotoTile className="h-44 sm:h-56" label="similar" />
              <PhotoTile className="h-44 sm:h-56" label="similar" />
              <PhotoTile className="h-44 sm:h-56" label="similar" />
            </div>
            <aside className="rounded-xl border border-hairline bg-surface-card p-5">
              <Badge variant="outline" className="font-semibold uppercase text-muted">
                Compare mode
              </Badge>
              <h3 className="mt-3 text-3xl font-normal leading-tight text-ink">
                Cullify recommends frame 04 for sharpness and expression.
              </h3>
              <div className="mt-6 grid gap-3">
                {[
                  ["Sharpness", "96"],
                  ["Face quality", "91"],
                  ["Duplicate distance", "Low"],
                  ["Aesthetic score", "88"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between border-b border-hairline-soft pb-3 text-sm"
                  >
                    <span className="text-body">{label}</span>
                    <span className="font-mono text-ink">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link
                  href="#"
                  className={cn(buttonVariants(), "h-10 px-4")}
                >
                  <Check className="size-4" />
                  Accept Pick
                </Link>
                <Link
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    "h-10 px-4",
                  )}
                >
                  <MousePointer2 className="size-4" />
                  Compare
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
