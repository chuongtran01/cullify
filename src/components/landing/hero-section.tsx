"use client";

import { ArrowRight, Check, Sparkles, Upload } from "lucide-react";
import { motion } from "framer-motion";

import { ButtonLink } from "@/components/landing/button-link";
import { featureBullets } from "@/components/landing/content";
import { HeroMockup } from "@/components/landing/hero-mockup";

export function HeroSection() {
  return (
    <section className="mx-auto grid max-w-[1200px] gap-12 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-card px-3 py-1.5 text-sm text-body">
          <Sparkles className="size-4 text-primary" />
          AI culling for high-volume photo review
        </div>
        <h1 className="max-w-[760px] text-[56px] font-normal leading-[1.06] text-ink sm:text-[72px] lg:text-[72px]">
          AI that picks your best photos instantly
        </h1>
        <p className="mt-6 max-w-[560px] text-lg leading-8 text-body">
          Remove blurry shots, group similar photos, and select the best images
          in seconds.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink
            variant="default"
            className="h-10 border-ink bg-ink px-[18px] text-canvas hover:bg-[#343229]"
          >
            <Upload className="size-4" />
            Upload Photos
          </ButtonLink>
          <ButtonLink
            variant="outline"
            className="h-10 border-hairline-strong bg-surface-card px-[18px] text-ink hover:bg-canvas-soft"
          >
            View Demo
            <ArrowRight className="size-4" />
          </ButtonLink>
        </div>
        <div className="mt-8 grid gap-3 text-sm text-body sm:grid-cols-3">
          {featureBullets.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <Check className="size-4 text-semantic-success" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </motion.div>
      <HeroMockup />
    </section>
  );
}
