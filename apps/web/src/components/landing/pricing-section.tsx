import Link from "next/link";
import { Check } from "lucide-react";

import { pricing } from "@/components/landing/content";
import { SectionHeader } from "@/components/landing/section-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PricingSection() {
  return (
    <section id="pricing" className="border-y border-hairline bg-canvas">
      <div className="mx-auto max-w-7xl px-5 py-24">
        <SectionHeader
          eyebrow="Pricing"
          title="Start small, then scale into larger photo collections."
        />
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {pricing.map((tier) => (
            <article
              key={tier.name}
              className={cn(
                "rounded-lg border p-8",
                tier.featured
                  ? "border-transparent bg-surface-dark text-on-dark"
                  : "border-hairline-strong bg-surface-card text-ink",
              )}
            >
              <h3 className="text-2xl font-semibold leading-snug tracking-tight">
                {tier.name}
              </h3>
              <p
                className={cn(
                  "mt-3 text-sm leading-normal",
                  tier.featured ? "text-on-dark-soft" : "text-body",
                )}
              >
                {tier.description}
              </p>
              <div className="mt-6 flex items-end gap-2">
                <span className="text-5xl font-semibold leading-none tracking-tight">
                  {tier.price}
                </span>
                <span
                  className={cn(
                    "text-sm",
                    tier.featured ? "text-on-dark-soft" : "text-muted",
                  )}
                >
                  / month
                </span>
              </div>
              <ul className="mt-8 grid gap-3 text-sm leading-normal">
                {tier.items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="size-4 shrink-0" />
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
                      ? "h-10 cursor-pointer rounded-md px-4.5 text-sm font-medium"
                      : "h-10 cursor-pointer rounded-md border border-hairline-strong bg-surface-card px-4.5 text-sm font-medium text-ink",
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
