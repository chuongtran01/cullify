export default function ReviewPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Review</p>
        <h1 className="mt-2 text-2xl font-semibold text-ink">Review Queue</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-body">
          Similar-shot groups and recommendations will appear here.
        </p>
      </div>

      <section className="rounded-md border border-dashed border-hairline bg-surface-card p-6">
        <h2 className="text-sm font-semibold text-ink">Nothing to review</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-body">
          Completed processing collections will create review items in this space.
        </p>
      </section>
    </div>
  );
}
