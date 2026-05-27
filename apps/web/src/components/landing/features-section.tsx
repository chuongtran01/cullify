import { features } from "@/components/landing/content";
import { SectionHeader } from "@/components/landing/section-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function FeaturesSection() {
  return (
    <section id="features" className="bg-surface-stone">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <SectionHeader
          eyebrow="Core features"
          title="Everything built around faster photo selection."
          description="Each capability is exposed as plain evidence in the review flow, so the first pass stays fast without becoming opaque."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="rounded-sm border border-card-border bg-white py-0 ring-0"
            >
              <CardHeader className="p-6">
                <div className="mb-6 h-32 rounded-sm border border-hairline bg-canvas p-3">
                  <div className="flex h-full items-end justify-between gap-2">
                    <div className="grid size-10 place-items-center rounded-full bg-primary text-on-primary">
                      <feature.icon className="size-5" />
                    </div>
                    <Badge
                      variant="secondary"
                      className="rounded-full bg-surface-stone font-mono font-normal uppercase text-ink"
                    >
                      {feature.preview}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-2xl font-normal tracking-[-0.01em]">
                  {feature.title}
                </CardTitle>
                <CardDescription className="mt-3 leading-6">
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
