import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const badgeClassName =
  "h-auto rounded-full border-transparent bg-surface-strong px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.88px] text-ink";

const invertedBadgeClassName =
  "h-auto rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.88px] text-on-dark-soft";

const titleClassName =
  "mt-4 text-[28px] font-semibold leading-[1.15] tracking-[-0.03em] text-ink sm:text-4xl";

const invertedTitleClassName =
  "mt-4 text-[28px] font-semibold leading-[1.15] tracking-[-0.03em] text-on-dark sm:text-4xl";

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
      <Badge className={inverted ? invertedBadgeClassName : badgeClassName}>
        {eyebrow}
      </Badge>
      <h2 className={inverted ? invertedTitleClassName : titleClassName}>
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
