import { useCases } from "@/components/landing/content";
import { SectionHeader } from "@/components/landing/section-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function UseCasesSection() {
  return (
    <section className="border-y border-hairline bg-surface-blue-wash">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <SectionHeader
          eyebrow="Use cases"
          title="Built for anyone buried in near-identical photos."
        />
        <div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          {useCases.map((useCase) => (
            <Card
              key={useCase.title}
              className="rounded-sm border border-card-border bg-canvas py-0 ring-0"
            >
              <CardHeader className="p-5">
                <CardTitle className="text-xl font-normal tracking-[-0.01em]">
                  {useCase.title}
                </CardTitle>
                <CardDescription className="mt-3 leading-6">
                  {useCase.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
