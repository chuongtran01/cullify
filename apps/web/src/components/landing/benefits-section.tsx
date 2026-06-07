import { CheckCircle2 } from "lucide-react";

import { benefits } from "@/components/landing/content";
import { Badge } from "@/components/ui/badge";

export function BenefitsSection() {
  return (
    <section className="bg-canvas">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-24 lg:grid-cols-2 lg:items-center">
        <div>
          <Badge className="h-auto rounded-full border-transparent bg-surface-strong px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-ink">
            Benefits
          </Badge>
          <h2 className="mt-4 text-3xl font-semibold leading-snug tracking-tight text-ink sm:text-4xl">
            Spend your attention on the final choice, not the messy first pass.
          </h2>
          <div className="mt-10 grid border-y border-hairline">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-3 border-b border-hairline py-5 last:border-b-0"
              >
                <CheckCircle2 className="size-5 shrink-0 text-semantic-success" />
                <span className="text-base text-body">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-hairline-strong bg-surface-strong p-4">
          <div className="rounded-lg border border-hairline bg-surface-card p-5">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                Review queue
              </span>
              <Badge className="h-auto rounded-full border-transparent bg-surface-strong px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-ink">
                73% complete
              </Badge>
            </div>
            <div className="grid gap-3">
              {["Keepers", "Rejected blur", "Needs compare"].map(
                (label, index) => (
                  <div
                    key={label}
                    className="rounded-lg border border-hairline bg-canvas p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-semibold text-ink">
                        {label}
                      </span>
                      <span className="font-mono text-xs text-muted">
                        {[128, 42, 16][index]}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-strong">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: ["78%", "34%", "18%"][index] }}
                      />
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
