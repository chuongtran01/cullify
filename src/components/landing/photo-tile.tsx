import { CircleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

export function PhotoTile({
  className,
  label,
  state,
}: {
  className?: string;
  label?: string;
  state?: "pick" | "blur";
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[12px] border border-hairline bg-surface-card",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#e7d5c9,#f7f7f4_38%,#b7c5aa_70%,#736f65)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_24%,rgba(255,255,255,0.85),transparent_22%),radial-gradient(circle_at_28%_76%,rgba(38,37,30,0.2),transparent_28%)]" />
      {state === "pick" ? (
        <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold uppercase text-on-primary">
          AI Pick
        </span>
      ) : null}
      {state === "blur" ? (
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-surface-card px-2.5 py-1 text-[11px] font-semibold uppercase text-semantic-error">
          <CircleAlert className="size-3" />
          Blur
        </span>
      ) : null}
      {label ? (
        <span className="absolute bottom-3 left-3 rounded-full bg-white/85 px-2.5 py-1 font-mono text-[11px] text-ink">
          {label}
        </span>
      ) : null}
    </div>
  );
}
