import { Sparkles } from "lucide-react";

export function Logo() {
  return (
    <a href="#" className="flex items-center gap-2 text-ink">
      <span className="grid size-8 place-items-center rounded-full bg-primary text-on-primary">
        <Sparkles className="size-4" />
      </span>
      <span className="text-lg font-medium tracking-[-0.01em]">Cullify</span>
    </a>
  );
}
