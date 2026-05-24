import Link from "next/link";
import { Check } from "lucide-react";

import { pricing } from "@/components/landing/content";
import { SectionHeader } from "@/components/landing/section-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PricingSection() {
  return (
    <section id="pricing" className="border-y border-hairline bg-canvas-soft">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <SectionHeader
          eyebrow="Pricing"
          title="Start small, then scale into larger photo batches."
        />
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {pricing.map((tier) => (
            <article
              key={tier.name}
              className={cn(
                "rounded-xl border p-8",
                tier.featured
                  ? "border-ink bg-ink text-canvas"
                  : "border-hairline bg-surface-card text-ink",
              )}
            >
              <h3 className="text-2xl font-normal">{tier.name}</h3>
              <p
                className={cn(
                  "mt-3 text-sm leading-6",
                  tier.featured ? "text-canvas/75" : "text-body",
                )}
              >
                {tier.description}
              </p>
              <div className="mt-6 flex items-end gap-2">
                <span className="text-5xl font-normal leading-none">
                  {tier.price}
                </span>
                <span
                  className={cn(
                    "text-sm",
                    tier.featured ? "text-canvas/75" : "text-muted",
                  )}
                >
                  / month
                </span>
              </div>
              <ul className="mt-8 grid gap-3 text-sm">
                {tier.items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href="#"
                  className={cn(
                    buttonVariants({
                      variant: tier.featured ? "default" : "outline",
                    }),
                    tier.featured
                      ? "h-10 px-4"
                      : "h-10 border-hairline-strong bg-surface-card px-4 text-ink hover:bg-canvas-soft",
                  )}
                >
                  Get Started
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
