import { features } from "@/components/landing/content";
import { SectionHeader } from "@/components/landing/section-header";
import { Badge } from "@/components/ui/badge";

export function FeaturesSection() {
  return (
    <section id="features" className="bg-canvas-soft">
      <div className="mx-auto max-w-7xl px-5 py-24">
        <SectionHeader
          eyebrow="Core features"
          title="Everything built around faster photo selection."
          description="Each capability is exposed as plain evidence in the review flow, so the first pass stays fast without becoming opaque."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-lg border border-hairline-strong bg-surface-card p-6"
            >
              <div className="mb-6 h-32 rounded-lg border border-hairline bg-canvas p-3">
                <div className="flex h-full items-end justify-between gap-2">
                  <div className="grid size-8 place-items-center rounded-md bg-primary text-on-primary">
                    <feature.icon className="size-4" />
                  </div>
                  <Badge className="h-auto rounded-full border-transparent bg-surface-strong px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-ink">
                    {feature.preview}
                  </Badge>
                </div>
              </div>
              <h3 className="text-lg font-semibold leading-snug text-ink">
                {feature.title}
              </h3>
              <p className="mt-3 text-base leading-normal text-body">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
