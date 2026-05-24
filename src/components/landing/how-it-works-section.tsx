import { steps } from "@/components/landing/content";
import { SectionHeader } from "@/components/landing/section-header";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-5 py-20">
      <SectionHeader
        eyebrow="How it works"
        title="One upload becomes a smaller set of confident decisions."
        description="Cullify turns messy batches into grouped review moments, with the strongest frame already surfaced."
      />
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <Card key={step.title}>
            <CardHeader>
              <div className="mb-8 flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-lg bg-surface-strong">
                  <step.icon className="size-5 text-ink" />
                </span>
                <span className="font-mono text-xs text-muted">
                  0{index + 1}
                </span>
              </div>
              <CardTitle>{step.title}</CardTitle>
              <CardDescription className="mt-3">
                {step.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
