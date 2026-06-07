"use client";

import { motion } from "framer-motion";

import { PhotoTile } from "@/components/landing/photo-tile";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function HeroMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="mx-auto w-full max-w-[1200px]"
    >
      <Card className="grid gap-3 rounded-xl border border-white/10 bg-surface-dark p-3 text-on-dark ring-0 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="gap-0 rounded-lg border border-white/10 bg-surface-dark-elevated py-0 ring-0">
          <CardHeader className="gap-2 p-4 pb-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.88px] text-on-dark-soft">
              Collection review
            </p>
            <CardTitle className="text-lg font-semibold leading-snug tracking-[-0.02em] text-on-dark">
              284 photos grouped into 42 decisions
            </CardTitle>
            <CardAction>
              <Badge className="hidden h-auto rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.88px] text-on-dark-soft sm:inline-flex">
                <span className="mr-2 size-2 rounded-full bg-semantic-success" />
                Live analysis
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="p-4">
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
          </CardContent>
        </Card>

        <Card className="gap-0 rounded-lg border border-white/10 bg-surface-dark-elevated py-0 ring-0">
          <CardHeader className="gap-2 p-5 pb-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.88px] text-on-dark-soft">
              Agent console
            </p>
            <CardTitle className="text-[22px] font-semibold leading-snug tracking-[-0.02em] text-on-dark">
              Quality signals stay attached to every recommendation.
            </CardTitle>
            <CardDescription className="mt-2 text-sm leading-normal text-on-dark-soft">
              Sharpness, duplicate distance, expression quality, and rejection
              reasons are shown as compact evidence instead of hidden scores.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-4">
            <div className="grid gap-3 font-mono text-xs text-on-dark-soft">
              <Card
                size="sm"
                className="gap-3 rounded-lg border border-white/10 bg-white/5 py-3 ring-0"
              >
                <CardContent className="px-3 py-0">
                  <div className="flex items-center justify-between">
                    <span>Thinking</span>
                    <Badge className="h-auto rounded-full border-transparent bg-surface-strong px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.88px] text-ink">
                      blur scan
                    </Badge>
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-white/10">
                    <div className="h-1.5 w-4/5 rounded-full bg-on-dark" />
                  </div>
                </CardContent>
              </Card>
              <Card
                size="sm"
                className="rounded-lg border border-white/10 bg-white/5 py-3 ring-0"
              >
                <CardContent className="flex items-center justify-between px-3 py-0">
                  <span>Grouping</span>
                  <Badge className="h-auto rounded-full border-transparent bg-surface-strong px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.88px] text-ink">
                    12 similar
                  </Badge>
                </CardContent>
              </Card>
              <Card
                size="sm"
                className="rounded-lg border border-white/10 bg-white/5 py-3 ring-0"
              >
                <CardContent className="flex items-center justify-between px-3 py-0">
                  <span>Done</span>
                  <Badge className="h-auto rounded-full border-transparent bg-on-dark px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.88px] text-on-primary">
                    best shot
                  </Badge>
                </CardContent>
              </Card>
              <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                {[
                  ["96", "Sharp"],
                  ["04", "Keeper"],
                  ["42", "Groups"],
                ].map(([value, label]) => (
                  <Card
                    key={label}
                    size="sm"
                    className="rounded-lg bg-white/5 py-3 ring-0"
                  >
                    <CardContent className="px-3 py-0 text-center">
                      <p className="text-lg text-on-dark">{value}</p>
                      <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.88px] text-on-dark-soft">
                        {label}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </Card>
    </motion.div>
  );
}
