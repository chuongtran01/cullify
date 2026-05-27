import { CheckCircle2 } from "lucide-react";

import { benefits } from "@/components/landing/content";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function BenefitsSection() {
  return (
    <section className="bg-canvas">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-2 lg:items-center">
      <div>
        <Badge
          variant="outline"
          className="border-hairline bg-transparent font-mono font-normal uppercase tracking-[0.02em] text-muted"
        >
          Benefits
        </Badge>
        <h2 className="mt-4 text-4xl font-normal leading-[1.05] tracking-[-0.02em] text-ink sm:text-5xl">
          Spend your attention on the final choice, not the messy first pass.
        </h2>
        <div className="mt-10 grid border-y border-hairline">
          {benefits.map((benefit) => (
            <Card
              key={benefit}
              className="flex flex-row items-center gap-3 rounded-none border-b border-hairline bg-transparent p-4 py-5 ring-0 last:border-b-0"
            >
              <CheckCircle2 className="size-5 text-semantic-success" />
              <span className="text-body">{benefit}</span>
            </Card>
          ))}
        </div>
      </div>
      <div className="rounded-[22px] border border-hairline bg-surface-stone p-4">
        <div className="rounded-[16px] bg-canvas p-5">
          <div className="mb-5 flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-[0.02em] text-muted">
              Review queue
            </span>
            <Badge className="rounded-full font-mono font-normal uppercase">
              73% complete
            </Badge>
          </div>
          <div className="grid gap-3">
            {["Keepers", "Rejected blur", "Needs compare"].map(
              (label, index) => (
                <Card key={label} className="rounded-sm p-4 ring-0">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-ink">
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
                </Card>
              ),
            )}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
