import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  inverted = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  inverted?: boolean;
}) {
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
      )}
    >
      <Badge
        className={
          inverted
            ? "h-auto rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-on-dark-soft"
            : "h-auto rounded-full border-transparent bg-surface-strong px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-ink"
        }
      >
        {eyebrow}
      </Badge>
      <h2
        className={
          inverted
            ? "mt-4 text-3xl font-semibold leading-snug tracking-tight text-on-dark sm:text-4xl"
            : "mt-4 text-3xl font-semibold leading-snug tracking-tight text-ink sm:text-4xl"
        }
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-5 text-base leading-normal",
            inverted ? "text-on-dark-soft" : "text-body",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
