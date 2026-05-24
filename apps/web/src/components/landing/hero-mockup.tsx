"use client";

import { motion } from "framer-motion";

import { PhotoTile } from "@/components/landing/photo-tile";
import { Badge } from "@/components/ui/badge";

export function HeroMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="rounded-2xl border border-hairline bg-surface-card p-3"
    >
      <div className="rounded-xl border border-hairline bg-canvas-soft p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase text-muted">
              Batch review
            </p>
            <h2 className="mt-1 text-lg font-semibold text-ink">
              284 photos grouped into 42 decisions
            </h2>
          </div>
          <Badge
            variant="outline"
            className="hidden h-auto gap-2 px-3 py-1.5 font-mono font-normal text-body sm:inline-flex"
          >
            <span className="size-2 rounded-full bg-semantic-success" />
            Live analysis
          </Badge>
        </div>
        <div className="grid grid-cols-6 gap-3">
          <PhotoTile
            className="col-span-4 h-64 sm:h-80"
            label="score 96"
            state="pick"
          />
          <div className="col-span-2 grid gap-3">
            <PhotoTile className="h-24 sm:h-32" label="92" />
            <PhotoTile className="h-24 sm:h-32" state="blur" />
            <PhotoTile className="h-24 sm:h-32" label="88" />
          </div>
        </div>
        <div className="mt-4 grid gap-2 font-mono text-xs text-body">
          <div className="flex items-center justify-between rounded-lg border border-hairline bg-surface-card px-3 py-2">
            <span>Thinking</span>
            <Badge className="bg-timeline-thinking font-mono uppercase text-ink">
              blur scan
            </Badge>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-hairline bg-surface-card px-3 py-2">
            <span>Grouping</span>
            <Badge className="bg-timeline-grep font-mono uppercase text-ink">
              12 similar
            </Badge>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-hairline bg-surface-card px-3 py-2">
            <span>Done</span>
            <Badge className="bg-timeline-done font-mono uppercase text-on-primary">
              best shot
            </Badge>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
