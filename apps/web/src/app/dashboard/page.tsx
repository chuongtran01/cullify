export default function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Batches</p>
        <h1 className="mt-2 text-2xl font-semibold text-ink">Batch Management</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-body">
          Batch progress and processing results will appear here.
        </p>
      </div>

      <div className="grid gap-3 border-y border-hairline py-5 sm:grid-cols-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Processing</p>
          <p className="mt-2 text-2xl font-semibold text-ink">0</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">Ready</p>
          <p className="mt-2 text-2xl font-semibold text-ink">0</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">Needs Review</p>
          <p className="mt-2 text-2xl font-semibold text-ink">0</p>
        </div>
      </div>

      <section className="rounded-md border border-dashed border-hairline bg-surface-card p-6">
        <h2 className="text-sm font-semibold text-ink">No batches yet</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-body">
          Upload and processing history will be shown in this workspace.
        </p>
      </section>
    </div>
  );
}
