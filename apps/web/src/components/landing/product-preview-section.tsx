import Link from "next/link";
import { Check, Clock3, MousePointer2 } from "lucide-react";

import { PhotoTile } from "@/components/landing/photo-tile";
import { SectionHeader } from "@/components/landing/section-header";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProductPreviewSection() {
  return (
    <section id="demo" className="bg-surface-dark px-5 py-24 text-on-dark">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <SectionHeader
            eyebrow="Product preview"
            title="A gallery designed around groups, not endless scrolling."
            description="Recommendations, warnings, and compare controls sit directly inside a focused review surface."
            align="left"
            inverted
          />
          <div className="grid grid-cols-3 gap-3 border-y border-white/10 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.88px] text-on-dark-soft">
            {["42 groups", "31 left", "96 top score"].map((stat) => (
              <span key={stat}>{stat}</span>
            ))}
          </div>
        </div>
        <div className="mt-12 rounded-xl border border-white/10 bg-surface-dark-elevated p-3">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {["Grouping", "Best Shot", "Blur Detection"].map((tab) => (
                  <Button
                    key={tab}
                    variant="ghost"
                    className="h-9 rounded-md px-4 text-on-dark hover:bg-white/10 hover:text-on-dark"
                  >
                    {tab}
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-on-dark-soft">
                <Clock3 className="size-4" />
                31 clusters left
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <PhotoTile className="h-44 border-white/15 sm:h-56" state="pick" label="keep" />
                <PhotoTile className="h-44 border-white/15 sm:h-56" label="compare" />
                <PhotoTile className="h-44 border-white/15 sm:h-56" state="blur" />
                <PhotoTile className="h-44 border-white/15 sm:h-56" label="similar" />
                <PhotoTile className="h-44 border-white/15 sm:h-56" label="similar" />
                <PhotoTile className="h-44 border-white/15 sm:h-56" label="similar" />
              </div>
              <aside className="rounded-lg border border-hairline-strong bg-surface-card p-5 text-ink">
                <Badge className="h-auto rounded-full border-transparent bg-surface-strong px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.88px] text-ink">
                  Compare mode
                </Badge>
                <h3 className="mt-4 text-[22px] font-semibold leading-snug tracking-[-0.02em] text-ink">
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
                      className="flex items-center justify-between border-b border-hairline pb-3 text-sm"
                    >
                      <span className="text-body">{label}</span>
                      <span className="font-mono text-ink">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Link
                    href="#"
                    className={cn(
                      buttonVariants(),
                      "h-10 rounded-md px-[18px] text-sm font-medium",
                    )}
                  >
                    <Check className="size-4" />
                    Accept Pick
                  </Link>
                  <Link
                    href="#"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "h-10 rounded-md border-hairline-strong bg-surface-card px-[18px] text-sm font-medium text-ink",
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
      </div>
    </section>
  );
}
