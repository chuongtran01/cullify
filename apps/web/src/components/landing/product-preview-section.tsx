import Link from "next/link";
import { Check, Clock3, MousePointer2 } from "lucide-react";

import { PhotoTile } from "@/components/landing/photo-tile";
import { SectionHeader } from "@/components/landing/section-header";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProductPreviewSection() {
  return (
    <section id="demo" className="bg-deep-green px-5 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <SectionHeader
            eyebrow="Product preview"
            title="A gallery designed around groups, not endless scrolling."
            description="Recommendations, warnings, and compare controls sit directly inside a focused review surface."
            align="left"
            inverted
          />
          <div className="grid grid-cols-3 gap-3 border-y border-white/15 py-4 text-center font-mono text-xs uppercase tracking-[0.02em] text-white/60">
            {["42 groups", "31 left", "96 top score"].map((stat) => (
              <span key={stat}>{stat}</span>
            ))}
          </div>
        </div>
        <div className="mt-12 rounded-[22px] border border-white/10 bg-surface-dark p-3">
          <div className="rounded-[18px] border border-white/10 bg-white/5 p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
              {["Grouping", "Best Shot", "Blur Detection"].map((tab) => (
                <Button
                  key={tab}
                  variant="ghost"
                  className="h-9 rounded-full px-4 text-white hover:bg-white/10 hover:text-white"
                >
                  {tab}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-white/60">
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
            <aside className="rounded-[16px] border border-white/10 bg-white p-5 text-ink">
              <Badge variant="outline" className="border-hairline font-mono font-normal uppercase text-muted">
                Compare mode
              </Badge>
              <h3 className="mt-4 text-3xl font-normal leading-tight tracking-[-0.02em] text-ink">
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
                  className={cn(buttonVariants(), "h-11 rounded-full px-5")}
                >
                  <Check className="size-4" />
                  Accept Pick
                </Link>
                <Link
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    "h-11 rounded-full px-5",
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
