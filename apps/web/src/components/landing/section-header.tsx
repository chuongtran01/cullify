import { Badge } from "@/components/ui/badge";

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
      className={
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"
      }
    >
      <Badge
        variant="outline"
        className={
          inverted
            ? "border-white/20 bg-white/5 font-mono font-normal uppercase tracking-[0.02em] text-white/70"
            : "border-hairline bg-transparent font-mono font-normal uppercase tracking-[0.02em] text-muted"
        }
      >
        {eyebrow}
      </Badge>
      <h2
        className={
          inverted
            ? "mt-4 text-4xl font-normal leading-[1.05] tracking-[-0.02em] text-white sm:text-5xl"
            : "mt-4 text-4xl font-normal leading-[1.05] tracking-[-0.02em] text-ink sm:text-5xl"
        }
      >
        {title}
      </h2>
      {description ? (
        <p
          className={
            inverted
              ? "mt-5 text-base leading-7 text-white/70"
              : "mt-5 text-base leading-7 text-body"
          }
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
