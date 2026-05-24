import { Check } from "lucide-react";

import { ButtonLink } from "@/components/landing/button-link";
import { pricing } from "@/components/landing/content";
import { SectionHeader } from "@/components/landing/section-header";
import { cn } from "@/lib/utils";

export function PricingSection() {
  return (
    <section id="pricing" className="border-y border-hairline bg-canvas-soft">
      <div className="mx-auto max-w-[1200px] px-5 py-20">
        <SectionHeader
          eyebrow="Pricing"
          title="Start small, then scale into larger photo batches."
        />
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {pricing.map((tier) => (
            <article
              key={tier.name}
              className={cn(
                "rounded-[12px] border p-8",
                tier.featured
                  ? "border-ink bg-ink text-canvas"
                  : "border-hairline bg-surface-card text-ink",
              )}
            >
              <h3 className="text-[22px] font-normal">{tier.name}</h3>
              <p
                className={cn(
                  "mt-3 text-sm leading-6",
                  tier.featured ? "text-canvas/75" : "text-body",
                )}
              >
                {tier.description}
              </p>
              <div className="mt-6 flex items-end gap-2">
                <span className="text-[42px] font-normal leading-none">
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
                <ButtonLink variant={tier.featured ? "primary" : "secondary"}>
                  Get Started
                </ButtonLink>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
