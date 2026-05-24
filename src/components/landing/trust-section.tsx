import { stats } from "@/components/landing/content";

export function TrustSection() {
  return (
    <section className="border-y border-hairline bg-surface-card">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center sm:text-left">
            <p className="text-4xl font-normal leading-none text-ink">
              {stat.value}
            </p>
            <p className="mt-2 text-sm text-body">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
