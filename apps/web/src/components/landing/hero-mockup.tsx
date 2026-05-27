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
      className="mx-auto w-full max-w-6xl rounded-[22px] bg-deep-green p-3 text-white"
    >
      <div className="grid gap-3 rounded-[18px] border border-white/10 bg-surface-dark p-3 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[16px] border border-white/10 bg-white/5 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.02em] text-white/55">
                Batch review
              </p>
              <h2 className="mt-1 text-xl font-normal tracking-[-0.01em] text-white">
                284 photos grouped into 42 decisions
              </h2>
            </div>
            <Badge
              variant="outline"
              className="hidden h-auto gap-2 border-white/15 bg-white/5 px-3 py-1.5 font-mono font-normal text-white/80 sm:inline-flex"
            >
              <span className="size-2 rounded-full bg-surface-green-wash" />
              Live analysis
            </Badge>
          </div>
          <div className="grid grid-cols-6 gap-3">
            <PhotoTile
              className="col-span-4 h-64 border-white/15 sm:h-80"
              label="score 96"
              state="pick"
            />
            <div className="col-span-2 grid gap-3">
              <PhotoTile className="h-24 border-white/15 sm:h-32" label="92" />
              <PhotoTile
                className="h-24 border-white/15 sm:h-32"
                state="blur"
              />
              <PhotoTile className="h-24 border-white/15 sm:h-32" label="88" />
            </div>
          </div>
        </div>
        <div className="rounded-[16px] border border-white/10 bg-black/20 p-5">
          <p className="font-mono text-xs uppercase tracking-[0.02em] text-white/55">
            Agent console
          </p>
          <h3 className="mt-2 text-3xl font-normal leading-tight tracking-[-0.02em] text-white">
            Quality signals stay attached to every recommendation.
          </h3>
          <p className="mt-4 text-sm leading-6 text-white/65">
            Sharpness, duplicate distance, expression quality, and rejection
            reasons are shown as compact evidence instead of hidden scores.
          </p>
          <div className="mt-8 grid gap-3 font-mono text-xs text-white/75">
            <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-3">
              <div className="mb-3 flex items-center justify-between">
                <span>Thinking</span>
                <Badge className="bg-coral-soft font-mono uppercase text-ink">
                  blur scan
                </Badge>
              </div>
              <div className="h-1.5 rounded-full bg-white/10">
                <div className="h-1.5 w-[78%] rounded-full bg-white" />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-3">
              <span>Grouping</span>
              <Badge className="bg-surface-green-wash font-mono uppercase text-ink">
                12 similar
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-3">
              <span>Done</span>
              <Badge className="bg-white font-mono uppercase text-primary">
                best shot
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2 text-center">
              {[
                ["96", "Sharp"],
                ["04", "Keeper"],
                ["42", "Groups"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-lg bg-white/5 px-3 py-3">
                  <p className="text-lg text-white">{value}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.08em] text-white/45">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
