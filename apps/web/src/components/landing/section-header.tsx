import { Badge } from "@/components/ui/badge";

export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <Badge variant="outline" className="font-semibold uppercase text-muted">
        {eyebrow}
      </Badge>
      <h2 className="mt-3 text-4xl font-normal leading-[1.2] text-ink">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-body">{description}</p>
      ) : null}
    </div>
  );
}
