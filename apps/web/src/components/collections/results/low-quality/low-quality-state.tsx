type LowQualityStateProps = {
  title: string;
  description: string;
};

export function LowQualityState({ title, description }: LowQualityStateProps) {
  return (
    <section className="rounded-lg border border-hairline-strong bg-surface-card p-8 text-center">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-body">
        {description}
      </p>
    </section>
  );
}
