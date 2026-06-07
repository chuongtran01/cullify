import { useCases } from "@/components/landing/content";
import { SectionHeader } from "@/components/landing/section-header";

export function UseCasesSection() {
  return (
    <section className="border-y border-hairline bg-canvas-soft">
      <div className="mx-auto max-w-7xl px-5 py-24">
        <SectionHeader
          eyebrow="Use cases"
          title="Built for anyone buried in near-identical photos."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {useCases.map((useCase) => (
            <article
              key={useCase.title}
              className="rounded-lg border border-hairline-strong bg-surface-card p-5"
            >
              <h3 className="text-lg font-semibold leading-snug text-ink">
                {useCase.title}
              </h3>
              <p className="mt-3 text-base leading-normal text-body">
                {useCase.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
