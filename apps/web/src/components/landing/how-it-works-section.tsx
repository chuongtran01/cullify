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
    <section id="how-it-works" className="border-b border-hairline bg-canvas">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <SectionHeader
          eyebrow="How it works"
          title="One upload becomes a smaller set of confident decisions."
          description="Cullify turns messy batches into grouped review moments, with the strongest frame already surfaced."
        />
        <div className="mt-14 grid border-y border-hairline md:grid-cols-3">
          {steps.map((step, index) => (
            <Card
              key={step.title}
              className="rounded-none border-0 bg-transparent py-0 ring-0 md:border-r md:border-hairline md:last:border-r-0"
            >
              <CardHeader className="p-6 sm:p-8">
                <div className="mb-10 flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-full bg-surface-stone">
                    <step.icon className="size-5 text-ink" />
                  </span>
                  <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
                    0{index + 1}
                  </span>
                </div>
                <CardTitle className="text-2xl font-normal tracking-[-0.01em]">
                  {step.title}
                </CardTitle>
                <CardDescription className="mt-4 leading-6">
                  {step.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
