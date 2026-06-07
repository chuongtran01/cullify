import { steps } from "@/components/landing/content";
import { SectionHeader } from "@/components/landing/section-header";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-b border-hairline bg-canvas">
      <div className="mx-auto max-w-7xl px-5 py-24">
        <SectionHeader
          eyebrow="How it works"
          title="One upload becomes a smaller set of confident decisions."
          description="Cullify turns messy collections into grouped review moments, with the strongest frame already surfaced."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="rounded-lg border border-hairline-strong bg-surface-card p-5 sm:p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="grid size-8 place-items-center rounded-md bg-surface-strong">
                  <step.icon className="size-4 text-ink" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                  0{index + 1}
                </span>
              </div>
              <h3 className="text-lg font-semibold leading-snug text-ink">
                {step.title}
              </h3>
              <p className="mt-3 text-base leading-normal text-body">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
