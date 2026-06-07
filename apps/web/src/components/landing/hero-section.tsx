"use client";

import { ArrowRight, Check, Upload } from "lucide-react";
import { motion } from "framer-motion";

import { featureBullets } from "@/components/landing/content";
import { HeroMockup } from "@/components/landing/hero-mockup";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection({
  onUploadClick,
}: {
  onUploadClick: () => void;
}) {
  return (
    <section className="relative overflow-hidden bg-canvas">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(560px,72%)] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,var(--gradient-sky-light)_0%,color-mix(in_srgb,var(--gradient-sky-mid)_55%,transparent)_48%,transparent_78%)]"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative mx-auto max-w-[1200px] px-5 pt-24 pb-12 text-center"
      >
        <Badge className="mb-6 h-auto rounded-full border-transparent bg-surface-strong px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.88px] text-ink">
          AI culling for high-volume review
        </Badge>
        <h1 className="mx-auto max-w-4xl text-[32px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[48px] lg:text-[64px]">
          AI photo culling for cleaner first-pass decisions.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-normal text-body">
          Cullify removes blurry shots, groups similar frames, and explains the
          strongest picks so large photo collections become small, confident review
          moments.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
          <Button
            className="h-10 cursor-pointer gap-2 rounded-md px-[18px] text-sm font-medium"
            onClick={onUploadClick}
          >
            <Upload className="size-4" />
            Upload Photos
          </Button>
          <a
            href="#demo"
            className="inline-flex h-10 items-center gap-2 text-sm font-medium text-text-link"
          >
            Explore the workflow
            <ArrowRight className="size-4" />
          </a>
        </div>
        <div className="mx-auto mt-8 grid max-w-3xl gap-3 border-y border-hairline py-4 text-sm text-body sm:grid-cols-3">
          {featureBullets.map((item) => (
            <div key={item} className="flex items-center justify-center gap-2">
              <Check className="size-4 text-semantic-success" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="relative px-5 pb-24">
        <HeroMockup />
      </div>
    </section>
  );
}
