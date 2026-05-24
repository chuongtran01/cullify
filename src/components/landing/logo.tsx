import { Sparkles } from "lucide-react";

export function Logo() {
  return (
    <a href="#" className="flex items-center gap-2 text-ink">
      <span className="grid size-8 place-items-center rounded-[8px] border border-hairline-strong bg-surface-card">
        <Sparkles className="size-4 text-primary" />
      </span>
      <span className="text-[18px] font-semibold">Cullify</span>
    </a>
  );
}
