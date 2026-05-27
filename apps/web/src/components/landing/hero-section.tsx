"use client";

import { ArrowRight, Check, Sparkles, Upload } from "lucide-react";
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
    <section className="bg-canvas">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="mx-auto max-w-5xl px-5 pt-16 pb-8 text-center sm:pt-20"
      >
        <Badge
          variant="outline"
          className="mb-7 h-auto gap-2 rounded-full border-hairline bg-transparent px-4 py-2 font-mono text-xs font-normal uppercase tracking-[0.02em] text-body"
        >
          <Sparkles className="size-3.5 text-coral" />
          AI culling for high-volume review
        </Badge>
        <h1 className="mx-auto max-w-4xl text-6xl font-normal leading-none tracking-[-0.02em] text-ink sm:text-7xl">
          AI photo culling for cleaner first-pass decisions.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-body">
          Cullify removes blurry shots, groups similar frames, and explains the
          strongest picks so large photo batches become small, confident review
          moments.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            className="h-11 cursor-pointer gap-2 rounded-full border-primary !bg-primary px-6 !text-on-primary hover:!border-primary hover:!bg-primary/90 hover:!text-on-primary"
            onClick={onUploadClick}
          >
            <Upload className="size-4" />
            Upload Photos
          </Button>
          <a
            href="#demo"
            className="inline-flex h-11 items-center gap-2 text-sm text-ink underline-offset-4 hover:text-action-blue hover:underline"
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
      <div className="px-5 pb-16">
        <HeroMockup />
      </div>
    </section>
  );
}
