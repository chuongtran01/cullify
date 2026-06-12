import { Badge } from "@/components/ui/badge";

type SelectedHeaderProps = {
  isPending: boolean;
  total: number;
};

export function SelectedHeader({ isPending, total }: SelectedHeaderProps) {
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-hairline-strong bg-surface-card p-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-body">
          Selected photos
        </p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight text-ink">
          Final photo set
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-body">
          Review every photo currently included in this collection&apos;s final set.
        </p>
      </div>
      <Badge
        variant="outline"
        className="h-8 w-fit rounded-full px-3 text-sm text-body"
      >
        {isPending ? "Loading" : `${total} photos`}
      </Badge>
    </section>
  );
}
