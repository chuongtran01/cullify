import { CheckCircle2 } from "lucide-react";

import { benefits } from "@/components/landing/content";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function BenefitsSection() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-2 lg:items-center">
      <div>
        <Badge variant="outline" className="font-semibold uppercase text-muted">
          Benefits
        </Badge>
        <h2 className="mt-3 text-4xl font-normal leading-[1.2] text-ink">
          Spend your attention on the final choice, not the messy first pass.
        </h2>
        <div className="mt-8 grid gap-4">
          {benefits.map((benefit) => (
            <Card key={benefit} className="flex items-center gap-3 p-4">
              <CheckCircle2 className="size-5 text-semantic-success" />
              <span className="text-body">{benefit}</span>
            </Card>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-hairline bg-surface-card p-4">
        <div className="rounded-xl bg-canvas-soft p-5">
          <div className="mb-5 flex items-center justify-between">
            <span className="font-mono text-xs uppercase text-muted">
              Review queue
            </span>
            <Badge className="font-semibold">73% complete</Badge>
          </div>
          <div className="grid gap-3">
            {["Keepers", "Rejected blur", "Needs compare"].map(
              (label, index) => (
                <Card key={label} className="p-4">
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
                      className="h-2 rounded-full bg-ink"
                      style={{ width: ["78%", "34%", "18%"][index] }}
                    />
                  </div>
                </Card>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
