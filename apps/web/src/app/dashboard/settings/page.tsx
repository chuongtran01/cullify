export default function SettingsPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Settings</p>
        <h1 className="mt-2 text-2xl font-semibold text-ink">Workspace Settings</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-body">
          Processing preferences and account controls will appear here.
        </p>
      </div>

      <section className="rounded-md border border-dashed border-hairline bg-surface-card p-6">
        <h2 className="text-sm font-semibold text-ink">Settings coming soon</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-body">
          Quality thresholds, notifications, and review defaults will live here.
        </p>
      </section>
    </div>
  );
}
