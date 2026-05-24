export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-[672px] text-center">
      <p className="text-[11px] font-semibold uppercase text-muted">{eyebrow}</p>
      <h2 className="mt-3 text-[36px] font-normal leading-[1.2] text-ink">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-body">{description}</p>
      ) : null}
    </div>
  );
}
