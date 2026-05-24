"use client";

import Link from "next/link";
import { Check, Sparkles, Upload } from "lucide-react";
import { motion } from "framer-motion";

import { featureBullets } from "@/components/landing/content";
import { HeroMockup } from "@/components/landing/hero-mockup";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <Badge
          variant="outline"
          className="mb-6 h-auto gap-2 px-3 py-1.5 text-sm font-normal text-body"
        >
          <Sparkles className="size-4 text-primary" />
          AI culling for high-volume photo review
        </Badge>
        <h1 className="max-w-3xl text-6xl font-normal leading-[1.06] text-ink sm:text-7xl">
          AI that picks your best photos instantly
        </h1>
        <p className="mt-6 max-w-prose text-lg leading-8 text-body">
          Remove blurry shots, group similar photos, and select the best images
          in seconds.
        </p>
        <div className="mt-8">
          <Link
            href="#"
            className={cn(
              buttonVariants(),
              "h-10 gap-1.5 border-ink !bg-ink px-4 !text-canvas hover:!border-ink hover:!bg-ink/90 hover:!text-canvas [a]:hover:!bg-ink/90",
            )}
          >
            <Upload className="size-4" />
            Upload Photos
          </Link>
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
