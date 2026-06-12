import type { ReactNode } from "react";

type SelectedStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function SelectedState({ title, description, action }: SelectedStateProps) {
  return (
    <section className="rounded-lg border border-hairline-strong bg-surface-card p-8 text-center">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-body">
        {description}
      </p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </section>
  );
}
