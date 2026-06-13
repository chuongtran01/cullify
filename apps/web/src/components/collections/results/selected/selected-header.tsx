import { Badge } from "@/components/ui/badge";

type SelectedHeaderProps = {
  isPending: boolean;
  total: number;
};

export function SelectedHeader({ isPending, total }: SelectedHeaderProps) {
  return (
    <section className="flex flex-col gap-4 border-b border-hairline-strong pb-7 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-3xl font-semibold leading-tight text-ink">
          Selected Photos
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-body">
          Review every photo currently included in the final set.
        </p>
      </div>
      <Badge className="rounded-full border-0 bg-surface-strong px-3 py-1 text-sm font-medium text-body shadow-none">
        {isPending ? "Loading..." : `${total} photos`}
      </Badge>
    </section>
  );
}
