type LowQualityStateProps = {
  title: string;
  description: string;
};

export function LowQualityState({ title, description }: LowQualityStateProps) {
  return (
    <section className="rounded-md border border-hairline bg-surface-card p-8 text-center">
      <h2 className="text-lg font-normal text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-body">
        {description}
      </p>
    </section>
  );
}
