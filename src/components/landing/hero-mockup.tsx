"use client";

import { motion } from "framer-motion";

import { PhotoTile } from "@/components/landing/photo-tile";

export function HeroMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="rounded-[16px] border border-hairline bg-surface-card p-3"
    >
      <div className="rounded-[12px] border border-hairline bg-canvas-soft p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase text-muted">
              Batch review
            </p>
            <h2 className="mt-1 text-[18px] font-semibold text-ink">
              284 photos grouped into 42 decisions
            </h2>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-hairline bg-surface-card px-3 py-1.5 font-mono text-[11px] text-body sm:flex">
            <span className="size-2 rounded-full bg-semantic-success" />
            Live analysis
          </div>
        </div>
        <div className="grid grid-cols-6 gap-3">
          <PhotoTile
            className="col-span-4 h-64 sm:h-80"
            label="score 96"
            state="pick"
          />
          <div className="col-span-2 grid gap-3">
            <PhotoTile className="h-[94px] sm:h-[122px]" label="92" />
            <PhotoTile className="h-[94px] sm:h-[122px]" state="blur" />
            <PhotoTile className="h-[94px] sm:h-[122px]" label="88" />
          </div>
        </div>
        <div className="mt-4 grid gap-2 font-mono text-[12px] text-body">
          <div className="flex items-center justify-between rounded-[8px] border border-hairline bg-surface-card px-3 py-2">
            <span>Thinking</span>
            <span className="rounded-full bg-timeline-thinking px-2 py-1 uppercase text-ink">
              blur scan
            </span>
          </div>
          <div className="flex items-center justify-between rounded-[8px] border border-hairline bg-surface-card px-3 py-2">
            <span>Grouping</span>
            <span className="rounded-full bg-timeline-grep px-2 py-1 uppercase text-ink">
              12 similar
            </span>
          </div>
          <div className="flex items-center justify-between rounded-[8px] border border-hairline bg-surface-card px-3 py-2">
            <span>Done</span>
            <span className="rounded-full bg-timeline-done px-2 py-1 uppercase text-on-primary">
              best shot
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
