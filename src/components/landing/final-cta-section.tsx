import Link from "next/link";
import { ImagePlus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FinalCtaSection() {
  return (
    <section className="border-y border-hairline bg-surface-card">
      <div className="mx-auto flex max-w-[900px] flex-col items-center px-5 py-24 text-center">
        <h2 className="text-[36px] font-normal leading-[1.2] text-ink">
          Stop manually sorting thousands of photos.
        </h2>
        <p className="mt-4 max-w-[560px] text-base leading-7 text-body">
          Upload a batch, let Cullify find the strongest frames, and leave
          review with a clean set of keepers.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="#"
            className={cn(buttonVariants(), "h-10 px-[18px]")}
          >
            <ImagePlus className="size-4" />
            Upload Photos
          </Link>
          <Link
            href="#demo"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-10 border-hairline-strong bg-surface-card px-[18px] text-ink hover:bg-canvas-soft",
            )}
          >
            Try Demo
          </Link>
        </div>
      </div>
    </section>
  );
}
