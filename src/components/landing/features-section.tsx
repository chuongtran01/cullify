import { features } from "@/components/landing/content";
import { SectionHeader } from "@/components/landing/section-header";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function FeaturesSection() {
  return (
    <section id="features" className="border-y border-hairline bg-canvas-soft">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <SectionHeader
          eyebrow="Core features"
          title="Everything built around faster photo selection."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader className="p-5">
                <div className="mb-5 h-28 rounded-lg border border-hairline bg-canvas-soft p-3">
                  <div className="flex h-full items-end justify-between gap-2">
                    <div className="grid size-10 place-items-center rounded-lg bg-surface-card">
                      <feature.icon className="size-5 text-primary" />
                    </div>
                    <span className="rounded-full bg-surface-strong px-2.5 py-1 font-mono text-xs uppercase text-ink">
                      {feature.preview}
                    </span>
                  </div>
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription className="mt-3">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
