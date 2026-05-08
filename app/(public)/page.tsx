import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      <section className="panel">
        <h1 className="text-3xl font-semibold">Eventos</h1>
        <p className="mt-2 text-sm text-[var(--muted)]/80">
          Unified social feed, event management, and assessments platform.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Feed", "/"],
          ["Events", "/events"],
          ["Dashboard", "/dashboard"],
        ].map(([label, href]) => (
          <Link key={href} className="panel transition hover:scale-[1.01]" href={href}>
            <span className="text-lg font-medium text-[var(--accent)]">{label}</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
